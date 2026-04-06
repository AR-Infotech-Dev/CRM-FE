export const loginModuleColumns = [
  { key: "select", className: "check-col", checkbox: true, width: 42, minWidth: 42, resizable: false },
  { key: "favorite", className: "icon-col", width: 42, minWidth: 42, resizable: false },
  { key: "loginId", label: "Login ID", width: 110, minWidth: 90 },
  { key: "name", label: "User", width: 220, minWidth: 180, cellType: "person" },
  { key: "email", label: "Email", width: 240, minWidth: 200, cellType: "clip" },
  { key: "device", label: "Device", width: 170, minWidth: 140, cellType: "tag" },
  { key: "lastLogin", label: "Last Login", width: 170, minWidth: 140 },
  { key: "status", label: "Status", width: 120, minWidth: 100, cellType: "status" },
];

export const loginModuleRows = [
  { id: 1, loginId: "LG-01", name: "Aarav Mehta", email: "aarav.mehta@company.com", device: "Chrome", lastLogin: "04 Apr 2026, 12:22", status: "Active" },
  { id: 2, loginId: "LG-02", name: "Diya Kapoor", email: "diya.kapoor@company.com", device: "Firefox", lastLogin: "04 Apr 2026, 10:11", status: "Active" },
  { id: 3, loginId: "LG-03", name: "Kabir Singh", email: "kabir.singh@company.com", device: "iPhone", lastLogin: "03 Apr 2026, 21:08", status: "Inactive" },
  { id: 4, loginId: "LG-04", name: "Anaya Sharma", email: "anaya.sharma@company.com", device: "Edge", lastLogin: "03 Apr 2026, 18:42", status: "Pending" },
  { id: 5, loginId: "LG-05", name: "Rohan Patel", email: "rohan.patel@company.com", device: "Safari", lastLogin: "03 Apr 2026, 16:26", status: "Active" },
];

export const loginModuleInitialValues = {
  userName: "",
  email: "",
  password: "",
  device: "",
  lastLogin: "",
  status: "",
};

export const loginModuleFormFields = [
  { name: "userName", label: "User Name", required: true, type: "input", placeholder: "Enter user name" },
  { name: "email", label: "Email", required: true, type: "input", placeholder: "Enter email" },
  { name: "password", label: "Password", required: true, type: "input", placeholder: "Enter password" },
  { name: "device", label: "Device", type: "input", placeholder: "Enter device" },
  { name: "lastLogin", label: "Last Login", type: "input", placeholder: "Enter last login" },
  { name: "status", label: "Status", type: "input", placeholder: "Enter status" },
];
