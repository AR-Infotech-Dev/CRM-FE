import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@auth/components/AuthProvider";
import ModulePageLayout from "../../shared/ModulePageLayout";
import ActivityTimeline from "./components/ActivityTimeline";
import PerformanceCards from "./components/PerformanceCards";
import PerformanceCharts from "./components/PerformanceCharts";
import PerformanceTable from "./components/PerformanceTable";
import { UserPerformanceToolbar } from "./components/UserPerformanceHeader";
import { UserPerformanceHero } from "./components/UserPerformanceHero";
import { useUserPerformanceReport } from "./hooks/useUserPerformanceReport";
import { getPerformanceExportPermission } from "./utils/performanceReport.utils";
import "./reports.css";

function UserPerformancePage({ menu_id }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loadFrom, setLoadFrom] = useState(false);

  const [performanceFilters, setPerformanceFilters] = useState({});
  const fromUserWiseReport =
    location.state?.fromUserWiseReport === true;
  const { userId } = useParams();

  useEffect(() => {
    setLoadFrom(location.state?.fromTopBar === true);
    if (location.state?.fromTopBar === true) {
      setPerformanceFilters(location.state?.performanceFilters || {});
    }
  }, [location.state]);

  const fromDate = performanceFilters.fromDate || "";
  const toDate = performanceFilters.toDate || "";
  const handleDateFilterChange = (field, value) => {
    console.log("🟡 PAGE DATE FILTER CHANGE:", {
      field,
      value,
    });

    setPerformanceFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const { authSession } = useAuth();
  const { report, loading, searchText, sortConfig, userName, rating, setPage, handleTicketSearchChange, handleSortChange, handleExportExcel, handleExportPdf } = useUserPerformanceReport({ userId, fromDate, toDate, });
  const canExport = getPerformanceExportPermission({ menuId: menu_id, user: authSession?.user || {} });

  return (
    <ModulePageLayout
      title="User Performance"
      description="Detailed ticket performance, productivity, and activity for one user."
      classNames="performance-page-header"
      controls={
        <div className="!m-0 !w-full !p-0 flex items-start !-translate-y-0 absolute top-0 top-[17px] right-[23px]">
          
          <UserPerformanceToolbar
            loading={loading}
            canExport={canExport}
            loadFrom={loadFrom}
            onBack={loadFrom ? undefined : () => navigate("/reports/performance")}
            onExportExcel={handleExportExcel}
            onExportPdf={handleExportPdf}
            onDateFilterChange={handleDateFilterChange}
            fromDate={fromDate}
            toDate={toDate}
          />
        </div>
      }
      table={
        <div className=" !m-0 !w-full !min-w-0 !min-h-full !overflow-x-hidden !overflow-y-auto !p-[8px] box-border flex flex-col gap-[14px]">
          <UserPerformanceHero
            userName={userName}
            summary={report.summary}
            rating={rating}
          />
          <PerformanceCards summary={report.summary} loading={loading} />
          <PerformanceCharts charts={report.charts} />
          <PerformanceTable
            rows={report.tickets}
            loading={loading}
            pagination={report.pagination}
            searchText={searchText}
            sortConfig={sortConfig}
            onSearchChange={handleTicketSearchChange}
            onSortChange={handleSortChange}
            onPageChange={setPage}
          />
          <ActivityTimeline activities={report.activities} loading={loading} />
        </div>
      }
    />
  );
}

export default UserPerformancePage;
