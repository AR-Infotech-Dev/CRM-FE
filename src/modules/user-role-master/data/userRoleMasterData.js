export const userRoleMasterColumns = [
  { key: "select", className: "check-col", checkbox: true, width: 42, minWidth: 42, resizable: false },
  { key: "favorite", className: "icon-col", width: 42, minWidth: 42, resizable: false },
  { key: "roleId", label: "Role ID", width: 110, minWidth: 90 },
  { key: "name", label: "Role Name", width: 220, minWidth: 180, cellType: "person" },
  { key: "roleType", label: "Role Type", width: 150, minWidth: 120, cellType: "tag" },
  { key: "assignedUsers", label: "Assigned Users", width: 160, minWidth: 130 },
  { key: "scope", label: "Scope", width: 180, minWidth: 150, cellType: "dotText" },
  { key: "status", label: "Status", width: 120, minWidth: 100, cellType: "status" },
];

export const userRoleMasterRows = [
  { id: 1, roleId: "RL-01", name: "Administrator", roleType: "System", assignedUsers: 12, scope: "Global", status: "Active" },
  { id: 2, roleId: "RL-02", name: "Sales Manager", roleType: "Business", assignedUsers: 7, scope: "Sales", status: "Active" },
  { id: 3, roleId: "RL-03", name: "Support Lead", roleType: "Business", assignedUsers: 5, scope: "Support", status: "Pending" },
  { id: 4, roleId: "RL-04", name: "Finance Reviewer", roleType: "Approval", assignedUsers: 3, scope: "Finance", status: "Inactive" },
  { id: 5, roleId: "RL-05", name: "Marketing Editor", roleType: "Business", assignedUsers: 4, scope: "Marketing", status: "Active" },
];

export const userRoleMasterInitialValues = {
  roleName: "",
  displayName: "",
  roleType: "",
  scope: "",
  description: "",
  status: "",
};

export const userRoleMasterFormFields = [
  { name: "roleName", label: "Role Name", required: true, type: "input", placeholder: "Enter role name" },
  { name: "displayName", label: "Display Name", required: true, type: "input", placeholder: "Enter display name" },
  { name: "roleType", label: "Role Type", type: "input", placeholder: "Enter role type" },
  { name: "scope", label: "Scope", type: "input", placeholder: "Enter scope" },
  { name: "description", label: "Description", type: "input", placeholder: "Enter description" },
  { name: "status", label: "Status", type: "input", placeholder: "Enter status" },
];
