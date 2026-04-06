export const tableRows = [
  ["Nisha Kumari", "Hyperlink", "In Negotiation", "B2B", "Tech"],
  ["Sophia", "Kritrim", "Rejected", "B2B", "Finance"],
  ["Rudra Pratap", "AroLink", "Under Review", "Automation", "AI"],
  ["Trisha Norton", "Firelog", "Accepted", "Saas", "Auto"],
  ["Jolene Orr", "SassSystem", "Prospective", "B2B", "Tech"],
  ["Aryan Roy", "KalkiYoga", "In Negotiation", "B2B", "Finance"],
  ["Elvin Bond", "Middesk", "Rejected", "Automation", "Retail"],
  ["Huzaifa Anas", "Kritrim", "Under Review", "Saas", "Auto"],
  ["Nisha Kumari", "AroLink", "Accepted", "B2B", "Finance"],
  ["Sophia", "Firelog", "Prospective", "Automation", "Retail"],
  ["Rudra Pratap", "SassSystem", "In Negotiation", "Saas", "Auto"],
  ["Trisha Norton", "KalkiYoga", "In Negotiation", "B2B", "Tech"],
  ["Jolene Orr", "Hyperlink", "Rejected", "B2B", "Finance"],
  ["Aryan Roy", "Kritrim", "Under Review", "Automation", "AI"],
  ["Elvin Bond", "AroLink", "Accepted", "Saas", "Auto"],
  ["Huzaifa Anas", "Firelog", "Prospective", "B2B", "Tech"],
];

export const companyColors = {
  Hyperlink: "#4b31ff",
  Kritrim: "#31a24c",
  AroLink: "#dc3b24",
  Firelog: "#ff7b00",
  SassSystem: "#9c27db",
  KalkiYoga: "#0d8adf",
  Middesk: "#2f3137",
};

export const statusMap = {
  "In Negotiation": "status-amber",
  Rejected: "status-red",
  "Under Review": "status-purple",
  Accepted: "status-green",
  Prospective: "status-gray",
};

export const crmTableColumns = [
  { key: "select", className: "check-col", checkbox: true, width: 42, minWidth: 42, resizable: false },
  { key: "favorite", className: "icon-col", width: 42, minWidth: 42, resizable: false },
  { key: "clientName", label: "Client Name", width: 170, minWidth: 140 },
  { key: "company", label: "Company", width: 140, minWidth: 120 },
  { key: "listingPrice", label: "Listing Price", width: 150, minWidth: 130 },
  { key: "address", label: "Address", width: 220, minWidth: 180 },
  { key: "notify", className: "icon-col", width: 42, minWidth: 42, resizable: false },
  { key: "status", label: "Status", width: 145, minWidth: 120 },
  { key: "date", label: "Date", width: 120, minWidth: 100 },
  { key: "categories", label: "Categories", width: 170, minWidth: 140 },
];
