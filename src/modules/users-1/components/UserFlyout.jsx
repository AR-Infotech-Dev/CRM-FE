import { useEffect, useState } from "react";
import { X } from "lucide-react";
import ActionButton from "../../../components/ui/ActionButton";
import FlyoutPanel from "../../../components/ui/FlyoutPanel";
import FormField from "../../../components/ui/FormField";
import { userFormFields, userFormInitialValues } from "../data/usersModuleData";

function UserFlyout({ isOpen, onClose, title = "Create User", selectedUser = null }) {
  const [formData, setFormData] = useState(userFormInitialValues);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        userName: selectedUser.name || "",
        email: selectedUser.email || "",
        role: selectedUser.role || "",
        phone: selectedUser.phone || "",
        department: selectedUser.department || "",
        status: selectedUser.status || "",
      });
      return;
    }

    setFormData(userFormInitialValues);
  }, [selectedUser, isOpen]);

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
