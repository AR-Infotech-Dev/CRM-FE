function titleCaseFromKey(key = "") {
  return String(key)
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeKey(value = "") {
  return String(value).replace(/\s+/g, "").replace(/_/g, "").toLowerCase();
}

function buildLabelMap(columnMappings = []) {
  return columnMappings.reduce((accumulator, item) => {
    const [key, label] = Object.entries(item || {})[0] || [];
    if (key && label) {
      accumulator[normalizeKey(key)] = label;
    }
    return accumulator;
  }, {});
}

function inferCellType(fieldKey, fieldType) {
  const normalizedKey = String(fieldKey || "").toLowerCase();
  const normalizedType = String(fieldType || "").toLowerCase();

  if (normalizedKey.includes("status")) {
    return "status";
  }

  if (normalizedKey.includes("name")) {
    return "person";
  }

  if (normalizedKey.includes("email") || normalizedKey.includes("link")) {
    return "clip";
  }

  if (
    normalizedKey.includes("role") ||
    normalizedKey.includes("type")
  ) {
    return "tag";
  }

  if (
    normalizedKey.includes("department") ||
    normalizedKey.includes("module")
  ) {
    return "dotText";
  }

  if (normalizedType === "textarea" || normalizedType === "editor") {
    return "clip";
  }

  return undefined;
}

function getFieldKey(field) {
  return (
    field?.Field ||
    field?.value ||
    field?.name ||
    field?.field ||
    field?.field_name ||
    field?.column_name ||
    field?.key ||
    ""
  );
}

function getFieldLabel(field, fieldKey, labelMap = {}) {
  return (
    labelMap[normalizeKey(fieldKey)] ||
    field?.label ||
    field?.lable ||
    field?.display_name ||
    field?.title ||
    titleCaseFromKey(fieldKey)
  );
}

function getFieldType(field) {
  return String(field?.Type || field?.type || field?.input_type || "text").toLowerCase();
}

export function buildFallbackColumnsFromKeys(keys = [], options = {}) {
  const labelMap = buildLabelMap(options.columnMappings);

  return keys.map((key) => ({
    key,
    label: getFieldLabel({}, key, labelMap),
    width: 180,
    minWidth: 120,
    cellType: inferCellType(key, "text"),
  }));
}

export function buildTableColumnsFromStructure(fields = [], fallbackColumns = [], options = {}) {
  const skipFieldSet = new Set((options.skipFields || []).map((field) => normalizeKey(field)));
  const labelMap = buildLabelMap(options.columnMappings);
  const fixedColumns = fallbackColumns.filter(
    (column) => column.checkbox || column.className === "icon-col"
  );

  const dynamicColumns = fields
    .map((field) => {
      const key = getFieldKey(field);
      if (!key || skipFieldSet.has(normalizeKey(key))) {
        return null;
      }

      const type = getFieldType(field);
      return {
        key,
        label: getFieldLabel(field, key, labelMap),
        width: 180,
        minWidth: 120,
        cellType: inferCellType(key, type),
      };
    })
    .filter(Boolean);

  return dynamicColumns.length ? [...fixedColumns, ...dynamicColumns] : fallbackColumns;
}

export function buildFilterFieldsFromStructure(fields = [], fallbackFields = [], options = {}) {
  const skipFieldSet = new Set((options.skipFields || []).map((field) => normalizeKey(field)));
  const labelMap = buildLabelMap(options.columnMappings);
  const normalizedFields = fields
    .map((field) => {
      const key = getFieldKey(field);
      if (!key || skipFieldSet.has(normalizeKey(key))) {
        return null;
      }

      const type = getFieldType(field);
      return {
        label: getFieldLabel(field, key, labelMap),
        value: key,
        type:
          type === "number" || type === "numeric"
            ? "number"
            : type === "date"
              ? "date"
              : "text",
      };
    })
    .filter(Boolean);

  return normalizedFields.length ? normalizedFields : fallbackFields;
}
