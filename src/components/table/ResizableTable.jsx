import { useEffect, useMemo, useState } from "react";
import TableHeader from "./TableHeader";
import { Edit, Star } from "lucide-react";
import TableSkeleton from "./TableSkeleton";
import NoTableData from "./NoTableData";
import ColumnArranger from "./ColumnArranger";

const statusClassMap = {
  active: "status-green",
  pending: "status-amber",
  inactive: "status-gray",
  rejected: "status-red",
  review: "status-purple",
};

function getCellStyle(column) {
  return {
    width: column.currentWidth,
    minWidth: column.currentWidth,
    maxWidth: column.currentWidth,
  };
}

function getStatusClass(value) {
  if (!value) {
    return "status-gray";
  }

  return statusClassMap[String(value).trim().toLowerCase()] || "status-gray";
}

function getRowIdentifier(row) {
  return row?._id ?? row?.id ?? row?.adminID ?? row?.ticket_id ?? row?.menu_id ?? row?.roleId ?? row?.userId;
}

function renderCell(column, row, index, selectionProps = {}) {
  const value = row[column.key];
  const { selectedRowIds = [], onToggleRow } = selectionProps;

  if (column.checkbox) {
    const rowId = getRowIdentifier(row);
    return (
      <input
        type="checkbox"
        checked={selectedRowIds.includes(rowId)}
        onChange={(event) => {
          event.stopPropagation();
          onToggleRow?.(rowId, event.target.checked);
        }}
        onClick={(event) => event.stopPropagation()}
      />
    );
  }

  if (column.className === "icon-col") {
    return (
      <button className="table-icon-button user-favorite-button">
        <Star size={14} fill={row.favorite || index % 5 === 1 ? "currentColor" : "none"} />
      </button>
    );
  }

  if (column.cellType === "person") {
    return (
      <div className="person-cell">
        <span className={`person-avatar avatar-${index % 6}`}>{String(value || "?").charAt(0)}</span>
        <span className="text-overflow">{value}</span>
      </div>
    );
  }

  if (column.cellType === "clip") {
    return <div className="text-overflow table-text-clip">{value}</div>;
  }

  if (column.cellType === "tag") {
    return <span className="text-overflow tag lilac">{value}</span>;
  }

  if (column.cellType === "dotText") {
    return (
      <div className="company-cell">
        <span className={`company-dot user-department-dot dept-${index % 5}`} />
        <span className="text-overflow">{value}</span>
      </div>
    );
  }

  if (column.cellType === "status") {
    return <span className={`text-overflow status-pill ${getStatusClass(value)}`}>{value}</span>;
  }

  return value;
}

function renderConfigRow(row, index, columns, editRow, selectionProps) {
  return (
    <tr
      key={row.id ?? row.name ?? index}
    >
      {columns.map((column) => (
        <td
          key={column.key}
          className={column.className || ""}
          style={getCellStyle(column)}
          onClick={typeof editRow === "function" ? () => editRow(row) : undefined}
        >
          {renderCell(column, row, index, selectionProps)}
        </td>
      ))}
    </tr>
  );
}

function getStoredWidths(storageKey) {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    return JSON.parse(window.localStorage.getItem(storageKey) || "{}");
  } catch {
    return {};
  }
}

function getStoredVisibleColumnKeys(storageKey) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return JSON.parse(window.localStorage.getItem(`${storageKey}-visible-columns`) || "null");
  } catch {
    return null;
  }
}

function getDefaultVisibleColumnKeys(columns, defaultVisibleColumnKeys = []) {
  const fixedColumnKeys = columns
    .filter((column) => column.checkbox || column.className === "icon-col" || column.isAlwaysVisible)
    .map((column) => column.key);

  if (defaultVisibleColumnKeys.length) {
    return [...new Set([...fixedColumnKeys, ...defaultVisibleColumnKeys])];
  }

  return columns.map((column) => column.key);
}

function reorderKeys(keys, keyToMove, direction) {
  const currentIndex = keys.indexOf(keyToMove);
  if (currentIndex === -1) {
    return keys;
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= keys.length) {
    return keys;
  }

  const nextKeys = [...keys];
  const [movedItem] = nextKeys.splice(currentIndex, 1);
  nextKeys.splice(targetIndex, 0, movedItem);
  return nextKeys;
}

