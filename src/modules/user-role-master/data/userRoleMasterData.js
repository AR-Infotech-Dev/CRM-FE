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
  { id: 1, roleId: "RL-01", role_id: "RL-01", name: "Administrator", role_name: "Administrator", roleType: "System", role_type: "System", assignedUsers: 12, assigned_users: 12, scope: "Global", status: "Active" },
  { id: 2, roleId: "RL-02", role_id: "RL-02", name: "Sales Manager", role_name: "Sales Manager", roleType: "Business", role_type: "Business", assignedUsers: 7, assigned_users: 7, scope: "Sales", status: "Active" },
  { id: 3, roleId: "RL-03", role_id: "RL-03", name: "Support Lead", role_name: "Support Lead", roleType: "Business", role_type: "Business", assignedUsers: 5, assigned_users: 5, scope: "Support", status: "Pending" },
  { id: 4, roleId: "RL-04", role_id: "RL-04", name: "Finance Reviewer", role_name: "Finance Reviewer", roleType: "Approval", role_type: "Approval", assignedUsers: 3, assigned_users: 3, scope: "Finance", status: "Inactive" },
  { id: 5, roleId: "RL-05", role_id: "RL-05", name: "Marketing Editor", role_name: "Marketing Editor", roleType: "Business", role_type: "Business", assignedUsers: 4, assigned_users: 4, scope: "Marketing", status: "Active" },
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
