export const accessRoleOptions = ["Admin", "Manager", "Support Lead", "Finance Reviewer"];

export const accessControlItems = [
  {
    id: "dashboard",
    name: "Dashboard",
    depth: 0,
    permissions: { access: true, view: true, add: true, edit: true, delete: true },
  },
  {
    id: "marketing",
    name: "Marketing",
    depth: 0,
    permissions: { access: true, view: true, add: true, edit: true, delete: true },
  },
  {
    id: "crm",
    name: "CRM",
    depth: 0,
    expandable: true,
    expanded: true,
    permissions: { access: true, view: false, add: false, edit: false, delete: false },
  },
  {
    id: "crm-leads",
    name: "Leads",
    depth: 1,
    parentId: "crm",
    permissions: { access: true, view: true, add: true, edit: false, delete: false },
  },
  {
    id: "crm-customers",
    name: "Customers",
    depth: 1,
    parentId: "crm",
    permissions: { access: true, view: true, add: true, edit: false, delete: false },
  },
  {
    id: "tasks",
    name: "Tasks",
    depth: 0,
    permissions: { access: true, view: true, add: true, edit: true, delete: true },
  },
  {
    id: "settings",
    name: "Settings",
    depth: 0,
    expandable: true,
    expanded: true,
    permissions: { access: true, view: true, add: true, edit: true, delete: true },
  },
  {
    id: "settings-users",
    name: "Users",
    depth: 1,
    parentId: "settings",
    permissions: { access: true, view: true, add: true, edit: true, delete: true },
  },
  {
    id: "settings-user-roles",
    name: "User Roles",
    depth: 1,
    parentId: "settings",
    permissions: { access: true, view: true, add: true, edit: true, delete: true },
  },
  {
    id: "settings-modules",
    name: "Modules and Links",
    depth: 1,
    parentId: "settings",
    permissions: { access: true, view: true, add: true, edit: true, delete: true },
  },
  {
    id: "settings-theme",
    name: "Theme Options",
    depth: 1,
    parentId: "settings",
    permissions: { access: true, view: true, add: true, edit: true, delete: true },
  },
  {
    id: "company-master",
    name: "Company Master",
    depth: 0,
    permissions: { access: true, view: true, add: true, edit: true, delete: true },
  },
  {
    id: "category",
    name: "Category",
    depth: 0,
    permissions: { access: true, view: true, add: true, edit: true, delete: true },
  },
];

export const accessPermissionColumns = [
  { key: "access", label: "Module Access" },
  { key: "view", label: "View" },
  { key: "add", label: "Add" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
];
