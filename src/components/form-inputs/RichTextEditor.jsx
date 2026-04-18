import { useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DefaultLabel from "./DefaultLabel";
import ValidationError from "./ValidationError";

const RichTextEditor = ({ field, value, onChange, className = '', modules, error }) => {
  const quillRef = useRef(null);
  const handleEditorChange = (content) => {
    // 👇 simulate normal input event
    onChange({
      target: {
        name: field.name,
        value: content,
      },
    });
  };

  return (
    <div className="bg-white p-2" >
      <DefaultLabel label={field.label} required={field.required} />
      <ReactQuill
        ref={quillRef}
        name={field.name}
        theme="snow"
        value={value}
        onChange={handleEditorChange}
        className={`mt-2 ${className}`}
        modules={modules}
      />
      {error && (
        <ValidationError error={error} />
      )}
    </div>
  );
};

export default RichTextEditor;