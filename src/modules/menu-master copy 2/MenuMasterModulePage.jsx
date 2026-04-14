import ModuleControls from "../shared/ModuleControls";
import ModulePageLayout from "../shared/ModulePageLayout";
import ModulePagination from "../shared/ModulePagination";
import { toast } from 'react-toastify';
import MenuForm from './MenuForm';
import {
  menuMasterColumns,
  menuMasterFormFields,
  menuMasterInitialValues,
  savedFilters
} from "./data/menuMasterData";
import { useEffect, useState } from "react";
import { makeRequest } from "../../api/httpClient";
import ResizableTable from "../../components/table/ResizableTable";
import DynamicFilter from "../../components/DynamicFilter";
import { useModuleFilters } from "../../store/hooks";
import { defaultSortConfig, getNextSortConfig } from "../../utils/sorting";
import {
  buildFilterFieldsFromStructure,
  buildTableColumnsFromStructure,
} from "../../utils/moduleStructure";
import { useMemo } from "react";

function MenuMasterModulePage() {
  const [fields, setFields] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const title = 'Menus';
  const description = 'Control navigation items, route hierarchy, and menu sequencing from one place.';
  const {
    filterState,
    setSearchText,
    applyFilterPayload,
    setSort,
    clearFilters,
  } = useModuleFilters(
    "menu-master",
    menuList
  );
  const sortConfig = {
    key: filterState.order_by || defaultSortConfig.key,
    direction: String(filterState.order || defaultSortConfig.direction).toLowerCase(),
  };
  const resolvedColumns = useMemo(
    () => buildTableColumnsFromStructure(fields, menuMasterColumns),
    [fields]
  );
  const defaultVisibleColumnKeys = useMemo(
    () => menuMasterColumns.map((column) => column.key),
    []
  );
  const resolvedFilterFields = useMemo(
    () => buildFilterFieldsFromStructure(fields, fields),
    [fields]
  );

  const getMenuList = async () => {
    setLoading(true);
    const res = await makeRequest('/menus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        status: 'active',
        page,
        searchText: filterState.searchText,
        filters: filterState.filters,
        order: filterState.order,
        order_by: filterState.order_by,
      }
    });

    setLoading(false);
    if (res.success) {
      setSelectedMenu(null);
      setMenuList(res.data);
      setPagination(res.pagination || {})
      setSelectedRowIds([]);
    } else {
      toast.error(res?.msg || "Error while creating Menu");
    }
  }

  const handleToggleRow = (rowId, checked) => {
    setSelectedRowIds((current) =>
      checked ? [...new Set([...current, rowId])] : current.filter((item) => item !== rowId)
    );
  };

  const handleToggleAllRows = (checked) => {
    if (!checked) {
      setSelectedRowIds([]);
      return;
    }

    setSelectedRowIds(
      menuList.map((row) => row?._id ?? row?.id).filter(Boolean)
    );
  };

  const handleDeleteSelected = async () => {
    if (!selectedRowIds.length) {
      toast.error("Please select at least one menu to delete.");
      return;
    }

    setDeleting(true);
    const res = await makeRequest("/menus/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        ids: selectedRowIds,
      },
    });
    setDeleting(false);

    if (res.success) {
      toast.success(res?.message || "Selected menus deleted successfully.");
      await getMenuList();
      return;
    }

    toast.error(res?.msg || "Error while deleting menus");
  };

  const getColumnList = async () => {
    const res = await makeRequest('/system/getstructure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        model_name: 'menu'
      }
    });

    setLoading(false);
    if (res.success) {
      setFields(res.data);
    } else {
      toast.error(res?.msg || "Error while fetching Model Feilds");
    }
  };

  useEffect(() => {
    const fetchColumns = async () => {
      await getColumnList();
    };

    fetchColumns();
  }, []);

  useEffect(() => {
    getMenuList();
  }, [page, filterState.searchText, filterState.order, filterState.order_by, JSON.stringify(filterState.filters)])

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [filterState.searchText, filterState.order, filterState.order_by, JSON.stringify(filterState.filters)])

  return (
    <>
      <ModulePageLayout
        title={title}
        description={description}
        controls={
          <>
            <ModuleControls loading={loading} onRefresh={() => { getMenuList() }} onCreate={() => setIsFlyoutOpen(true)}
              onDeleteSelected={handleDeleteSelected}
              showDelete={selectedRowIds.length !== 0}
              deleteDisabled={deleting || loading || selectedRowIds.length === 0}
              deleteLabel={`Delete Selected${selectedRowIds.length ? ` (${selectedRowIds.length})` : ""}`}
              deleting={deleting}
              filter={
                  <DynamicFilter
                  fields={resolvedFilterFields}
                  savedFilters={savedFilters}
                  onSearch={setSearchText}
                  onApplyFilters={applyFilterPayload}
                  onSaveFilter={(payload) => { }}
                  onDeleteFilter={(filter) => { }}
                  onSelectSavedFilter={(filter) => { }}
                  onClearFilters={clearFilters}
                />
              }
            />
          </>
        }
        table={
          <ResizableTable
            loading={loading}
            columns={resolvedColumns}                 // COLUMN STRUCTURE
            rows={menuList}                           // ACTUAL DATA
            storageKey={'menu-master-column-widths'}  // FOR STORED COLUMN WIDTH
            defaultVisibleColumnKeys={defaultVisibleColumnKeys}
            sortConfig={sortConfig}
            onSortChange={(columnKey) => {            // SORTING
              const nextSort = getNextSortConfig(sortConfig, columnKey);
              if (page !== 1) {
                setPage(1);
              }
              setSort({
                order_by: nextSort.key,
                order: nextSort.direction.toUpperCase(),
              });
            }}
            editRow={(menu) => {                      // FUNCTION THAT CALLED FOR EDIT ROW
              setSelectedMenu(menu);
              setIsFlyoutOpen(true);
            }}
            selectedRowIds={selectedRowIds}          //
            onToggleRow={handleToggleRow}
            onToggleAllRows={handleToggleAllRows}
          />
        }
        footer={<ModulePagination pagination={pagination} onPageChange={setPage} />}
      />
      <MenuForm
        getMenuList={getMenuList}
        mode={selectedMenu ? "edit" : "create"}
        selectedMenu={selectedMenu}
        isOpen={isFlyoutOpen}
        onClose={() => setIsFlyoutOpen(false)}
        title={`${selectedMenu ? "Edit" : "Create"} Menu`}
        fields={menuMasterFormFields}
        initialValues={menuMasterInitialValues}
      />
    </>
  );
}

export default MenuMasterModulePage;
