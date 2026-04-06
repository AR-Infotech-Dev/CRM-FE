import { useState } from "react";
import { X } from "lucide-react";
import { initialLeadForm, leadFormFields } from "../data/leadForm";
import FlyoutPanel from "./ui/FlyoutPanel";
import FormField from "./ui/FormField";
import ActionButton from "./ui/ActionButton";
// Example: import { createLead } from "../api";

function AddNewFlyout({ isOpen, onClose }) {
  const [formData, setFormData] = useState(initialLeadForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Wire `createLead(formData)` here when the backend is ready.
    onClose();
  };

  const handleSaveAndNew = () => {
    setFormData(initialLeadForm);
  };

  const clearAssignee = () => {
    setFormData((current) => ({
      ...current,
      assignee: "",
    }));
  };

  return (
    <FlyoutPanel
      isOpen={isOpen}
      onClose={onClose}
      title="Create Lead"
      closeButton={
        <button className="flyout-close" onClick={onClose} aria-label="Close panel">
          <X size={18} />
        </button>
      }
      footer={
        <>
          <ActionButton variant="flyoutPrimary" onClick={handleSave}>
            Save
          </ActionButton>
          <ActionButton variant="flyoutSecondary" onClick={handleSaveAndNew}>
            Save and New
          </ActionButton>
        </>
      }
    >
      <div className="flyout-form-shell">
        <div className="ws-main-container">
          <div className="form-grid">
            {leadFormFields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={formData[field.name]}
                onChange={handleChange}
                onClear={field.name === "assignee" ? clearAssignee : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </FlyoutPanel>
  );
}

export default AddNewFlyout;