function ResizableTable({
  columns,
  rows,
  storageKey,
  renderRow,
  editRow,
  loading,
  sortConfig,
  onSortChange,
  selectedRowIds = [],
  onToggleRow,
  onToggleAllRows,
  defaultVisibleColumnKeys = [],
}) {
  const [columnWidths, setColumnWidths] = useState(() => getStoredWidths(storageKey));
  const [visibleColumnKeys, setVisibleColumnKeys] = useState(() =>
    getStoredVisibleColumnKeys(storageKey) || getDefaultVisibleColumnKeys(columns, defaultVisibleColumnKeys)
  );
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);


  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(columnWidths));
  }, [columnWidths, storageKey]);

  useEffect(() => {
    const nextDefaultKeys = getDefaultVisibleColumnKeys(columns, defaultVisibleColumnKeys);
    const storedKeys = getStoredVisibleColumnKeys(storageKey);

    setVisibleColumnKeys((current) => {
      const preferredKeys =
        Array.isArray(storedKeys) && storedKeys.length
          ? storedKeys
          : current?.length
            ? current
            : nextDefaultKeys;
      const ensuredFixedColumns = nextDefaultKeys.filter((key) => !preferredKeys.includes(key));
      return [...new Set([...preferredKeys, ...ensuredFixedColumns])];
    });
  }, [columns, defaultVisibleColumnKeys, storageKey]);

  useEffect(() => {
    window.localStorage.setItem(
      `${storageKey}-visible-columns`,
      JSON.stringify(visibleColumnKeys)
    );
  }, [storageKey, visibleColumnKeys]);

  const resolvedColumns = useMemo(
    () =>
      visibleColumnKeys
        .map((key) => columns.find((column) => column.key === key))
        .filter(Boolean)
        .map((column) => ({
          ...column,
          currentWidth: Math.max(column.minWidth || 60, columnWidths[column.key] || column.width || 120),
        })),
    [columnWidths, columns, visibleColumnKeys]
  );

  const hiddenColumns = useMemo(
    () =>
      columns.filter(
        (column) =>
          !visibleColumnKeys.includes(column.key) &&
          !column.checkbox &&
          column.className !== "icon-col"
      ),
    [columns, visibleColumnKeys]
  );

  const removableColumns = useMemo(
    () => {
      const items = visibleColumnKeys
        .map((key) => columns.find((column) => column.key === key))
        .filter(
          (column) =>
            column &&
            !column.checkbox &&
            column.className !== "icon-col" &&
            !column.isAlwaysVisible
        );

      return items.map((column, index) => ({
        ...column,
        isFirst: index === 0,
        isLast: index === items.length - 1,
      }));
    },
    [columns, visibleColumnKeys]
  );

  const tableWidth = useMemo(
    () => resolvedColumns.reduce((total, column) => total + column.currentWidth, 0),
    [resolvedColumns]
  );

  const handleResize = (key, nextWidth) => {
    setColumnWidths((current) => ({
      ...current,
      [key]: nextWidth,
    }));
  };

  const handleShowColumn = (columnKey) => {
    setVisibleColumnKeys((current) => [...new Set([...current, columnKey])]);
  };

  const handleHideColumn = (columnKey) => {
    setVisibleColumnKeys((current) => current.filter((key) => key !== columnKey));
  };

  const handleMoveColumn = (columnKey, direction) => {
    setVisibleColumnKeys((current) => reorderKeys(current, columnKey, direction));
  };

  const selectableRows = useMemo(
    () => (rows || []).map((row) => getRowIdentifier(row)).filter(Boolean),
    [rows]
  );
  const allRowsSelected =
    selectableRows.length > 0 &&
    selectableRows.every((rowId) => selectedRowIds.includes(rowId));

  return (
    <div className="table-card">
      <ColumnArranger
        setIsColumnMenuOpen={setIsColumnMenuOpen}
        isColumnMenuOpen={isColumnMenuOpen}
        hiddenColumns={hiddenColumns}
        removableColumns={removableColumns}
        onShowColumn={handleShowColumn}
        onHideColumn={handleHideColumn}
        onMoveColumn={handleMoveColumn}
      />
      <div className="table-scroll-x">
        <table style={{ width: tableWidth, minWidth: tableWidth }}>
          <TableHeader
            setIsColumnMenuOpen={setIsColumnMenuOpen}
            columns={resolvedColumns}
            onResize={handleResize}
            sortConfig={sortConfig}
            onSortChange={onSortChange}
            allRowsSelected={allRowsSelected}
            onToggleAllRows={onToggleAllRows}
          />
          <tbody>
            {loading && <TableSkeleton resolvedColumns={resolvedColumns} rows={10} columns={10} />}
            {!loading && rows &&
              rows.map((row, index) =>
                typeof renderRow === "function"
                  ? renderRow(row, index, resolvedColumns)
                  : renderConfigRow(row, index, resolvedColumns, editRow, {
                    selectedRowIds,
                    onToggleRow,
                  })
              )
            }
            {!loading && (!rows || rows.length === 0) &&
              <>
                <NoTableData colSpan={Math.max(resolvedColumns.length, 1)} />
              </>
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResizableTable;
