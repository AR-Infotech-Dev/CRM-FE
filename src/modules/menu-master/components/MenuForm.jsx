import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { makeRequest } from "../../../api/httpClient";
import FlyoutPanel from "../../../components/ui/FlyoutPanel";
import ActionButton from "../../../components/ui/ActionButton";
import Spinner from "../../../components/ui/Spinner";
import DynamicModuleForm from "../../../components/ui/DynamicModuleForm";
import { menuMasterSchema } from "../data/module.schema";

function getMenuIdentifier(menu = {}) {
  return menu?.menuID;
}

function normalizeMenuData(selectedMenu = {}) {
  return {
    ...menuMasterSchema.form.initialValues,
    ...selectedMenu,
    menuName: selectedMenu?.menuName || "",
    module_name: selectedMenu?.module_name || "",
    module_desc: selectedMenu?.module_desc || "",
    menuLink: selectedMenu?.menuLink || "",
    parentID: selectedMenu?.parentID || "",
    iconName: selectedMenu?.iconName || "",
    status: selectedMenu?.status || "active",
  };
}

function MenuForm({ isOpen, onClose, selectedMenu, onAfterSave }) {
  const [loading, setLoading] = useState(false);
  const [fetchingMenu, setFetchingMenu] = useState(false);
  const [formData, setFormData] = useState(menuMasterSchema.form.initialValues);
  const [errors, setErrors] = useState({});

  const mode = selectedMenu ? "edit" : "create";
  const menuID = getMenuIdentifier(selectedMenu);

  // ======================================
  // FETCH MENU DETAILS (EDIT)
  // ======================================
  useEffect(() => {
    const fetchMenuDetails = async () => {
      if (!isOpen || !menuID) return;

      try {
        setFetchingMenu(true);

        const res = await makeRequest(
          `${menuMasterSchema.api.edit}/${menuID}`,
          { method: "GET" }
        );

        setFormData(normalizeMenuData(res?.data));
      } catch (error) {
        toast.error("Unable to fetch menu details");
        setFormData(normalizeMenuData(selectedMenu));
      } finally {
        setFetchingMenu(false);
      }
    };

    if (selectedMenu && isOpen) {
      fetchMenuDetails();
      return;
    }

    setFormData(menuMasterSchema.form.initialValues);
  }, [selectedMenu, isOpen, menuID]);

  // ======================================
  // HANDLE CHANGE
  // ======================================
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================
  // SAVE MENU
  // ======================================
  const handleSave = async () => {
    const result =
      menuMasterSchema.validationSchema.safeParse(formData);

    if (!result.success) {
      const newErrors = {};

      result.error.issues.forEach((item) => {
        newErrors[item.path[0]] = item.message;
      });

      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const saveUrl =
        mode === "create"
          ? menuMasterSchema.api.create
          : `${menuMasterSchema.api.edit}/${menuID}`;

      const method = mode === "create" ? "PUT" : "POST";

      const res = await makeRequest(saveUrl, {
        method,
        body: formData,
      });

      if (res.success) {
        toast.success(
          res?.message ||
            `Menu ${
              mode === "create" ? "created" : "updated"
            } successfully`
        );

        setFormData(menuMasterSchema.form.initialValues);
        onClose();
        onAfterSave?.();
        return;
      }

      toast.error(res?.message || "Something went wrong");
    } catch (error) {
      toast.error(error.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // CLOSE
  // ======================================
  const handleClose = () => {
    setFormData(menuMasterSchema.form.initialValues);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <FlyoutPanel
      isOpen={isOpen}
      onClose={handleClose}
      title={selectedMenu ? "Edit Menu" : "Create Menu"}
      closeButton={
        <button className="flyout-close" onClick={onClose}>
          <X size={18} />
        </button>
      }
      footer={
        <ActionButton
          disabled={loading}
          variant="flyoutPrimary"
          onClick={handleSave}
        >
          {loading || fetchingMenu ? <Spinner /> : null}
          Save
        </ActionButton>
      }
    >
      <div className="flyout-form-shell">
        <div className="ws-main-container">
          {fetchingMenu ? (
            <div className="p-5 text-center">
              <Spinner />
            </div>
          ) : (
            <DynamicModuleForm
              sections={menuMasterSchema.form.sections}
              values={formData}
              onChange={handleChange}
              errors={errors}
            />
          )}
        </div>
      </div>
    </FlyoutPanel>
  );
}

export default MenuForm;