import { makeRequest } from "../../../api/httpClient";
import { downloadBlobResponse } from "../../../utils/download.utils";
export async function fetchUserWisePerformanceReport(
  filters = {},
  page = 1
) {
  const response = await makeRequest("/reports/user-performances", {
    method: "POST",
    body: {
      company_id: filters.company_id || "",
      from_date: filters.from_date || "",
      to_date: filters.to_date || "",
      searchText: filters.searchText || "",
      page,
      limit: 20,
    },
  });
  if (!response?.success) {
    return {
      success: false,
      message:
        response?.message ||
        "Unable to load user performance report.",
    };
  }
   const data =
    response.data && Object.keys(response.data).length
      ? response.data
      : response;
    return {
    success: true,
    company: data.company || {},
    summary: data.summary || {},
    users: Array.isArray(data.users) ? data.users : [],
    tickets: Array.isArray(data.tickets) ? data.tickets : [],
    activities: Array.isArray(data.activities) ? data.activities : [],
    pagination: data.pagination || {},
    filters: data.filters || {},
  };
}
export async function downloadUserWisePerformanceReport(
  filters = {},
  options = {}
) {
  const response = await makeRequest(
    "/reports/user-performances/export-excel",
    {
      method: "POST",

      body: {
        company_id: filters.company_id || "",
        from_date: filters.from_date || "",
        to_date: filters.to_date || "",
        searchText: filters.searchText || "",
      },
      responseType: "blob",
      timeout: 30000,
    }
  );
  if (!response?.success) return response;
  const downloaded = downloadBlobResponse(
    response,
    "User-wise-performance-report.xls"
  );
return {
    success: downloaded,
    message: downloaded
      ? ""
      : "Unable to download User-wise performance report.",
  };
}