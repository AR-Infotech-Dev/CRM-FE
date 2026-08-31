import { makeRequest } from "@/api/httpClient";
import { companySettingSchema } from "./module.schema";

export const getCompanyList = async ({ filterState, page }) => {
  return await makeRequest(companySettingSchema.api.list, {
    method: "POST",
    body: {
      page,
      searchText: filterState.searchText,
      filters: filterState.filters,
      order: filterState.order,
      order_by: filterState.order_by,
    },
  });
};

export const deleteCompanies = async (selectedRowIds) => {
  return await makeRequest(companySettingSchema.api.delete, {
    method: "POST",
    body: {
      action: "delete",
      ids: selectedRowIds,
    },
  });
};

export const getCompanyDetails = async (companyId) => {
  return await makeRequest(`${companySettingSchema.api.edit}/${companyId}`, {
    method: "GET",
  });
};

export const saveCompany = async ({ mode, companyId, payload }) => {
  const saveUrl =
    mode === "create"
      ? companySettingSchema.api.create
      : `${companySettingSchema.api.edit}/${companyId}`;
  const method = mode === "create" ? "PUT" : "POST";

  return await makeRequest(saveUrl, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

export const uploadCompanyLogo = async ({ companyId, file }) => {
  const uploadUrl = companyId
    ? `${companySettingSchema.api.edit}/${companyId}/logo`
    : companySettingSchema.api.logoUpload;
  const uploadFormData = new FormData();
  uploadFormData.append("logo", file);

  if (companyId) {
    uploadFormData.append("company_id", companyId);
  }

  return await makeRequest(uploadUrl, {
    method: "POST",
    body: uploadFormData,
  });
};

export const removeCompanyLogo = async (companyId) => {
  return await makeRequest(companySettingSchema.api.logoRemove.replace(":id", companyId), {
    method: "DELETE",
    body: {},
  });
};

export const testCompanyMailConnection = async (payload) => {
  return await makeRequest(companySettingSchema.api.testMail, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};
export const testCompanyDBConnection = async (payload) => {
  return await makeRequest(companySettingSchema.api.testDB, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};
export const exportCompanyDb = async (company) => {
  const res = await makeRequest(`${companySettingSchema.api.edit}/${company.company_id}/export-db`, {
    method: "GET",
    responseType: "blob",
    timeout: 120000,
  });

  const url = window.URL.createObjectURL(res.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${company.company_name}(bkp).sql`;
  a.click();
  window.URL.revokeObjectURL(url);
};
