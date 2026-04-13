import { useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const RichTextEditor = ({ name, label, value, onChange, type = 'text', placeholder, className = '', modules }) => {
  const quillRef = useRef(null);
  const handleEditorChange = (content) => {
    // 👇 simulate normal input event
    onChange({
      target: {
        name,
        value: content,
      },
    });
  };

  return (
    <div className="bg-white p-2" >
      <label className="text-xs text-gray-500">{label}</label>

      <ReactQuill
        ref={quillRef}
        name={name}
        theme="snow"
        value={value}
        onChange={handleEditorChange}
        className={`mt-2 ${className}`}
        modules={modules}
      />
    </div>
  );
};

export default RichTextEditor;