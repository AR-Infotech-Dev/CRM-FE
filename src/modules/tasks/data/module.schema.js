import { z } from "zod";
import { buildFallbackColumnsFromKeys } from "../../../utils/moduleStructure";

// const auth_id = window.localStorage.getItem('auth_id')
const FIXED_TABLE_COLUMNS = [
  { key: "select", className: "check-col", checkbox: true, width: 42, minWidth: 42, resizable: false },
  { key: "favorite", className: "icon-col", width: 42, minWidth: 42, resizable: false },
];

export const ticketsModuleSchema = {
  title: "Tickets",
  description: "Manage Tickets, priorities, assignments, and project tracking from one place.",
  menuID: null, // set once menu record exists in DB
  primaryKey: "ticket_id",
  api: {
    list: "/tickets",
    delete: "/tickets/delete",
    create: "/tickets/create",
    edit: "/tickets",
    definitions: "/system/getDefinations",
    definitionsFallback: "/system/getstructure",
  },
  definitionRequest: {
    menuIDField: "menuID",
    modelNameField: "model_name",
    modelName: "Ticket",
  },
  staticJoined: [
    // {
    //   field: "project_id",
    //   fieldtype: "joined",
    //   joinedTable: "projects",
    //   select: "projectID,projectName",
    //   primaryKey: "projectID",
    //   labelKey: "projectName",
    //   options: [],
    // },
    // {
    //   field: "task_",
    //   fieldtype: "joined",
    //   joinedTable: "ticket_categories",
    //   select: "catID,catName",
    //   primaryKey: "catID",
    //   labelKey: "catName",
    //   options: [],
    // },
  ],
  defaultColumns: ["title", "ticket_type", "ticket_status", "ticket_priority", "start_date", "due_date"],
  skipFields: [],
  columnMappings: [
    {"client_id" : "Customer Name"}
  ],
  savedFilters: [],
  form: {
    initialValues: {
      ticket_id: null,
      title: "",
      client_id: null,
      contact_no: null,
      description: "",
      query_type: "",
      ticket_status: "209",
      ticket_priority: "",
      assignee: window.localStorage.getItem('_auth_id') || '',
      start_date: new Date().toISOString().split("T")[0],
      due_date: "",
      created_by: null,
      modified_by: null,
      status: "active",
    },
    // Two-column layout matching the screenshot
    sections: [
      {
        columns: 1,
        fields: [
          {
            name: "title",
            label: "Title",
            type: "text",
            required: true,
            placeholder: "Enter Title",
            gridSpan: 12,
          }, 
        ],
      },
      {
        columns: 1,
        fields: [
          {
            name: "client_id",
            label: "Client Name",
            type: "smartSelectInput",
            required: true,
            id: "client_id",
            gridSpan: 6,
            readOnlyWhen: (values) => Boolean(values.ticket_id),
            config: {
              type: "customer",
              source: "customer",
              list: "customer_id,name,created_date,mobile_no",
              placeholder: "Select Client",
              multi: false,
              getValue: (item) => item.customer_id,
              getLabel: (item) => item.name || "Unnamed Client",
            },
          },
          {
            name: "ticket_status",
            label: "Ticket Status",
            type: "smartSelect",
            id: "ticket_status",
            gridSpan: 6,
            config: {
              apiUrl: "/system/searchSlugList",
              tableName: "categories",
              selectFields: "category_id,categoryName",
              searchField: "categoryName",
              slug: 'ticket_status',
              status: 'active',
              labelKey: "categoryName",
              valueKey: "category_id",
              placeholder: "Select Ticket Status",
              multi: false,
            },
            visibleWhen: (values) => Boolean(values.ticket_id),
          },
        ],
      },
      {
        columns: 3,
        fields: [
          {
            name: "assignee",
            label: "Assigned To",
            type: "smartSelect",
            required: false,
            id: "assignee",
            gridSpan: 6,
            config: {
              apiUrl: "/system/searchList",
              tableName: "admin",
              selectFields: "adminID,name",
              searchField: "name",
              labelKey: "name",
              valueKey: "adminID",
              placeholder: "Select Assignee",
              multi: false
            }
          },
          {
            name: "contact_no",
            label: "Contact Number",
            type: "text",
            placeholder: "+1 (555) 000-0000",
            gridSpan: 6,
            readOnlyWhen: (values) => Boolean(values.client_id),
          },
        ],
      },
      {
        columns: 2,
        fields: [
          { name: "start_date", label: "Start Date", type: "date", placeholder: "Select a date", gridSpan: 6 },
          { name: "due_date", label: "Due Date", type: "date", placeholder: "Select a date", gridSpan: 6 },
        ],
      },
      {
        columns: 2,
        fields: [
          {
            name: "query_type",
            label: "Query Type",
            type: "smartSelect",
            id: "query_type",
            gridSpan: 6,
            config: {
              apiUrl: "/system/searchSlugList",
              tableName: "categories",
              selectFields: "category_id,categoryName",
              searchField: "categoryName",
              slug: 'ticket_type',
              status: 'active',
              labelKey: "categoryName",
              valueKey: "category_id",
              placeholder: "Select Ticket Type",
              multi: false,
            },
          },
          {
            name: "ticket_priority",
            label: "Priority",
            type: "smartSelect",
            id: "ticket_priority",
            gridSpan: 6,
            config: {
              apiUrl: "/system/searchSlugList",
              tableName: "categories",
              selectFields: "category_id,categoryName",
              searchField: "categoryName",
              labelKey: "categoryName",
              slug: 'ticket_priority',
              status: 'active',
              valueKey: "category_id",
              placeholder: "Select Ticket Priority",
              multi: false,
            },
          },
        ],
      },
      {
        columns: 1,
        fields: [
          { name: "description", label: "Description", type: "editor", placeholder: "Provide details about the ticket...", gridSpan: 12 },
        ]
      },
    ],
  },
  validationSchema: z.object({
    client_id: z.coerce.number().min(1, "Customer is Required!"),
    title: z.string().optional(),
    description: z.string().optional(),
    contact_no: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter valid 10-digit mobile number").optional().or(z.literal("")),
    start_date: z.string().optional(),
    due_date: z.string().optional(),
    ticket_type: z.any().optional(),
    ticket_status: z.any().optional(),
    ticket_priority: z.any().optional(),
    status: z.string().default("active"),
  }),
};

export const ticketsFallbackColumns = [
  ...FIXED_TABLE_COLUMNS,
  ...buildFallbackColumnsFromKeys(ticketsModuleSchema.defaultColumns, {
    columnMappings: ticketsModuleSchema.columnMappings,
  }),
];
