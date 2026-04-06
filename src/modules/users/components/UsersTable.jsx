import { Star } from "lucide-react";
import ResizableTable from "../../../components/table/ResizableTable";
import { usersColumns, usersRows } from "../data/usersModuleData";

function getCellStyle(column) {
  return {
    width: column.currentWidth,
    minWidth: column.currentWidth,
    maxWidth: column.currentWidth,
  };
}

function renderUserRow(row, index, columns) {
  return (
    <tr key={`${row.id}-${index}`}>
      <td className="check-col" style={getCellStyle(columns[0])}>
        <input type="checkbox" />
      </td>
      <td className="icon-col" style={getCellStyle(columns[1])}>
        <button className="table-icon-button user-favorite-button">
          <Star size={14} fill={index % 5 === 1 ? "currentColor" : "none"} />
        </button>
      </td>
      <td style={getCellStyle(columns[2])}>{row.id}</td>
      <td style={getCellStyle(columns[3])}>
        <div className="person-cell">
          <span className={`person-avatar avatar-${index % 6}`}>{row.name.charAt(0)}</span>
          <span>{row.name}</span>
        </div>
      </td>
      <td style={getCellStyle(columns[4])}>
        <div className="table-text-clip">{row.email}</div>
      </td>
      <td style={getCellStyle(columns[5])}>
        <span className="tag lilac">{row.role}</span>
      </td>
      <td style={getCellStyle(columns[6])}>{row.phone}</td>
      <td style={getCellStyle(columns[7])}>
        <div className="company-cell">
          <span className={`company-dot user-department-dot dept-${index % 5}`} />
          <span>{row.department}</span>
        </div>
      </td>
      <td style={getCellStyle(columns[8])}>
        <span
          className={`status-pill ${
            row.status === "Active"
              ? "status-green"
              : row.status === "Pending"
                ? "status-amber"
                : "status-gray"
          }`}
        >
          {row.status}
        </span>
      </td>
    </tr>
  );
}

function UsersTable() {
  return (
    <ResizableTable
      columns={usersColumns}
      rows={usersRows}
      storageKey="users-module-column-widths"
      renderRow={renderUserRow}
    />
  );
}

export default UsersTable;
