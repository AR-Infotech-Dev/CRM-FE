import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import {
  downloadUserPerformanceExcel,
  fetchUserPerformance,
} from "../data/performance.service";

import { exportPerformancePdf } from "../reportExport";

import {
  defaultPerformanceSort,
  emptyPerformanceReport,
  getNextPerformanceSort,
  getPerformanceRating,
  getUserReportName,
} from "../utils/performanceReport.utils";

import { selectAppliedPerformanceFilters } from "../data/performanceReport.slice";
import { useAppSelector } from "@/store/hooks";


export const useUserPerformanceReport = ({
  userId,
  fromDate,
  toDate,
}) => {
  const [report, setReport] = useState(emptyPerformanceReport);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [sortConfig, setSortConfig] = useState(defaultPerformanceSort);

  const appliedFilters = useAppSelector(
    selectAppliedPerformanceFilters
  );

  const filters = useMemo(
    () => ({
      ...appliedFilters,
      user_id: userId || appliedFilters.user_id,
      from_date: fromDate || "",
      to_date: toDate || "",
    }),
    [appliedFilters, userId, fromDate, toDate]
  );

  // const handleDateFilterChange = (e) => {
  //   const { name, value } = e.target;
  //   if (name === "fromDate") {
  //     setFilters((prev) => ({ ...prev, from_date: value }));
  //   }
  // }


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    setPage(1);
    setSearchText("");
    setReport(emptyPerformanceReport);
  }, [userId, fromDate, toDate]);

  const loadReport = useCallback(async () => {
    if (!userId) {
      setReport(emptyPerformanceReport);
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log("🔍 DATE VALIDATION:", {
      fromDate,
      toDate,
      fromDateType: typeof fromDate,
      toDateType: typeof toDate,
      fromDateValid: !fromDate || !Number.isNaN(Date.parse(fromDate)),
      toDateValid: !toDate || !Number.isNaN(Date.parse(toDate)),
    });
    const response = await fetchUserPerformance(filters, {
      page,
      searchText: debouncedSearchText,
      order_by: sortConfig.key,
      order: sortConfig.direction,
    });

    setLoading(false);

    if (!response.success) {
      toast.error(
        response.message || "Unable to load user performance"
      );
      return;
    }

    setReport(response);
  }, [
    filters,
    userId,
    debouncedSearchText,
    page,
    sortConfig,
  ]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const handleTicketSearchChange = (value) => {
    setPage(1);
    setSearchText(value);
  };

  const handleSortChange = (columnKey) => {
    setPage(1);

    setSortConfig((current) =>
      getNextPerformanceSort(current, columnKey)
    );
  };

  const handleExportExcel = async () => {
    const response = await downloadUserPerformanceExcel(
      {
        ...filters,
        user_name: report.user?.name || "",
      },
      {
        searchText: debouncedSearchText,
        order_by: sortConfig.key,
        order: sortConfig.direction,
      }
    );

    if (!response?.success) {
      toast.error(
        response?.message ||
        "Unable to export performance report."
      );
    }
  };

  const handleExportPdf = () => {
    exportPerformancePdf({
      filters,
      summary: report.summary,
      tickets: report.tickets,
      user: report.user,
    });
  };

  return {
    filters,
    report,
    loading,
    page,
    searchText,
    sortConfig,
    // handleDateFilterChange,
    userName: getUserReportName({
      report,
      userId,
    }),

    rating: getPerformanceRating(
      report.summary?.productivity_score
    ),

    setPage,

    handleTicketSearchChange,
    handleSortChange,
    handleExportExcel,
    handleExportPdf,
  };
};