export const menuMasterColumns = [
  { key: "select", className: "check-col", checkbox: true, width: 42, minWidth: 42, resizable: false },
  { key: "favorite", className: "icon-col", width: 42, minWidth: 42, resizable: false },
  { key: "_id", label: "_id", width: 110, minWidth: 90 },
  { key: "menu_id", label: "Menu ID", width: 110, minWidth: 90 },
  { key: "menu_name", label: "Menu Name", width: 220, minWidth: 180, cellType: "person" },
  { key: "module_name", label: "Module Name", width: 180, minWidth: 140, cellType: "dotText" },
  { key: "menu_link", label: "Menu Link", width: 220, minWidth: 180, cellType: "clip" },
  { key: "menu_index", label: "Menu Index", width: 120, minWidth: 100 },
  { key: "status", label: "Status", width: 120, minWidth: 100, cellType: "status" },
];

export const menuMasterRows = [
  { id: 1, menuId: "MN-01", name: "Dashboard", parent: "Root", path: "/dashboard", sequence: 1, status: "Active" },
  { id: 2, menuId: "MN-02", name: "Users", parent: "Administration", path: "/users", sequence: 4, status: "Active" },
  { id: 3, menuId: "MN-03", name: "Role Master", parent: "Administration", path: "/user-roles", sequence: 5, status: "Active" },
  { id: 4, menuId: "MN-04", name: "Menu Master", parent: "Administration", path: "/menu-master", sequence: 6, status: "Pending" },
  { id: 5, menuId: "MN-05", name: "Login Audit", parent: "Security", path: "/login", sequence: 7, status: "Inactive" },
];

export const menuMasterInitialValues = {
  menuName: "",
  parentMenu: "",
  routePath: "",
  iconName: "",
  sequence: "",
  status: "",
};

export const menuMasterFormFields = [
  { name: "menuName", label: "Menu Name", required: true, type: "input", placeholder: "Enter menu name" },
  { name: "parentMenu", label: "Parent Menu", type: "input", placeholder: "Enter parent menu" },
  { name: "routePath", label: "Route Path", required: true, type: "input", placeholder: "Enter route path" },
  { name: "iconName", label: "Icon Name", type: "input", placeholder: "Enter icon name" },
  { name: "sequence", label: "Sequence", type: "input", placeholder: "Enter sequence" },
  { name: "status", label: "Status", type: "input", placeholder: "Enter status" },
];

export const fields = [
  { label: "Lead ID", value: "lead_id", type: "number" },
  { label: "Lead Name", value: "lead_name", type: "text" },
  { label: "Mobile No", value: "mobile_no", type: "text" },
  { label: "Whatsapp Number", value: "whatsapp_number", type: "text" },
  { label: "Lead Email", value: "lead_email", type: "text" },
  { label: "Created Date", value: "created_date", type: "date" },
];

export const savedFilters = [];