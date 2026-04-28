import { toast } from "react-toastify";
import { useEffect, useMemo, useState } from "react";

import { makeRequest } from "../../api/httpClient";
import { useModuleFilters } from "../../store/hooks";
import { useLocation } from "react-router-dom";
import {
  defaultSortConfig,
  getNextSortConfig,
} from "../../utils/sorting";

import {
  buildFilterFieldsFromStructure,
  buildTableColumnsFromStructure,
  getDefinitions,
} from "../../utils/moduleStructure";

import ModuleControls from "../shared/ModuleControls";
import ModulePageLayout from "../shared/ModulePageLayout";
import ModulePagination from "../shared/ModulePagination";

import DynamicFilter from "../../components/DynamicFilter";
import ResizableTable from "../../components/table/ResizableTable";

import TicketForm from "./components/TicketForm";

import {
  ticketsFallbackColumns,
  ticketsModuleSchema,
} from "./data/module.schema";

function TicketModulePage({ menuID }) {
  const location = useLocation();
  // ==================================================
  // STATES
  // ==================================================
  const resolvedMenuID =
    menuID ||
    ticketsModuleSchema.menuID ||
    null;

  const [fields, setFields] =
    useState([]);

  const [ticketList, setTicketList] =
    useState([]);

  const [
    selectedTicket,
    setSelectedTicket,
  ] = useState(null);

  const [
    isFlyoutOpen,
    setIsFlyoutOpen,
  ] = useState(false);

  const [pagination, setPagination] =
    useState({});

  const [page, setPage] =
    useState(1);

  const [loading, setLoading] =
    useState(false);

  const [
    selectedRowIds,
    setSelectedRowIds,
  ] = useState([]);

  const [deleting, setDeleting] =
    useState(false);

  // ==================================================
  // FILTERS
  // ==================================================
  const {
    filterState,
    setSearchText,
    applyFilterPayload,
    setSort,
    clearFilters,
  } = useModuleFilters(
    "tickets",
    ticketList
  );

  useEffect(() => {
    const ticket = location.state?.openTicket;
    if (ticket?.ticket_id) {
      setSelectedTicket(ticket);
      setIsFlyoutOpen(true);
    }
  }, [location.state]);

  // ==================================================
  // SORT CONFIG
  // ==================================================
  const sortConfig = {
    key: filterState.order_by || defaultSortConfig.key,
    direction: String(filterState.order || defaultSortConfig.direction).toLowerCase(),
  };

  // ==================================================
  // COLUMN OPTIONS
  // ==================================================
  const columnOptions = {
    skipFields: ticketsModuleSchema.skipFields,
    columnMappings: ticketsModuleSchema.columnMappings,
    tableCellConfig: ticketsModuleSchema.tableCellConfig,
  };

  // ==================================================
  // TABLE COLUMNS
  // ==================================================
  const resolvedColumns = useMemo(() => buildTableColumnsFromStructure(fields, ticketsFallbackColumns, columnOptions),
    [fields]
  );

  const defaultVisibleColumnKeys = useMemo(() => ticketsFallbackColumns.map(
    (column) => column.key
  ),
    []
  );

  // ==================================================
  // FILTER FIELDS
  // ==================================================
  const resolvedFilterFields = useMemo(() =>
    buildFilterFieldsFromStructure(fields, ticketsModuleSchema.defaultColumns.map((key) => ({
      label: ticketsFallbackColumns.find((column) => column.key === key)?.label || key,
      value: key,
      type: "text",
    })
    ),
      columnOptions
    ),
    [fields]
  );

  // ==================================================
  // GET LIST
  // ==================================================
  const getTicketList =
    async () => {
      setLoading(true);
      const res = await makeRequest(ticketsModuleSchema.api.list,
        {
          method: "POST",
          body: {
            status: "active",
            page,
            searchText: filterState.searchText,
            filters: filterState.filters,
            order: filterState.order,
            order_by: filterState.order_by,
          },
        }
      );

      setLoading(false);

      if (res.success) {
        setTicketList(res.data || []);
        setPagination(res.pagination || {});
        setSelectedRowIds([]);
        return;
      }
      toast.error(res?.message || "Error while fetching tickets");
    };

  // ==================================================
  // GET DEFINITIONS
  // ==================================================
  const getColumnList =
    async () => {
      const res = await getDefinitions(resolvedMenuID);
      if (res.success) {
        setFields(res.data || []);
      }
    };

  // ==================================================
  // ROW SELECT
  // ==================================================
  const handleToggleRow = (rowId, checked) => {
    setSelectedRowIds((current) =>
      checked
        ? [
          ...new Set([
            ...current,
            rowId,
          ]),
        ]
        : current.filter(
          (item) =>
            item !== rowId
        )
    );
  };

  const handleToggleAllRows = (checked) => {
    if (!checked) {
      setSelectedRowIds([]);
      return;
    }

    setSelectedRowIds(ticketList.map((row) =>
      row?.ticketID
    ).filter(Boolean)
    );
  };

  // ==================================================
  // DELETE SELECTED
  // ==================================================
  const handleDeleteSelected = async () => {
    if (!selectedRowIds.length) {
      toast.error("Please select at least one ticket.");
      return;
    }
    setDeleting(true);
    const res = await makeRequest(ticketsModuleSchema.api.delete,
      {
        method: "POST",
        body: {
          action: "delete",
          ids: selectedRowIds,
        },
      }
    );

    setDeleting(false);

    if (res.success) {
      toast.success(res?.message || "Tickets deleted successfully.");
      await getTicketList();
      return;
    }

    toast.error(res?.message || "Error while deleting tickets");
  };

  // ==================================================
  // EFFECTS
  // ==================================================
  useEffect(() => {
    getColumnList();
  }, [resolvedMenuID]);

  useEffect(() => {
    getTicketList();
  }, [
    page,
    filterState.searchText,
    filterState.order,
    filterState.order_by,
    JSON.stringify(
      filterState.filters
    ),
  ]);

  useEffect(() => {
    if (page !== 1) { setPage(1); }
  }, [
    filterState.searchText,
    filterState.order,
    filterState.order_by,
    JSON.stringify(
      filterState.filters
    ),
  ]);

  // ==================================================
  // UI
  // ==================================================
  return (
    <>
      <ModulePageLayout
        // title={ticketsModuleSchema.title}
        title='Tickets'
        description='Tasks Modue'
        // description=. {ticketsModuleSchema.description}
        controls={
          <ModuleControls
            loading={loading}
            onRefresh={getTicketList}
            onCreate={() => {
              setSelectedTicket(null);
              setIsFlyoutOpen(true);
            }}
            onDeleteSelected={
              handleDeleteSelected
            }
            showDelete={selectedRowIds.length > 0}
            deleteDisabled={deleting || loading || selectedRowIds.length === 0}
            deleteLabel={`Delete Selected${selectedRowIds.length ? ` (${selectedRowIds.length})` : ""}`}
            deleting={deleting}
            filter={
              <DynamicFilter
                fields={resolvedFilterFields}
                savedFilters={ticketsModuleSchema.savedFilters}
                onSearch={setSearchText}
                onApplyFilters={applyFilterPayload}
                onSaveFilter={() => { }}
                onDeleteFilter={() => { }}
                onSelectSavedFilter={() => { }}
                onClearFilters={clearFilters}
              />
            }
          />
        }
        table={
          <ResizableTable
            loading={loading}
            columns={resolvedColumns}
            rows={ticketList}
            storageKey="tickets-module-column-widths"
            defaultVisibleColumnKeys={defaultVisibleColumnKeys}
            sortConfig={sortConfig}
            onSortChange={(columnKey) => {
              const nextSort = getNextSortConfig(sortConfig, columnKey);
              if (page !== 1) { setPage(1); }

              setSort({
                order_by: nextSort.key,
                order: nextSort.direction.toUpperCase(),
              });
            }}
            editRow={(ticket) => {
              setSelectedTicket(ticket);
              setIsFlyoutOpen(true);
            }}
            selectedRowIds={selectedRowIds}
            onToggleRow={handleToggleRow}
            onToggleAllRows={handleToggleAllRows}
          />
        }
        footer={
          <ModulePagination pagination={pagination} onPageChange={setPage} />
        }
      />

      <TicketForm isOpen={isFlyoutOpen}
        onClose={() => {
          setIsFlyoutOpen(false);
          setSelectedTicket(null);
        }}
        selectedTicket={selectedTicket}
        onAfterSave={getTicketList}
      />
    </>
  );
}

export default TicketModulePage;
