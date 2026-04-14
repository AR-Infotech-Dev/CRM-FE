import { buildFallbackColumnsFromKeys } from "../../../utils/moduleStructure";

const FIXED_TABLE_COLUMNS = [
  { key: "select", className: "check-col", checkbox: true, width: 42, minWidth: 42, resizable: false },
  { key: "favorite", className: "icon-col", width: 42, minWidth: 42, resizable: false },
];

export const usersModuleSchema = {
  // Copy this object for the next module and update API paths, joined tables,
  // default columns, skip fields, label mappings, and form sections only.
  title: "Users",
  description: "Manage users, roles, company assignment, and approval access from one place.",
  menuID: 20,
  api: {
    list: "/users",
    delete: "/users/delete",
    create: "/users/create",
    edit: "/users/edit",
    definitions: "/system/getDefinations",
    definitionsFallback: "/system/getstructure",
  },
  definitionRequest: {
    menuIDField: "menuID",
    modelNameField: "model_name",
    modelName: "user",
  },
  staticJoined: [
    // Keep joined field metadata here so future modules can reuse the same pattern.
    // If you have dropdown APIs later, options can be filled dynamically from here.
    {
      field: "roleID",
      fieldtype: "joined",
      joinedTable: "user_role_master",
      select: "roleID,roleName",
      primaryKey: "roleID",
      labelKey: "roleName",
      slug: "",
      options: [],
    },
    {
      field: "default_company",
      fieldtype: "company",
      joinedTable: "info_settings",
      select: "infoID,companyName",
      primaryKey: "infoID",
      labelKey: "companyName",
      slug: "",
      options: [],
    },
  ],
  defaultColumns: ["name", "userName", "email", "contactNo", "roleID", "status"],
  skipFields: [
    "user_setting",
    "gfcmToken",
    "otp",
    "country_code",
    "otp_exp_time",
    "g_cal_token",
    "one_drive_access_token",
    "is_google_sync",
    "is_one_drive_sync",
    "ftoken",
    "isVerified",
    "photo",
    "adminID",
    "password",
    "latitude",
    "longitude",
    "roleOfUser",
  ],
  columnMappings: [
    { is_sys_user: "System User" },
    { isEmailSend: "Verification Email Sent" },
    { contactNo: "Contact No" },
    { whatsappNo: "Whatsapp No" },
    { dateOfBirth: "Date Of Birth" },
    { lastLogin: "Last Login" },
    { company_id: "Assigned Company/Branch" },
    { userName: "User Name" },
    { roleID: "User Role" },
    { is_approver: "Approval Privileges" },
    { otp: "OTP" },
  ],
  savedFilters: [],
  form: {
    initialValues: {
      adminID: null,
      name: "",
      default_company: "",
      time_zone: "Asia/Kolkata",
      company_id: "",
      is_approver: "no",
      userName: "",
      email: "",
      isEmailSend: "no",
      password: "",
      is_sys_user: "no",
      roleID: "",
      address: "",
      google_location: "",
      contactNo: "",
      whatsappNo: "",
      dateOfBirth: "",
      created_by: null,
      modified_by: null,
      status: "active",
    },
    sections: [
      // `columns` decides the grid and each field controls label/type/required state.
      {
        columns: 3,
        fields: [
          { name: "name", label: "Name", type: "text", required: true, placeholder: "Enter name" },
          { name: "userName", label: "User Name", type: "text", required: true, placeholder: "Enter user name" },
          { name: "email", label: "Email", type: "email", required: true, placeholder: "Enter email" },
          { name: "dateOfBirth", label: "Date Of Birth", type: "date" },
          { name: "contactNo", label: "Mobile Number", type: "text", required: true, placeholder: "Enter mobile number" },
          { name: "whatsappNo", label: "Whatsapp Number", type: "text", placeholder: "Enter whatsapp number" },
          {
            name: "time_zone",
            label: "Time Zone",
            type: "select",
            options: [
              { value: "Asia/Kolkata", label: "(UTC+05:30) India Standard Time (IST)" },
              { value: "UTC+04:00", label: "(UTC+04:00) Gulf Standard Time (GST)" },
              { value: "UTC+00:00", label: "(UTC+00:00) Greenwich Mean Time (GMT)" },
            ],
          },
          {
            name: "default_company",
            label: "Assign Company/Branch",
            type: "select",
            required: true,
            joinedField: "default_company",
            placeholder: "Select Company/Branch",
          },
          {
            name: "roleID",
            label: "User Role",
            type: "select",
            required: true,
            joinedField: "roleID",
            placeholder: "Select user role",
          },
          {
            name: "is_approver",
            label: "Approval Privileges",
            type: "radio",
            options: [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ],
          },
          { name: "google_location", label: "Google Location", type: "text", placeholder: "Enter google location" },
          {
            name: "status",
            label: "Status",
            type: "radio",
            required: true,
            options: [
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ],
          },
        ],
      },
      {
        columns: 3,
        fields: [
          { name: "name", label: "Name", type: "text", required: true, placeholder: "Enter name" },
          { name: "userName", label: "User Name", type: "text", required: true, placeholder: "Enter user name" },
          { name: "email", label: "Email", type: "email", required: true, placeholder: "Enter email" },
          { name: "dateOfBirth", label: "Date Of Birth", type: "date" },
          { name: "contactNo", label: "Mobile Number", type: "text", required: true, placeholder: "Enter mobile number" },
          { name: "whatsappNo", label: "Whatsapp Number", type: "text", placeholder: "Enter whatsapp number" },
          {
            name: "time_zone",
            label: "Time Zone",
            type: "select",
            options: [
              { value: "Asia/Kolkata", label: "(UTC+05:30) India Standard Time (IST)" },
              { value: "UTC+04:00", label: "(UTC+04:00) Gulf Standard Time (GST)" },
              { value: "UTC+00:00", label: "(UTC+00:00) Greenwich Mean Time (GMT)" },
            ],
          },
          {
            name: "default_company",
            label: "Assign Company/Branch",
            type: "select",
            required: true,
            joinedField: "default_company",
            placeholder: "Select Company/Branch",
          },
          {
            name: "roleID",
            label: "User Role",
            type: "select",
            required: true,
            joinedField: "roleID",
            placeholder: "Select user role",
          },
          {
            name: "is_approver",
            label: "Approval Privileges",
            type: "radio",
            options: [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ],
          },
          { name: "google_location", label: "Google Location", type: "text", placeholder: "Enter google location" },
          {
            name: "status",
            label: "Status",
            type: "radio",
            required: true,
            options: [
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ],
          },
        ],
      },
      {
        columns: 1,
        fields: [
          { name: "address", label: "Address", type: "textarea", placeholder: "Enter address", rows: 4 },
        ],
      },
    ],
  },
};

export const usersFallbackColumns = [
  ...FIXED_TABLE_COLUMNS,
  ...buildFallbackColumnsFromKeys(usersModuleSchema.defaultColumns, {
    columnMappings: usersModuleSchema.columnMappings,
  }),
];
