import { Bell, Star } from "lucide-react";
import { companyColors, crmTableColumns, statusMap, tableRows } from "../../data/crmData";
import ResizableTable from "./ResizableTable";

function getCellStyle(column) {
  return {
    width: column.currentWidth,
    minWidth: column.currentWidth,
    maxWidth: column.currentWidth,
  };
}

function renderCrmRow(row, index, columns) {
  const [name, company, status, categoryA, categoryB] = row;

  return (
    <tr key={`${name}-${company}-${index}`}>
      <td className="check-col" style={getCellStyle(columns[0])}>
        <input type="checkbox" />
      </td>
      <td className="icon-col" style={getCellStyle(columns[1])}>
        <button className="table-icon-button">
          <Star size={15} fill={index % 8 === 1 ? "currentColor" : "none"} />
        </button>
      </td>
      <td style={getCellStyle(columns[2])}>
        <div className="person-cell">
          <span className={`person-avatar avatar-${index % 6}`}>{name.charAt(0)}</span>
          <span>{name}</span>
        </div>
      </td>
      <td style={getCellStyle(columns[3])}>
        <div className="company-cell">
          <span
            className="company-dot"
            style={{ backgroundColor: companyColors[company] || "#8b5cf6" }}
          />
          <span>{company}</span>
        </div>
      </td>
      <td style={getCellStyle(columns[4])}>$15,900,000</td>
      <td style={getCellStyle(columns[5])}>987 Teck way, Seattle WA</td>
      <td className="icon-col" style={getCellStyle(columns[6])}>
        <button className="table-icon-button">
          <Bell size={14} />
        </button>
      </td>
      <td style={getCellStyle(columns[7])}>
        <span className={`status-pill ${statusMap[status]}`}>{status}</span>
      </td>
      <td style={getCellStyle(columns[8])}>12/03/20247</td>
      <td style={getCellStyle(columns[9])}>
        <div className="category-wrap">
          <span className="tag lilac">{categoryA}</span>
          <span className="tag mint">{categoryB}</span>
        </div>
      </td>
    </tr>
  );
}

function CrmTable() {
  return (
    <ResizableTable
      columns={crmTableColumns}
      rows={tableRows}
      storageKey="crm-table-column-widths"
      renderRow={renderCrmRow}
    />
  );
}

export default CrmTable;
