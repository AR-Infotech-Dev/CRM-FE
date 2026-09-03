import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Building2, CheckCircle2, Clock3, Download, RotateCcw, Search, Ticket, TriangleAlert, UserCheck, Users } from "lucide-react";
import { toast } from "react-toastify";
import ModulePagination from "../../shared/ModulePagination";
import { getCurrentSession } from "../../../auth/utils/authStorage";
import { fetchReportCompanies } from "../performance-report/data/performance.service";
import { fetchUserWisePerformanceReport, downloadUserWisePerformanceReport, } from "./companyuserReport.service";
import { formatReportDate, toReportDateInput } from "../report.utils";
import "./company-user-report.css";
import { useAuth } from "@/auth/components/AuthProvider";
const getDefaultFilters = () => {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const user = getCurrentSession()?.user || {};
  return {
    company_id: String(user.company_id || ""),
    from_date: toReportDateInput(monthStart),
    to_date: toReportDateInput(today),
    searchText: "",
  };
};
const EMPTY_REPORT = {
  company: {},
  summary: {},
  users: [],
  pagination: {},
};
const summaryItems = [
  { key: "total_users", label: "Total Users", icon: Users, tone: "blue" },
  { key: "users_with_tickets", label: "With Tickets", icon: UserCheck, tone: "cyan" },
  { key: "users_without_tickets", label: "Without Tickets", icon: Users, tone: "slate" },
  { key: "total_tickets", label: "Total Tickets", icon: Ticket, tone: "violet" },
  { key: "open_tickets", label: "Open", icon: Clock3, tone: "amber" },
  { key: "in_progress_tickets", label: "In Progress", icon: Clock3, tone: "blue" },
  { key: "closed_tickets", label: "Closed", icon: CheckCircle2, tone: "green" },
  { key: "overdue_tickets", label: "Overdue", icon: TriangleAlert, tone: "red" },
];
function UserWisePerformanceReport() {
  const navigate = useNavigate();
  const { authSession } = useAuth();
  const roleSlug = authSession?.user?.role_slug;
  const [companies, setCompanies] = useState([]);
  const [filters, setFilters] = useState(getDefaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(getDefaultFilters);
  const [report, setReport] = useState(EMPTY_REPORT);
  const [loading, setLoading] = useState(false);
  const selectedCompany = useMemo(
    () => companies.find((item) => String(item.value) === String(filters.company_id)),
    [companies, filters.company_id]
  );
  useEffect(() => {
    let mounted = true;
    fetchReportCompanies().then(
      (items) => {
        if (!mounted) return;
        const user = getCurrentSession()?.user || {};
        const isSuperAdmin = user.role_slug === "super_admin";
        const scopedItems = isSuperAdmin
          ? items
          : items.filter((item) => String(item.value) === String(user.company_id || ""));
        const visibleItems = scopedItems.length
          ? scopedItems
          : user.company_id
            ? [{ value: String(user.company_id), label: user.company_name || "My Company" }]
            : [];
        setCompanies(visibleItems);
        setFilters((current) => ({
          ...current,
          company_id: current.company_id || (visibleItems.length === 1 ? visibleItems[0].value : ""),
        }));
      });
  return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    if (appliedFilters.company_id) {
      loadReport(appliedFilters, 1);
    } }, []);

  const loadReport = async (nextFilters = appliedFilters, page = 1) => {
    if (!nextFilters.company_id) {
      toast.error("Please select a company.");
      return;
    }
    setLoading(true);
    const response = await fetchUserWisePerformanceReport(nextFilters, page);
    setLoading(false);
    if (!response.success) {
      toast.error(response.message);
      return;
    }
      setReport(response);
  };

  const generateReport = () => {
    setAppliedFilters(filters);
    loadReport(filters, 1);
  };
  const handleExport = async () => {
    if (!appliedFilters.company_id) {
      toast.error("Please select a company.");
      return;
    }

    const response = await downloadUserWisePerformanceReport(appliedFilters);

    if (!response?.success) {
      toast.error(
        response?.message || "Unable to export user-wise performance report."
      );
    }
  };
  const resetReport = () => {
    const nextFilters = getDefaultFilters();
    setFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setReport(EMPTY_REPORT);
  };

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <section className="company-ticket-report-page">
      <header className="company-ticket-report-header">
        <div>
          <span>Company Report</span>
          <h2>User Ticket Summary</h2>
          <p>User-wise ticket counts for the selected company and period.</p>
        </div>
        <div className="company-ticket-report-company">
          <Building2 size={16} />
          <span>{report.company?.company_name || selectedCompany?.label || "Select company"}</span>
        </div>
      </header>

      <div className="company-ticket-report-filters">
        <label>
          <span>Company</span>
          <select value={filters.company_id} onChange={(event) => updateFilter("company_id", event.target.value)}>
            <option value="">Select company</option>
            {companies.map((company) => (
              <option key={company.value} value={company.value}>{company.label}</option>
            ))}
          </select>
        </label>
        <label>
          <span>From Date</span>
          <input type="date" value={filters.from_date} onChange={(event) => updateFilter("from_date", event.target.value)} />
        </label>
        <label>
          <span>To Date</span>
          <input type="date" value={filters.to_date} onChange={(event) => updateFilter("to_date", event.target.value)} />
        </label>
        <label className="company-ticket-report-search">
          <span>User</span>
          <input
            type="search"
            value={filters.searchText}
            placeholder="Name, email or mobile"
            onChange={(event) => updateFilter("searchText", event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") generateReport();
            }}
          />
        </label>
        <div className="company-ticket-report-filter-actions">
          <button type="button" className="primary" disabled={loading} onClick={generateReport}>
            <Search size={14} />
            {loading ? "Loading..." : "Generate"}
          </button>
          <button type="button" disabled={loading} onClick={resetReport}>
            <RotateCcw size={14} />
            Reset
          </button>
          <button type="button" className="" disabled={loading} title="Export" onClick={handleExport}>
            <Download size={14} />Export Excel
          </button>
        </div>
      </div>

      <div className="company-ticket-report-scroll">
        <section className="company-ticket-report-summary">
          {summaryItems.map(({ key, label, icon: Icon, tone }) => (
            <article key={key} className={`company-ticket-summary-card ${tone}`}>
              <span><Icon size={15} /></span>
              <div>
                <small>{label}</small>
                <strong>{Number(report.summary?.[key] || 0)}</strong>
              </div>
            </article>
          ))}
        </section>

        <section className="company-ticket-report-panel">
          <div className="company-ticket-report-panel-head">
            <div>
              <span>Users</span>
              <h3>Ticket Count Breakdown</h3>
            </div>
            <p>{report.pagination?.total || 0} users</p>
          </div>

          <div className="company-ticket-report-table-wrap">
            <table className="company-ticket-report-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Total</th>
                  <th>Generated</th>
                  <th>Open</th>
                  <th>Pending</th>
                  <th>Delegated</th>
                  <th>In Progress</th>
                  <th>Closed</th>
                  <th>Overdue</th>
                  <th>Productivity Score</th>
                  <th>Last Ticket</th>
                </tr>
              </thead>
              <tbody>
                {report.users.length ? (
                  report.users.map((user) => (
                    <tr
                      key={user.user_id}
                      onClick={() =>
                        navigate(`/reports/performance/${user.user_id}`, {
                          state: {
                            userId: user.user_id,
                            userName: user.user_name,
                            companyId: filters.company_id,
                            fromDate: filters.from_date,
                            toDate: filters.to_date,
                            fromUserWiseReport: true,
                          },
                        })
                      }
                      className="cursor-pointer"
                    >
                      <td>
                        <strong>{user.user_name || "-"}</strong>
                      </td>

                      <td>
                        <b>{Number(user.total_tickets || 0)}</b>
                      </td>

                      <td>
                        <b>{Number(user.generated || 0)}</b>
                      </td>

                      <td>
                        {Number(user.open_tickets || 0)}
                      </td>

                      <td>
                        {Number(user.pending || 0)}
                      </td>

                      <td>
                        {Number(user.delegated || 0)}
                      </td>

                      <td>
                        {Number(user.in_progress_tickets || 0)}
                      </td>

                      <td>
                        {Number(user.closed_tickets || 0)}
                      </td>

                      <td
                        className={
                          Number(user.overdue_tickets || 0) > 0 ? "is-overdue" : "" } >
                        {Number(user.overdue_tickets || 0)}
                      </td>

                      <td>
                        <b>
                          {Number(user.productivity_score || 0)}%
                        </b>
                      </td>
                
                      <td>
                        <span>{user.last_ticket_no || "-"}</span>

                        <small>
                          {[ user.last_ticket_status, formatReportDate(user.last_ticket_date), ] .filter( (value) => value && value !== "-" ) .join(" | ") || "-"}
                        </small>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={11}
                      className="company-ticket-report-empty"
                    >
                      {loading
                        ? "Loading user report..."
                        : "Generate the report to view user ticket counts."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <ModulePagination
            pagination={report.pagination}
            onPageChange={(nextPage) => loadReport(appliedFilters, nextPage)}
          />
        </section>
      </div>
    </section>
  );
}
export default UserWisePerformanceReport;