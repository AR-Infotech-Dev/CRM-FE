import { get, patch, post, put, remove } from "./httpClient";

export function fetchLeads(params = {}) {
  const query = new URLSearchParams(params).toString();
  return get(`/leads${query ? `?${query}` : ""}`);
}

export function fetchLeadById(leadId) {
  return get(`/leads/${leadId}`);
}

export function createLead(payload) {
  return post("/leads", payload);
}

export function updateLead(leadId, payload) {
  return put(`/leads/${leadId}`, payload);
}

export function patchLead(leadId, payload) {
  return patch(`/leads/${leadId}`, payload);
}

export function deleteLead(leadId) {
  return remove(`/leads/${leadId}`);
}

export function fetchCompanies(params = {}) {
  const query = new URLSearchParams(params).toString();
  return get(`/companies${query ? `?${query}` : ""}`);
}

export function fetchDashboardSummary() {
  return get("/dashboard/summary");
}
