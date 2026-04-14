import { X } from "lucide-react";
import FlyoutPanel from '../../../components/ui/FlyoutPanel'
import ActionButton from "../../../components/ui/ActionButton";
import FormField from "../../../components/ui/FormField";
import DynamicFormLayout from "../../../components/ui/DynamicFormLayout";
import Input from "../../../components/form-inputs/Input";
import Checkbox from "../../../components/form-inputs/Checkbox";
import RadioGroup from "../../../components/form-inputs/RadioGroup";
import RichTextEditor from "../../../components/form-inputs/RichTextEditor";
import { useState, useEffect } from "react";
import { defualtFormData } from "../data/scheama";
import { makeRequest } from "../../../api/httpClient";
import { toast } from 'react-toastify';
import Spinner from "../../../components/ui/Spinner";


const layout = [
    {
        label: "Basic Info",
        row: [
            [
                { field: "menuName", type: 'text', lable: 'Menu Name', required: true, colSpan: 1 },
                { field: "menuLink", type: 'text', lable: 'Menu Link', required: true, colSpan: 1 },
                { field: "module_name", type: 'text', lable: 'Module Name', required: true, colSpan: 1 },
            ],
            [
                { field: "module_desc", type: 'text', lable: 'Module Description', required: true, colSpan: 2 },
                { field: "table_name", type: 'text', lable: 'Table Name', required: true, colSpan: 1 },
            ],
        ],
    },
    {
        label: "Settings",
        row: [
            [
                { field: "status", type: 'select', lable: 'Status', required: true, colSpan: 1 },
                { field: "mobile_screen", type: 'select', lable: 'Mobile Screen', required: true, colSpan: 1 },
            ],
        ],
    }
];

const handleSaveAndNew = () => { }

function MenuForm({ isOpen, onClose, title, selectedMenu, getMenuList }) {
    if (!isOpen) return null;
    const menuID = selectedMenu?._id;
    const mode = selectedMenu ? 'edit' : 'create';
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(defualtFormData || {});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSave = async (event) => {
        setLoading(true);
        const url = (mode === 'create') ? `/menus/${mode}` : `/menus/${mode}/${menuID}`;
        const res = await makeRequest(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: formData
        });
        console.log('res : ', res);

        setLoading(false);
        if (res.success) {
            toast.success(res?.message);
            setFormData(defualtFormData);
            onClose();

            getMenuList();
        } else {
            toast.error(res?.msg || "Error while creating Menu");
        }
    }
    useEffect(() => {
        if (mode === "edit" && selectedMenu) {
            setFormData(selectedMenu);
        } else {
            setFormData(defualtFormData);
        }
    }, [selectedMenu, mode]);

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
                    <ActionButton className={`${loading && 'bg-purple-200 cursor-not-allowed'}`} disabled={loading} variant="flyoutPrimary" onClick={handleSave}>
                        {loading && <Spinner/> } Save
                    </ActionButton>
                </>
            }
        >
            <div className="flyout-form-shell">
                <div className="ws-main-container">
                    {/* <div className="grid grid-cols-3 gap-4">
                        <RadioGroup required={true} label={'Do You Want To Create Parent Menu?'} name={'is_parent'} onChange={handleChange} value={formData?.is_parent} options={
                            [
                                { 'label': 'Yes', 'value': 'y' },
                                { 'label': 'No', 'value': 'n' }
                            ]
                        } />
                        <RadioGroup required={true} label={'Do You Want To Give Access On Mobile?'} name={'mobile_screen'} onChange={handleChange} value={formData?.mobile_screen} options={
                            [
                                { 'label': 'Yes', 'value': 'y' },
                                { 'label': 'No', 'value': 'n' }
                            ]
                        } />
                        <RadioGroup required={true} label={'Do You Want To Link Exiting Module?'} name={'linked'} onChange={handleChange} value={formData?.linked} options={
                            [
                                { 'label': 'Yes', 'value': 'y' },
                                { 'label': 'No', 'value': 'n' }
                            ]
                        } />
                    </div> */}
                    <div className="grid grid-cols-3 gap-4">
                        <Input required={true} label={'Menu Name'} name={'menu_name'} onChange={handleChange} value={formData?.menu_name} placeholder={'Menu Name'} />
                        <Input required={true} label={'Module Name'} name={'module_name'} onChange={handleChange} value={formData?.module_name} placeholder={'Module Name'} />
                        <Input required={true} label={'Menu Link'} name={'menu_link'} onChange={handleChange} value={formData?.menu_link} placeholder={'Menu Link'} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <Input required={true} label={'Label'} name={'label'} value={formData?.label} onChange={handleChange} placeholder={'Lable'} />
                        <Input required={false} label={'Plural Label'} name={'plural_lable'} value={formData?.plural_label} onChange={handleChange} placeholder={'Plural Lable'} />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <RichTextEditor required={true} name={'module_description'} onChange={handleChange} value={formData?.module_description} label={'Module Description'} />
                    </div>
                </div>
            </div>
        </FlyoutPanel>
    )
}

export default MenuForm