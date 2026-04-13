import { useEffect, useMemo, useState } from "react";
import DynamicFilter from "../../components/DynamicFilter";
import ResizableTable from "../../components/table/ResizableTable";
import { makeRequest } from "../../api/httpClient";
import { useModuleFilters } from "../../store/hooks";
import { paginateRows } from "../../utils/pagination";
import { defaultSortConfig, getNextSortConfig, sortRows } from "../../utils/sorting";
import {
  buildFilterFieldsFromStructure,
  buildTableColumnsFromStructure,
} from "../../utils/moduleStructure";
import ModuleControls from "../shared/ModuleControls";
import ModulePageLayout from "../shared/ModulePageLayout";
import ModulePagination from "../shared/ModulePagination";
import UserRoleForm from "./UserRoleForm";
import {
  userRoleMasterColumns,
  userRoleMasterRows,
} from "./data/userRoleMasterData";

const roleFilterFields = [
  { label: "Role ID", value: "roleId", type: "text" },
  { label: "Role Name", value: "name", type: "text" },
  { label: "Role Type", value: "roleType", type: "text" },
  { label: "Assigned Users", value: "assignedUsers", type: "number" },
  { label: "Scope", value: "scope", type: "text" },
  { label: "Status", value: "status", type: "text" },
];

function UserRoleMasterModulePage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState(defaultSortConfig);
  const [structureFields, setStructureFields] = useState([]);
  const { filteredRows, setSearchText, setFilters, clearFilters } = useModuleFilters(
    "user-role-master",
    userRoleMasterRows
  );
  const resolvedColumns = useMemo(
    () => buildTableColumnsFromStructure(structureFields, userRoleMasterColumns),
    [structureFields]
  );
  const defaultVisibleColumnKeys = useMemo(
    () => userRoleMasterColumns.map((column) => column.key),
    []
  );
  const resolvedFilterFields = useMemo(
    () => buildFilterFieldsFromStructure(structureFields, roleFilterFields),
    [structureFields]
  );
  const sortedRows = useMemo(
    () => sortRows(filteredRows, sortConfig),
    [filteredRows, sortConfig]
  );
  const { paginatedRows, pagination } = useMemo(
    () => paginateRows(sortedRows, page),
    [sortedRows, page]
  );

  useEffect(() => {
    setPage(1);
  }, [filteredRows.length]);

  useEffect(() => {
    setPage(1);
  }, [sortConfig.key, sortConfig.direction]);

  useEffect(() => {
    const getColumnList = async () => {
      const res = await makeRequest("/system/getstructure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          model_name: "user_role",
        },
      });

      if (res.success) {
        setStructureFields(res.data || []);
      }
    };

    getColumnList();
  }, []);

  return (
    <>
      <ModulePageLayout
        title="User Role Master"
        description="Manage reusable role definitions, access scope, and approval ownership."
        controls={
          <ModuleControls
            onCreate={() => {
              setSelectedRole(null);
              setIsFlyoutOpen(true);
            }}
            selectedLabel="3 Selected"
            resultsLabel="42 Results"
            createLabel="Add New"
            filter={
              <DynamicFilter
                fields={resolvedFilterFields}
                savedFilters={[]}
                onSearch={setSearchText}
                onApplyFilters={setFilters}
                onClearFilters={clearFilters}
              />
            }
          />
        }
        table={
          <ResizableTable
            columns={resolvedColumns}
            rows={paginatedRows}
            storageKey="user-role-master-column-widths"
            defaultVisibleColumnKeys={defaultVisibleColumnKeys}
            sortConfig={sortConfig}
            onSortChange={(columnKey) => setSortConfig((current) => getNextSortConfig(current, columnKey))}
            editRow={(role) => {
              setSelectedRole(role);
              setIsFlyoutOpen(true);
            }}
          />
        }
        footer={<ModulePagination pagination={pagination} onPageChange={setPage} />}
      />
      <UserRoleForm
        isOpen={isFlyoutOpen}
        onClose={() => setIsFlyoutOpen(false)}
        selectedRole={selectedRole}
      />
    </>
  );
}

export default UserRoleMasterModulePage;
