import { useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

function TableHeader({ columns, onResize }) {
  const resizeStateRef = useRef(null);

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
              <input type="checkbox" />
            ) : column.className === "icon-col" ? null : (
              <span className="table-header-label">
                <span>{column.label}</span>
                <span className="table-header-sort">
                  <ChevronUp size={11} />
                  <ChevronDown size={11} />
                </span>
              </span>
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
