import { useEffect, useMemo, useState } from "react";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";

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

function ResizableTable({ columns, rows, storageKey, renderRow }) {
  const [columnWidths, setColumnWidths] = useState(() => getStoredWidths(storageKey));

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(columnWidths));
  }, [columnWidths, storageKey]);

  const resolvedColumns = useMemo(
    () =>
      columns.map((column) => ({
        ...column,
        currentWidth: Math.max(column.minWidth || 60, columnWidths[column.key] || column.width || 120),
      })),
    [columnWidths, columns]
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

  return (
    <div className="table-card">
      <div className="table-scroll-x">
        <table style={{ width: tableWidth, minWidth: tableWidth }}>
          <TableHeader columns={resolvedColumns} onResize={handleResize} />
          <TableBody columns={resolvedColumns} rows={rows} renderRow={renderRow} />
        </table>
      </div>
    </div>
  );
}

export default ResizableTable;
