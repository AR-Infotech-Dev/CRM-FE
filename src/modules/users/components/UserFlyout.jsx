import { useState } from "react";
import { X } from "lucide-react";
import ActionButton from "../../../components/ui/ActionButton";
import FlyoutPanel from "../../../components/ui/FlyoutPanel";
import FormField from "../../../components/ui/FormField";
import { userFormFields, userFormInitialValues } from "../data/usersModuleData";

function UserFlyout({ isOpen, onClose }) {
  const [formData, setFormData] = useState(userFormInitialValues);

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
    setFormData(userFormInitialValues);
  };

  return (
    <FlyoutPanel
      isOpen={isOpen}
      onClose={onClose}
      title="Create User"
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
          <div className="form-grid form-grid-two">
            {userFormFields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={formData[field.name]}
                onChange={handleChange}
              />
            ))}
          </div>
        </div>
      </div>
    </FlyoutPanel>
  );
}

export default UserFlyout;
