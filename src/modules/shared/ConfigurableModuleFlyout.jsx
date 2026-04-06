import { useEffect, useState } from "react";
import { X } from "lucide-react";
import ActionButton from "../../components/ui/ActionButton";
import FlyoutPanel from "../../components/ui/FlyoutPanel";
import FormField from "../../components/ui/FormField";

function ConfigurableModuleFlyout({
  isOpen,
  onClose,
  title,
  fields,
  initialValues,
  columnsClassName = "form-grid form-grid-two",
}) {
  const [formData, setFormData] = useState(initialValues);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues, isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onClose();
  };

  const handleSaveAndNew = () => {
    setFormData(initialValues);
  };

  return (
    <FlyoutPanel
      isOpen={isOpen}
      onClose={onClose}
      title={title}
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
          <div className={columnsClassName}>
            {fields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={formData[field.name] || ""}
                onChange={handleChange}
              />
            ))}
          </div>
        </div>
      </div>
    </FlyoutPanel>
  );
}

export default ConfigurableModuleFlyout;
