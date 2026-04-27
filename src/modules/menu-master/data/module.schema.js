import { buildFallbackColumnsFromKeys } from "../../../utils/moduleStructure";
import { z } from "zod";

const FIXED_TABLE_COLUMNS = [
  { key: "select", className: "check-col", checkbox: true, width: 42, minWidth: 42, resizable: false },
];

export const menuMasterSchema = {
  title: "Menu Master",
  description: "Create and manage menus, modules, sidebar routes and dynamic system links.",
  menuID: 3,
  primaryKey: "menuID",

  api: {
    list: "/menus",
    delete: "/menus/delete",
    create: "/menus/create",
    edit: "/menus",
    definitions: "/system/getDefinations",
    definitionsFallback: "/system/getstructure",
  },

  definitionRequest: {
    menuIDField: "menuID",
    modelNameField: "model_name",
    modelName: "menu",
  },

  staticJoined: [
    {
      field: "parentID",
      fieldtype: "joined",
      joinedTable: "menu",
      select: "menuID,menuName",
      primaryKey: "menuID",
      labelKey: "menuName",
      slug: "",
      options: [],
    },
  ],

  defaultColumns: [
    "menuName",
    "module_name",
    "menuLink",
    "isParent",
    "menuIndex",
    "status",
  ],

  skipFields: [
    "metadata",
    "c_metadata",
    "quick_create_fields",
    "created_by",
    "created_date",
    "modified_by",
    "modified_date",
  ],

  tableCellConfig: [
    { column_name: "menuName", type: "person" },
    { column_name: "module_name", type: "tag" },
    { column_name: "status", type: "badge", color_field: "status_color" },
  ],

  columnMappings: [
    { menuName: "Menu Name" },
    { module_name: "Module Name" },
    { module_desc: "Description" },
    { menuLink: "Route Link" },
    { menu_custom_link: "Custom Link" },
    { isParent: "Parent Menu" },
    { parentID: "Parent Name" },
    { iconName: "Icon" },
    { menuIndex: "Order" },
    { is_create_link: "Create Link" },
    { custom_module: "Existing Module" },
    { linked: "Linked" },
    { is_custom: "Custom" },
    { show_on_website: "Website" },
    { mobile_screen: "Mobile" },
    { label: "Form Label" },
    { plural_label: "Plural Label" },
    { table_name: "Table Name" },
    { status: "Status" },
  ],

  savedFilters: [],

  form: {
    initialValues: {
      menuID: null,

      is_create_link: "yes",
      custom_module: "no",
      show_on_website: "yes",
      mobile_screen: "no",
      linked: "n",
      is_custom: "n",

      module_name: "",
      menuName: "",
      module_desc: "",
      menuLink: "",
      menu_custom_link: "",

      table_name: "",
      label: "",
      plural_label: "",

      isParent: "yes",
      parentID: "",

      iconName: "",
      menuIndex: 1,
      status: "active",
    },

    sections: [
      // ===================================================
      // SECTION 1 : TOP TOGGLES
      // ===================================================
      {
        columns: 3,
        fields: [
        //   {
        //     name: "is_create_link",
        //     label: "Do you want to create link?",
        //     type: "radio",
        //     options: [
        //       { label: "Yes", value: "yes" },
        //       { label: "No", value: "no" },
        //     ],
        //   },
          {
            name: "custom_module",
            label: "Link Existing Module?",
            type: "radio",
            options: [
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ],
            visibleWhen: (values) =>
              values.is_create_link === "yes",
          },
        //   {
        //     name: "show_on_website",
        //     label: "Show On Website",
        //     type: "radio",
        //     options: [
        //       { label: "Yes", value: "yes" },
        //       { label: "No", value: "no" },
        //     ],
        //   },
        ],
      },

      // ===================================================
      // SECTION 2 : EXTRA TOGGLES
      // ===================================================
      {
        columns: 3,
        fields: [
        //   {
        //     name: "mobile_screen",
        //     label: "Show On Mobile",
        //     type: "radio",
        //     options: [
        //       { label: "Yes", value: "yes" },
        //       { label: "No", value: "no" },
        //     ],
        //   },
        //   {
        //     name: "is_custom",
        //     label: "Is Custom Link",
        //     type: "radio",
        //     options: [
        //       { label: "Yes", value: "y" },
        //       { label: "No", value: "n" },
        //     ],
        //   },
        //   {
        //     name: "linked",
        //     label: "Is Linked",
        //     type: "radio",
        //     options: [
        //       { label: "Yes", value: "y" },
        //       { label: "No", value: "n" },
        //     ],
        //   },
        ],
      },

      // ===================================================
      // SECTION 3 : MAIN TEXT FIELDS
      // ===================================================
      {
        columns: 3,
        fields: [
          {
            name: "module_name",
            label: "Module Name",
            type: "text",
            placeholder: "Ex: users",
            required: true,
            visibleWhen: (values) =>
              values.custom_module === "no",
          },
          {
            name: "menuName",
            label: "Menu Name",
            type: "text",
            placeholder: "Ex: Users",
            required: true,
          },
          {
            name: "module_desc",
            label: "Description",
            type: "text",
            placeholder: "Enter description",
          },
          {
            name: "menuLink",
            label: "Menu Link",
            type: "text",
            placeholder: "Ex: /users",
            required: true,
            visibleWhen: (values) =>
              values.is_custom === "n",
          },
        ],
      },

      // ===================================================
      // SECTION 4 : LINKS
      // ===================================================
      {
        columns: 3,
        fields: [
        //   {
        //     name: "menuLink",
        //     label: "Menu Link",
        //     type: "text",
        //     placeholder: "Ex: /users",
        //     required: true,
        //     visibleWhen: (values) =>
        //       values.is_custom === "n",
        //   },
        //   {
        //     name: "menu_custom_link",
        //     label: "Custom Link",
        //     type: "text",
        //     placeholder: "https://example.com",
        //     visibleWhen: (values) =>
        //       values.is_custom === "y",
        //   },
        //   {
        //     name: "menuIndex",
        //     label: "Menu Order",
        //     type: "number",
        //     placeholder: "1",
        //   },
        ],
      },

      // ===================================================
      // SECTION 5 : LABELS
      // ===================================================
      {
        columns: 3,
        fields: [
          {
            name: "table_name",
            label: "Table Name",
            type: "text",
            placeholder: "Ex: admin",
            visibleWhen: (values) =>
              values.custom_module === "yes",
          },
          {
            name: "label",
            label: "Form Label",
            type: "text",
            placeholder: "Ex: User",
          },
          {
            name: "plural_label",
            label: "Plural Label",
            type: "text",
            placeholder: "Ex: Users",
          },
        ],
      },

      // ===================================================
      // SECTION 6 : PARENT + ICON
      // ===================================================
    //   {
    //     columns: 3,
    //     fields: [
    //     //   {
    //     //     name: "isParent",
    //     //     label: "Is Parent Menu",
    //     //     type: "radio",
    //     //     options: [
    //     //       { label: "Yes", value: "yes" },
    //     //       { label: "No", value: "no" },
    //     //     ],
    //     //   },
    //     //   {
    //     //     name: "parentID",
    //     //     label: "Parent Menu",
    //     //     type: "smartSelect",
    //     //     id: "parentID",
    //     //     config: {
    //     //       apiUrl: "/menus",
    //     //       tableName: "menu",
    //     //       selectFields: "menuID,menuName",
    //     //       searchField: "menuName",
    //     //       labelKey: "menuName",
    //     //       valueKey: "menuID",
    //     //       placeholder: "Select Parent Menu",
    //     //       multi: false,
    //     //     },
    //     //     visibleWhen: (values) =>
    //     //       values.isParent === "no",
    //     //   },
    //       {
    //         name: "iconName",
    //         label: "Icon Name",
    //         type: "text",
    //         placeholder: "Ex: Users",
    //       },
    //     ],
    //   },

      // ===================================================
      // SECTION 7 : STATUS
      // ===================================================
      {
        columns: 1,
        fields: [
          {
            name: "status",
            label: "Status",
            type: "radio",
            options: [
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ],
          },
        ],
      },
    ],
  },

  validationSchema: z.object({
    menuName: z.string().min(1, "Menu name is required"),
    menuLink: z.string().optional(),
    module_name: z.string().optional(),
    menuIndex: z.coerce.number().min(1, "Menu order required"),
    status: z.string().min(1, "Status required"),
  }),
};

export const menuMasterFallbackColumns = [
  ...FIXED_TABLE_COLUMNS,
  ...buildFallbackColumnsFromKeys(
    menuMasterSchema.defaultColumns,
    {
      columnMappings:
        menuMasterSchema.columnMappings,
      tableCellConfig:
        menuMasterSchema.tableCellConfig,
    }
  ),
];
