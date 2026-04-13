import { useMemo, useRef, useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, Plus } from "lucide-react";

function TableHeader({
  columns,
  onResize,
  sortConfig,
  onSortChange,
  allRowsSelected = false,
  onToggleAllRows,
  hiddenColumns = [],
  removableColumns = [],
  onShowColumn,
  onHideColumn,
  onMoveColumn,
}) {
  const resizeStateRef = useRef(null);
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);

  const handleMouseMove = (event) => {
    if (!resizeStateRef.current) {
      return;
    }

    const { key, startX, startWidth, minWidth } = resizeStateRef.current;
    const delta = event.clientX - startX;
    onResize(key, Math.max(minWidth, startWidth + delta));
  };

  const stopResize = () => {
    resizeStateRef.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResize);
  };

  const startResize = (event, column) => {
    event.preventDefault();
    event.stopPropagation();

    resizeStateRef.current = {
      key: column.key,
      startX: event.clientX,
      startWidth: column.currentWidth,
      minWidth: column.minWidth || 60,
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResize);
  };

  const lastColumnKey = useMemo(
    () => columns[columns.length - 1]?.key,
    [columns]
  );

  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            className={`${column.className || ""} ${column.resizable === false ? "" : "is-resizable"}`}
            style={{ width: column.currentWidth, minWidth: column.currentWidth, maxWidth: column.currentWidth }}
          >
            {column.checkbox ? (
              <input
                type="checkbox"
                checked={allRowsSelected}
                onChange={(event) => onToggleAllRows?.(event.target.checked)}
              />
            ) : column.className === "icon-col" ? null : (
              <div className="table-header-shell">
                <button
                  type="button"
                  className="table-header-label"
                  onClick={() => onSortChange?.(column.key)}
                >
                  <span>{column.label}</span>
                  <span className="table-header-sort">
                    <ChevronUp
                      size={11}
                      opacity={sortConfig?.key === column.key && sortConfig?.direction === "asc" ? 1 : 0.35}
                    />
                    <ChevronDown
                      size={11}
                      opacity={sortConfig?.key === column.key && sortConfig?.direction === "desc" ? 1 : 0.35}
                    />
                  </span>
                </button>
                {column.key === lastColumnKey ? (
                  <div className="table-column-picker">
                    <button
                      type="button"
                      className="table-column-picker-trigger animate-ping"
                      onClick={(event) => {
                        event.stopPropagation();
                        setIsColumnMenuOpen((current) => !current);
                      }}
                    >
                      <Plus className={''} size={10} />
                      {/* <span>Add</span> */}
                    </button>
                    {isColumnMenuOpen ? (
                      <div className="table-column-picker-menu">
                        <div className="table-column-picker-section">
                          <div className="table-column-picker-title">Add Columns</div>
                          {hiddenColumns.length ? (
                            hiddenColumns.map((item) => (
                              <label key={item.key} className="table-column-picker-item">
                                <input
                                  type="checkbox"
                                  checked={false}
                                  onChange={(event) => {
                                    if (event.target.checked) {
                                      onShowColumn?.(item.key);
                                    }
                                  }}
                                />
                                <span>{item.label}</span>
                              </label>
                            ))
                          ) : (
                            <div className="table-column-picker-empty">No columns to add</div>
                          )}
                        </div>
                        <div className="table-column-picker-section">
                          <div className="table-column-picker-title">Remove Columns</div>
                          {removableColumns.length ? (
                            removableColumns.map((item) => (
                              <div key={item.key} className="table-column-picker-row">
                                <label className="table-column-picker-item">
                                  <input
                                    type="checkbox"
                                    checked
                                    onChange={(event) => {
                                      if (!event.target.checked) {
                                        onHideColumn?.(item.key);
                                      }
                                    }}
                                  />
                                  <span>{item.label}</span>
                                </label>
                                <div className="table-column-picker-actions">
                                  <button
                                    type="button"
                                    className="table-column-order-button"
                                    onClick={() => onMoveColumn?.(item.key, "up")}
                                    disabled={item.isFirst}
                                    title="Move up"
                                  >
                                    <ChevronUp size={12} />
                                  </button>
                                  <button
                                    type="button"
                                    className="table-column-order-button"
                                    onClick={() => onMoveColumn?.(item.key, "down")}
                                    disabled={item.isLast}
                                    title="Move down"
                                  >
                                    <ChevronDown size={12} />
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="table-column-picker-empty">No columns to remove</div>
                          )}
                        </div>
                        <div className="table-column-picker-section">
                          <div className="table-column-picker-title">Arrange Columns</div>
                          {removableColumns.length ? (
                            removableColumns.map((item) => (
                              <div key={`${item.key}-arrange`} className="table-column-picker-row">
                                <div className="table-column-picker-arrange-label">
                                  <ChevronsUpDown size={12} />
                                  <span>{item.label}</span>
                                </div>
                                <div className="table-column-picker-actions">
                                  <button
                                    type="button"
                                    className="table-column-order-button"
                                    onClick={() => onMoveColumn?.(item.key, "up")}
                                    disabled={item.isFirst}
                                    title="Move up"
                                  >
                                    <ChevronUp size={12} />
                                  </button>
                                  <button
                                    type="button"
                                    className="table-column-order-button"
                                    onClick={() => onMoveColumn?.(item.key, "down")}
                                    disabled={item.isLast}
                                    title="Move down"
                                  >
                                    <ChevronDown size={12} />
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="table-column-picker-empty">No columns to arrange</div>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )}
            {column.resizable === false ? null : (
              <span
                className="table-resize-handle"
                onMouseDown={(event) => startResize(event, column)}
              />
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default TableHeader;
