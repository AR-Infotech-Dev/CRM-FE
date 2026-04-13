import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Eye, KeyRound, Pencil, Plus, Trash2 } from "lucide-react";
import { useModuleFilters } from "../../store/hooks";
import {
  accessControlItems,
  accessPermissionColumns,
  accessRoleOptions,
} from "./data/accessControlData";

function AccessControlModulePage() {
  const [selectedRole, setSelectedRole] = useState(accessRoleOptions[0]);
  const [rows, setRows] = useState(accessControlItems);
  const { filterState, setSearchText } = useModuleFilters("access-control", rows);

  const expandedMap = useMemo(
    () =>
      rows.reduce((accumulator, row) => {
        if (row.expandable) {
          accumulator[row.id] = row.expanded !== false;
        }
        return accumulator;
      }, {}),
    [rows]
  );

  const visibleRows = useMemo(
    () =>
      rows.filter((row) => {
        if (
          filterState.searchText &&
          !row.name.toLowerCase().includes(filterState.searchText.toLowerCase())
        ) {
          return false;
        }

        if (!row.parentId) {
          return true;
        }

        return expandedMap[row.parentId];
      }),
    [expandedMap, rows, filterState.searchText]
  );

  const updatePermission = (rowId, permissionKey, checked) => {
    setRows((current) =>
      current.map((row) =>
        row.id === rowId
          ? {
              ...row,
              permissions: {
                ...row.permissions,
                [permissionKey]: checked,
              },
            }
          : row
      )
    );
  };

  const toggleExpand = (rowId) => {
    setRows((current) =>
      current.map((row) =>
        row.id === rowId ? { ...row, expanded: !row.expanded } : row
      )
    );
  };

  const applySelectionToAll = (checked) => {
    setRows((current) =>
      current.map((row) => ({
        ...row,
        permissions: {
          access: checked,
          view: checked,
          add: checked,
          edit: checked,
          delete: checked,
        },
      }))
    );
  };

  return (
    <section className="module-page access-control-page">
      <div className="access-control-header">
        <div className="module-page-heading">
          <h2 className="module-page-title">Module &amp; Permission Management</h2>
          <p className="module-page-description">
            Configure module-level permissions, action visibility, and role access from one workspace.
          </p>
        </div>
        <button className="access-primary-button">
          <Plus size={16} />
          Add Module
        </button>
      </div>

      <div className="access-toolbar-card">
        <div className="access-toolbar-row">
          <div className="access-toolbar-left">
            <label className="access-inline-label">
              <span className="access-inline-text">Managing permissions for:</span>
              <select
                className="access-select"
                value={selectedRole}
                onChange={(event) => setSelectedRole(event.target.value)}
              >
                {accessRoleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>

            <button className="access-icon-button delete">
              <Trash2 size={16} />
            </button>
            <button className="access-secondary-button">Create Role</button>
          </div>

          <div className="access-toolbar-right">
            <input
              className="access-search"
              type="text"
              value={filterState.searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search modules..."
            />
            <button className="access-text-button success" onClick={() => applySelectionToAll(true)}>
              Select All
            </button>
            <button className="access-text-button danger" onClick={() => applySelectionToAll(false)}>
              Deselect All
            </button>
            <button className="access-save-button">Save Changes</button>
          </div>
        </div>
      </div>

      <div className="access-table-card">
        <table className="access-permission-table">
          <thead>
            <tr>
              <th className="name-col">Module / Sub-module</th>
              {accessPermissionColumns.map((column) => (
                <th key={column.key}>
                  <span className="permission-head">
                    {column.key === "access" ? <KeyRound size={15} /> : null}
                    {column.key === "view" ? <Eye size={15} /> : null}
                    {column.key === "add" ? <Plus size={15} /> : null}
                    {column.key === "edit" ? <Pencil size={15} /> : null}
                    {column.key === "delete" ? <Trash2 size={15} /> : null}
                    <span>{column.label}</span>
                  </span>
                </th>
              ))}
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.id}>
                <td className="access-name-cell">
                  <div
                    className="access-name-wrap"
                    style={{ paddingLeft: `${row.depth * 28 + 14}px` }}
                  >
                    <span className="access-grip" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </span>
                    {row.expandable ? (
                      <button
                        className="access-expand-button"
                        onClick={() => toggleExpand(row.id)}
                      >
                        {row.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>
                    ) : (
                      <span className="access-expand-placeholder" />
                    )}
                    <span className="access-row-label">{row.name}</span>
                  </div>
                </td>

                {accessPermissionColumns.map((column) => (
                  <td key={column.key} className="permission-cell">
                    <input
                      type="checkbox"
                      checked={Boolean(row.permissions[column.key])}
                      onChange={(event) =>
                        updatePermission(row.id, column.key, event.target.checked)
                      }
                    />
                  </td>
                ))}

                <td className="actions-cell">
                  <button className="access-row-action edit">
                    <Pencil size={14} />
                  </button>
                  <button className="access-row-action delete">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AccessControlModulePage;
