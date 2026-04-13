function titleCaseFromKey(key = "") {
  return String(key)
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
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
    field?.value ||
    field?.name ||
    field?.field ||
    field?.field_name ||
    field?.column_name ||
    field?.key ||
    ""
  );
}

function getFieldLabel(field, fieldKey) {
  return (
    field?.label ||
    field?.lable ||
    field?.display_name ||
    field?.title ||
    titleCaseFromKey(fieldKey)
  );
}

function getFieldType(field) {
  return String(field?.type || field?.input_type || "text").toLowerCase();
}

export function buildTableColumnsFromStructure(fields = [], fallbackColumns = []) {
  const fixedColumns = fallbackColumns.filter(
    (column) => column.checkbox || column.className === "icon-col"
  );

  const dynamicColumns = fields
    .map((field) => {
      const key = getFieldKey(field);
      if (!key) {
        return null;
      }

      const type = getFieldType(field);
      return {
        key,
        label: getFieldLabel(field, key),
        width: 180,
        minWidth: 120,
        cellType: inferCellType(key, type),
      };
    })
    .filter(Boolean);

  return dynamicColumns.length ? [...fixedColumns, ...dynamicColumns] : fallbackColumns;
}

export function buildFilterFieldsFromStructure(fields = [], fallbackFields = []) {
  const normalizedFields = fields
    .map((field) => {
      const key = getFieldKey(field);
      if (!key) {
        return null;
      }

      const type = getFieldType(field);
      return {
        label: getFieldLabel(field, key),
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
