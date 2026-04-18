import Input from "../form-inputs/Input";
import Radio from "../form-inputs/Radio";
import Select from "../form-inputs/Select";
import TextArea from "../form-inputs/TextArea";
import RichTextEditor from "../form-inputs/RichTextEditor";
import SmartSelect from "../form-inputs/smartSelect";

const SECTION_COLUMN_CLASS = {
  1: "grid grid-cols-1 gap-4",
  2: "grid grid-cols-1 gap-4 md:grid-cols-2",
  3: "grid grid-cols-1 gap-4 md:grid-cols-3",
  4: "grid grid-cols-1 gap-4 md:grid-cols-4",
};

function DynamicModuleForm({ sections = [], values = {}, onChange, errors= {} }) {
  const renderField = (field) => {
    const value = values[field.name] ?? "";
    switch (field.type) {
      case "radio":
        return <Radio field={field} value={value} onChange={onChange} error={errors[field.name]} />
        break;
      case "select":
        return <Select field={field} onChange={onChange} value={value} error={errors[field.name]} />
        break;
      case "textarea":
        return <TextArea field={field} onChange={onChange} value={value} error={errors[field.name]} />;
        break;
      case "editor":
        return <RichTextEditor field={field} onChange={onChange} value={value} error={errors[field.name]} />;
        break;
      case "smartSelect":
        return <SmartSelect field={field} value={value} onSelect={onChange} config={field.config} error={errors[field.name]} />
        break;
      default:
        return <Input field={field} onChange={onChange} value={value} error={errors[field.name]} />
        break;
    }
  };

  return (
    <div className="space-y-5">
      {sections.map((section, sectionIndex) => (
        <div key={`section-${sectionIndex}`} className={`mb-1 ${SECTION_COLUMN_CLASS[section.columns] || SECTION_COLUMN_CLASS[2]}`}>
          {section.fields.map((field) => (
            <div key={field.name} className={`w-full ${field.columns === 2 ? "md:col-span-2" : ""}`}>
              {renderField(field)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default DynamicModuleForm;
