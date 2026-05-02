import { z } from "zod";
import { buildFallbackColumnsFromKeys } from "../../../utils/moduleStructure";

const FIXED_TABLE_COLUMNS = [
  { key: "select", className: "check-col", checkbox: true, width: 42, minWidth: 42, resizable: false },
];

export const customerModuleSchema = {
  title: "Customer",
  description: "Manage customer profile, contacts, company mapping, and billing details from one place.",
  menuID: null,
  primaryKey: "customer_id",
  api: {
    list: "/customers",
    delete: "/customers/delete",
    create: "/customers/create",
    edit: "/customers",
    definitions: "/system/getDefinations",
    definitionsFallback: "/system/getstructure",
  },
  definitionRequest: {
    menuIDField: "menuID",
    modelNameField: "model_name",
    modelName: "customer",
  },
  staticJoined: [],
  tableCellConfig: [
    { column_name: "name", type: "person" },
    { column_name: "email", type: "clip" },
    { column_name: "company_name", type: "tag" },
    { column_name: "billing_name", type: "tag" },
  ],
  defaultColumns: ["name", "email", "mobile_no", "company_name", "billing_name"],
  skipFields: ["created_by", "created_date", "modified_by"],
  columnMappings: [
    { mobile_no: "Mobile No" },
    { wa_no: "WhatsApp No" },
    { birth_date: "Birth Date" },
    { pan_number: "PAN Number" },
    { company_name: "Company Name" },
    { billing_name: "Billing Name" },
    { billing_address: "Billing Address" },
    { mailing_address: "Mailing Address" },
    { company_id: "Mapped Company" },
  ],
  savedFilters: [],
  form: {
    initialValues: {
      customer_id: null,
      name: "",
      email: "",
      mobile_no: "",
      wa_no: "",
      birth_date: "",
      address: "",
      pan_number: "",
      company_name: "",
      billing_name: "",
      billing_address: "",
      company_id: "",
      mailing_address: "",
      created_by: null,
      created_date: null,
      modified_by: null,
    },
    sections: [
      {
        columns: 2,
        fields: [
          { name: "name", label: "Customer Name", type: "text", required: true, placeholder: "Enter customer name", gridSpan: 6 },
          { name: "email", label: "Email", type: "email", placeholder: "Enter email address", gridSpan: 6 },
        ],
      },
      {
        columns: 3,
        fields: [
          { name: "mobile_no", label: "Mobile No", type: "text", required: true, placeholder: "Enter mobile number", gridSpan: 4 },
          { name: "wa_no", label: "WhatsApp No", type: "text", placeholder: "Enter WhatsApp number", gridSpan: 4 },
          { name: "birth_date", label: "Birth Date", type: "date", placeholder: "Select birth date", gridSpan: 4 },
        ],
      },
      {
        columns: 2,
        fields: [
          { name: "pan_number", label: "PAN Number", type: "text", placeholder: "Enter PAN number", gridSpan: 6 },
          {
            name: "company_id",
            label: "Mapped Company",
            type: "smartSelect",
            id: "company_id",
            gridSpan: 6,
            config: {
              apiUrl: "/system/searchList",
              tableName: "info_settings",
              selectFields: "company_name,infoID",
              searchField: "company_name",
              labelKey: "company_name",
              valueKey: "infoID",
              placeholder: "Select Company",
              multi: false,
            },
          },
        ],
      },
      {
        columns: 2,
        fields: [
          { name: "company_name", label: "Company Name", type: "text", placeholder: "Enter company name", gridSpan: 6 },
          { name: "billing_name", label: "Billing Name", type: "text", placeholder: "Enter billing name", gridSpan: 6 },
        ],
      },
      {
        columns: 1,
        fields: [
          { name: "address", label: "Address", type: "textarea", rows: 3, placeholder: "Enter primary address", gridSpan: 12 },
        ],
      },
      {
        columns: 2,
        fields: [
          { name: "billing_address", label: "Billing Address", type: "textarea", rows: 3, placeholder: "Enter billing address", gridSpan: 6 },
          { name: "mailing_address", label: "Mailing Address", type: "textarea", rows: 3, placeholder: "Enter mailing address", gridSpan: 6 },
        ],
      },
    ],
  },
  validationSchema: z.object({
    name: z.string().trim().min(1, "Customer name is required"),
    email: z.union([z.literal(""), z.string().email("Invalid email address")]).optional(),
    mobile_no: z.string().trim().min(10, "Mobile number is required"),
    wa_th_date: z.string().optional(),
    addno: z.string().optional(),
    birress: z.string().optional(),
    pan_number: z.union([
      z.literal(""),
      z.string().trim().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN number"),
    ]).optional(),
    company_name: z.string().optional(),
    billing_name: z.string().optional(),
    billing_address: z.string().optional(),
    company_id: z.any().optional(),
    mailing_address: z.string().optional(),
  }),
};

export const customerFallbackColumns = [
  ...FIXED_TABLE_COLUMNS,
  ...buildFallbackColumnsFromKeys(customerModuleSchema.defaultColumns, {
    columnMappings: customerModuleSchema.columnMappings,
    tableCellConfig: customerModuleSchema.tableCellConfig,
  }),
];
