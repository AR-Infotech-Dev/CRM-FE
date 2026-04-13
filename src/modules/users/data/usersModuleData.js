export const usersColumns = [
  { key: "select", className: "check-col", checkbox: true, width: 42, minWidth: 42, resizable: false },
  { key: "favorite", className: "icon-col", width: 42, minWidth: 42, resizable: false },
  { key: "userId", label: "User ID", width: 110, minWidth: 96 },
  { key: "name", label: "User Name", width: 220, minWidth: 180, cellType: "person" },
  { key: "email", label: "Email", width: 250, minWidth: 210, cellType: "clip" },
  { key: "role", label: "Role", width: 150, minWidth: 120, cellType: "tag" },
  { key: "phone", label: "Phone", width: 150, minWidth: 130 },
  { key: "department", label: "Department", width: 160, minWidth: 130, cellType: "dotText" },
  { key: "status", label: "Status", width: 120, minWidth: 110, cellType: "status" },
];

export const usersRows = [
  { id: 99, userId: 99, user_id: 99, name: "Aarav Mehta", user_name: "Aarav Mehta", email: "aarav.mehta@company.com", role: "Admin", phone: "9985887047", department: "Operations", status: "Active" },
  { id: 99, userId: 99, user_id: 99, name: "Aarav Mehta", user_name: "Aarav Mehta", email: "aarav.mehta@company.com", role: "Admin", phone: "9985887047", department: "Operations", status: "Active" },
  { id: 99, userId: 99, user_id: 99, name: "Aarav Mehta", user_name: "Aarav Mehta", email: "aarav.mehta@company.com", role: "Admin", phone: "9985887047", department: "Operations", status: "Active" },
  { id: 99, userId: 99, user_id: 99, name: "Aarav Mehta", user_name: "Aarav Mehta", email: "aarav.mehta@company.com", role: "Admin", phone: "9985887047", department: "Operations", status: "Active" },
  { id: 99, userId: 99, user_id: 99, name: "Aarav Mehta", user_name: "Aarav Mehta", email: "aarav.mehta@company.com", role: "Admin", phone: "9985887047", department: "Operations", status: "Active" },
  { id: 98, userId: 98, user_id: 98, name: "Diya Kapoor", user_name: "Diya Kapoor", email: "diya.kapoor@company.com", role: "Manager", phone: "9677772176", department: "Sales", status: "Active" },
  { id: 97, userId: 97, user_id: 97, name: "Kabir Singh", user_name: "Kabir Singh", email: "kabir.singh@company.com", role: "Executive", phone: "-", department: "Support", status: "Inactive" },
  { id: 96, userId: 96, user_id: 96, name: "Anaya Sharma", user_name: "Anaya Sharma", email: "anaya.sharma@company.com", role: "Executive", phone: "9870365312", department: "Marketing", status: "Active" },
  { id: 96, userId: 96, user_id: 96, name: "Anaya Sharma", user_name: "Anaya Sharma", email: "anaya.sharma@company.com", role: "Executive", phone: "9870365312", department: "Marketing", status: "Active" },
  { id: 96, userId: 96, user_id: 96, name: "Anaya Sharma", user_name: "Anaya Sharma", email: "anaya.sharma@company.com", role: "Executive", phone: "9870365312", department: "Marketing", status: "Active" },
  { id: 96, userId: 96, user_id: 96, name: "Anaya Sharma", user_name: "Anaya Sharma", email: "anaya.sharma@company.com", role: "Executive", phone: "9870365312", department: "Marketing", status: "Active" },
  { id: 96, userId: 96, user_id: 96, name: "Anaya Sharma", user_name: "Anaya Sharma", email: "anaya.sharma@company.com", role: "Executive", phone: "9870365312", department: "Marketing", status: "Active" },
  { id: 96, userId: 96, user_id: 96, name: "Anaya Sharma", user_name: "Anaya Sharma", email: "anaya.sharma@company.com", role: "Executive", phone: "9870365312", department: "Marketing", status: "Active" },
  { id: 96, userId: 96, user_id: 96, name: "Anaya Sharma", user_name: "Anaya Sharma", email: "anaya.sharma@company.com", role: "Executive", phone: "9870365312", department: "Marketing", status: "Active" },
  { id: 96, userId: 96, user_id: 96, name: "Anaya Sharma", user_name: "Anaya Sharma", email: "anaya.sharma@company.com", role: "Executive", phone: "9870365312", department: "Marketing", status: "Active" },
  { id: 94, userId: 94, user_id: 94, name: "Rohan Patel", user_name: "Rohan Patel", email: "rohan.patel@company.com", role: "Manager", phone: "9442339669", department: "Finance", status: "Active" },
  { id: 93, userId: 93, user_id: 93, name: "Ishita Verma", user_name: "Ishita Verma", email: "ishita.verma@company.com", role: "Executive", phone: "9443724075", department: "HR", status: "Pending" },
  { id: 93, userId: 93, user_id: 93, name: "Ishita Verma", user_name: "Ishita Verma", email: "ishita.verma@company.com", role: "Executive", phone: "9443724075", department: "HR", status: "Pending" },
  { id: 93, userId: 93, user_id: 93, name: "Ishita Verma", user_name: "Ishita Verma", email: "ishita.verma@company.com", role: "Executive", phone: "9443724075", department: "HR", status: "Pending" },
  { id: 93, userId: 93, user_id: 93, name: "Ishita Verma", user_name: "Ishita Verma", email: "ishita.verma@company.com", role: "Executive", phone: "9443724075", department: "HR", status: "Pending" },
  { id: 93, userId: 93, user_id: 93, name: "Ishita Verma", user_name: "Ishita Verma", email: "ishita.verma@company.com", role: "Executive", phone: "9443724075", department: "HR", status: "Pending" },
];

export const userFormInitialValues = {
  userName: "",
  email: "",
  role: "",
  phone: "",
  department: "",
  status: "",
};

export const userFormFields = [
  { name: "userName", label: "User Name", required: true, type: "input", placeholder: "Enter user name" },
  { name: "email", label: "Email", required: true, type: "input", placeholder: "Enter email" },
  { name: "role", label: "Role", type: "input", placeholder: "Enter role" },
  { name: "phone", label: "Phone", type: "input", placeholder: "Enter phone" },
  { name: "department", label: "Department", type: "input", placeholder: "Enter department" },
  { name: "status", label: "Status", type: "input", placeholder: "Enter status" },
];
