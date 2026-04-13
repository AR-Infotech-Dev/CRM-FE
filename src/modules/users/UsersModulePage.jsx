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
import UserFlyout from "./components/UserFlyout";
import { usersColumns, usersRows } from "./data/usersModuleData";

const userFilterFields = [
  { label: "User ID", value: "userId", type: "number" },
  { label: "User Name", value: "name", type: "text" },
  { label: "Email", value: "email", type: "text" },
  { label: "Role", value: "role", type: "text" },
  { label: "Phone", value: "phone", type: "text" },
  { label: "Department", value: "department", type: "text" },
  { label: "Status", value: "status", type: "text" },
];

function UsersModulePage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState(defaultSortConfig);
  const [structureFields, setStructureFields] = useState([]);
  const { filteredRows, setSearchText, setFilters, clearFilters } = useModuleFilters(
    "users",
    usersRows
  );
  const resolvedColumns = useMemo(
    () => buildTableColumnsFromStructure(structureFields, usersColumns),
    [structureFields]
  );
  const defaultVisibleColumnKeys = useMemo(
    () => usersColumns.map((column) => column.key),
    []
  );
  const resolvedFilterFields = useMemo(
    () => buildFilterFieldsFromStructure(structureFields, userFilterFields),
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
          model_name: "user",
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
        title="Users"
        description="Manage users, permissions, departments, and statuses from a single workspace."
        controls={
          <ModuleControls
            onCreate={() => {
              setSelectedUser(null);
              setIsFlyoutOpen(true);
            }}
            selectedLabel="6 Selected"
            resultsLabel="86 Results"
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
            storageKey="users-module-column-widths"
            defaultVisibleColumnKeys={defaultVisibleColumnKeys}
            sortConfig={sortConfig}
            onSortChange={(columnKey) => setSortConfig((current) => getNextSortConfig(current, columnKey))}
            editRow={(user) => {
              setSelectedUser(user);
              setIsFlyoutOpen(true);
            }}
          />
        }
        footer={<ModulePagination pagination={pagination} onPageChange={setPage} />}
      />
      <UserFlyout
        isOpen={isFlyoutOpen}
        onClose={() => setIsFlyoutOpen(false)}
        title={selectedUser ? "Edit User" : "Create User"}
        selectedUser={selectedUser}
      />
    </>
  );
}

export default UsersModulePage;
