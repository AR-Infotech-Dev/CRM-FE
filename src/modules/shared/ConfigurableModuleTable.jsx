import { Star } from "lucide-react";
import ResizableTable from "../../components/table/ResizableTable";

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

function renderCell(column, row, index) {
  const value = row[column.key];

  if (column.checkbox) {
    return <input type="checkbox" />;
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
        <span>{value}</span>
      </div>
    );
  }

  if (column.cellType === "clip") {
    return <div className="table-text-clip">{value}</div>;
  }

  if (column.cellType === "tag") {
    return <span className="tag lilac">{value}</span>;
  }

  if (column.cellType === "dotText") {
    return (
      <div className="company-cell">
        <span className={`company-dot user-department-dot dept-${index % 5}`} />
        <span>{value}</span>
      </div>
    );
  }

  if (column.cellType === "status") {
    return <span className={`status-pill ${getStatusClass(value)}`}>{value}</span>;
  }

  return value;
}

function renderConfigRow(row, index, columns) {
  return (
    <tr key={row.id ?? row.name ?? index}>
      {columns.map((column) => (
        <td
          key={column.key}
          className={column.className || ""}
          style={getCellStyle(column)}
        >
          {renderCell(column, row, index)}
        </td>
      ))}
    </tr>
  );
}

function ConfigurableModuleTable({ columns, rows, storageKey }) {
  return (
    <ResizableTable
      columns={columns}
      rows={rows}
      storageKey={storageKey}
      renderRow={renderConfigRow}
    />
  );
}

export default ConfigurableModuleTable;
