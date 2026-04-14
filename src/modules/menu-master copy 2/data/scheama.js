export const layout = [
  {
    label: 'Basic Info',
    row: [
      { field: 'name', colSize: 'w-full mb-3 md:w-1/3' },
      { field: 'assignee', colSize: 'w-full mb-3 md:w-1/3' },
      { field: 'lead_source' },
    ]
  },
  {
    row: [
      { field: 'email', colSize: 'w-full mb-3 md:w-1/3' },
      { custom: 'mobile_no', colSize: 'w-full mb-3 md:w-1/3' },
      { custom: 'wa_number' },
    ]
  },
  {
    row: [
      { field: 'billing_name', colSize: 'w-full mb-3 md:w-1/3' },
      { field: 'billing_address', colSize: 'w-full mb-3 md:w-1/3' },
      { field: 'zipcode' },
    ]
  },
  {
    row: [
      { field: 'adhar_number', colSize: 'w-full mb-3 md:w-1/3' },
      { field: 'pan_number', colSize: 'w-full mb-3 md:w-1/3' },
      { field: 'website' },
    ]
  },
  {
    row: [
      { field: 'gst_no', colSize: 'w-full mb-3 md:w-1/3' },
      { field: 'gst_state', colSize: 'w-full mb-3 md:w-1/3' },
    ]
  },

  {
    row: [
      { custom: 'additional_contacts' },
    ]
  },
  {
    row: [
      { addcustomFieldBtn: true }, { customFieldsPlaceholder: true }
    ]
  },
];

export const defualtFormData = {
  "menu_id": null,
  "menu_name": null,
  "module_name": null,
  "module_description": null,
  "menu_link": null,
  "icon_name": null,
  "label": null,
  "plural_label": null,
  "created_by": null,
  "created_date": null,
  "modified_by": null,
  "modified_date": null,
  "status": 'active'
  
  // "is_parent": "n",
  // "is_create_link": "n",
  // "is_click": "n",
  // "parent_id": "0",
  // "linked": "n",
  // "is_custom": "n",
  // "menu_custom_link": null,
  // "mobile_screen": "n",
  // "show_on_website": "n",
  // "custom_module": "n",
};