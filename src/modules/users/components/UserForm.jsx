import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import FlyoutPanel from "../../../components/ui/FlyoutPanel";
import ActionButton from "../../../components/ui/ActionButton";
import Input from "../../../components/form-inputs/Input";
import Spinner from "../../../components/ui/Spinner";
import { makeRequest } from "../../../api/httpClient";
import { usersModuleSchema } from "../data/module.schema";

const SECTION_COLUMN_CLASS = {
  1: "grid grid-cols-1 gap-4",
  2: "grid grid-cols-1 gap-4 md:grid-cols-2",
  3: "grid grid-cols-1 gap-4 md:grid-cols-3",
};

function buildJoinedOptions(joinConfig, selectedValue, selectedLabel) {
  const configuredOptions = (joinConfig?.options || []).map((option) => ({
    value: option.value ?? option[joinConfig.primaryKey],
    label: option.label ?? option[joinConfig.labelKey],
  }));

  if (selectedValue && !configuredOptions.some((option) => String(option.value) === String(selectedValue))) {
    return [
      ...configuredOptions,
      {
        value: selectedValue,
        label: selectedLabel || selectedValue,
      },
    ];
  }

  return configuredOptions;
}

function getSelectedLabel(field, value, selectedUser) {
  if (!value) {
    return "";
  }

  if (field.name === "roleID") {
    return selectedUser?.roleName || selectedUser?.role_name || selectedUser?.roleID || value;
  }

  if (field.name === "default_company") {
    return selectedUser?.companyName || selectedUser?.default_company_name || selectedUser?.default_company || value;
  }

  return value;
}

function getUserIdentifier(user = {}) {
  return user?._id || user?.adminID || user?.id || null;
}

function normalizeUserData(selectedUser = {}) {
  return {
    ...usersModuleSchema.form.initialValues,
    ...selectedUser,
    userName: selectedUser?.userName || selectedUser?.user_name || "",
    contactNo: selectedUser?.contactNo || selectedUser?.contactno || "",
    whatsappNo: selectedUser?.whatsappNo || selectedUser?.whatsappno || "",
    dateOfBirth: selectedUser?.dateOfBirth || selectedUser?.dateofbirth || "",
    roleID: selectedUser?.roleID || selectedUser?.roleid || selectedUser?.roleId || "",
    default_company: selectedUser?.default_company || selectedUser?.company_id || "",
    is_approver: selectedUser?.is_approver || "no",
    time_zone: selectedUser?.time_zone || "Asia/Kolkata",
    google_location: selectedUser?.google_location || "",
    address: selectedUser?.address || "",
    status: selectedUser?.status || "active",
  };
}

function UserForm({ isOpen, onClose, selectedUser, onAfterSave }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(usersModuleSchema.form.initialValues);

  const mode = selectedUser ? "edit" : "create";
  const userID = getUserIdentifier(selectedUser);

  useEffect(() => {
    if (selectedUser) {
      setFormData(normalizeUserData(selectedUser));
      return;
    }

    setFormData(usersModuleSchema.form.initialValues);
  }, [selectedUser, isOpen]);

  const joinedFieldOptions = useMemo(
    () =>
      usersModuleSchema.staticJoined.reduce((accumulator, item) => {
        const fieldValue = formData[item.field];
        accumulator[item.field] = buildJoinedOptions(
          item,
          fieldValue,
          getSelectedLabel({ name: item.field }, fieldValue, selectedUser)
        );
        return accumulator;
      }, {}),
    [formData, selectedUser]
  );

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);

    const saveUrl =
      mode === "create"
        ? usersModuleSchema.api.create
        : `${usersModuleSchema.api.edit}/${userID}`;

    const res = await makeRequest(saveUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: formData,
    });

    setLoading(false);

    if (res.success) {
      toast.success(res?.message || `User ${mode === "create" ? "created" : "updated"} successfully.`);
      setFormData(usersModuleSchema.form.initialValues);
      onClose();
      onAfterSave?.();
      return;
    }

    toast.error(res?.msg || `Error while ${mode === "create" ? "creating" : "updating"} user`);
  };

  const renderField = (field) => {
    const value = formData[field.name] ?? "";
    if (field.type === "radio") {
      return (
        <div className="flex flex-col gap-2 p-1">
          <label className="text-xs text-gray-500">
            {field.label}
            {field.required ? <span className="text-red-500"> *</span> : null}
          </label>
          <div className="flex flex-wrap gap-2">
            {field.options.map((option) => {
              const isActive = value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: { name: field.name, value: option.value },
                    })
                  }
                  className={`rounded-md border px-4 py-1.5 text-sm ${
                    isActive
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 bg-slate-100 text-slate-600"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (field.type === "select") {
      const selectOptions = field.joinedField
        ? joinedFieldOptions[field.joinedField] || []
        : field.options || [];

      return (
        <div className="flex flex-col gap-1 p-1">
          <label className="text-xs text-gray-500">
            {field.label}
            {field.required ? <span className="text-red-500"> *</span> : null}
          </label>
          <select
            name={field.name}
            value={value}
            onChange={handleChange}
            className="rounded border border-gray-50 bg-gray-100 px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
          >
            <option value="">{field.placeholder || `Select ${field.label}`}</option>
            {selectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <div className="flex flex-col gap-1 p-1">
          <label className="text-xs text-gray-500">
            {field.label}
            {field.required ? <span className="text-red-500"> *</span> : null}
          </label>
          <textarea
            name={field.name}
            rows={field.rows || 4}
            value={value}
            onChange={handleChange}
            placeholder={field.placeholder}
            className="rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-100"
          />
        </div>
      );
    }

    return (
      <Input
        required={field.required}
        label={field.label}
        name={field.name}
        type={field.type || "text"}
        onChange={handleChange}
        value={value}
        placeholder={field.placeholder}
      />
    );
  };

  return (
    <FlyoutPanel
      isOpen={isOpen}
      onClose={onClose}
      title={selectedUser ? "Edit User" : "Create User"}
      closeButton={
        <button className="flyout-close" onClick={onClose} aria-label="Close panel">
          <X size={18} />
        </button>
      }
      footer={
        <ActionButton
          className={loading ? "bg-purple-200 cursor-not-allowed" : ""}
          disabled={loading}
          variant="flyoutPrimary"
          onClick={handleSave}
        >
          {loading ? <Spinner /> : null} Save
        </ActionButton>
      }
    >
      <div className="flyout-form-shell">
        <div className="ws-main-container space-y-5">
          {usersModuleSchema.form.sections.map((section, sectionIndex) => (
            <div key={`section-${sectionIndex}`} className={SECTION_COLUMN_CLASS[section.columns] || SECTION_COLUMN_CLASS[2]}>
              {section.fields.map((field) => (
                <div key={field.name} className={field.columns === 2 ? "md:col-span-2" : ""}>
                  {renderField(field)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </FlyoutPanel>
  );
}

export default UserForm;
