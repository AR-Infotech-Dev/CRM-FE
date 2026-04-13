import { useEffect, useState } from "react";
import { X } from "lucide-react";
import ActionButton from "../../components/ui/ActionButton";
import FlyoutPanel from "../../components/ui/FlyoutPanel";
import FormField from "../../components/ui/FormField";
import {
  userRoleMasterFormFields,
  userRoleMasterInitialValues,
} from "./data/userRoleMasterData";

function UserRoleForm({ isOpen, onClose, selectedRole }) {
  const [formData, setFormData] = useState(userRoleMasterInitialValues);

  useEffect(() => {
    if (selectedRole) {
      setFormData({
        roleName: selectedRole.name || "",
        displayName: selectedRole.name || "",
        roleType: selectedRole.roleType || "",
        scope: selectedRole.scope || "",
        description: selectedRole.description || "",
        status: selectedRole.status || "",
      });
      return;
    }

    setFormData(userRoleMasterInitialValues);
  }, [selectedRole, isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  return (
    <FlyoutPanel
      isOpen={isOpen}
      onClose={onClose}
      title={selectedRole ? "Edit User Role" : "Create User Role"}
      closeButton={
        <button className="flyout-close" onClick={onClose} aria-label="Close panel">
          <X size={18} />
        </button>
      }
      footer={
        <ActionButton variant="flyoutPrimary" onClick={onClose}>
          Save
        </ActionButton>
      }
    >
      <div className="flyout-form-shell">
        <div className="ws-main-container">
          <div className="form-grid form-grid-two">
            {userRoleMasterFormFields.map((field) => (
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

export default UserRoleForm;
