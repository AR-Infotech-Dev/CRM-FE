import React from 'react';

const Input = ({ label,required, value, onChange, type = 'text', placeholder, className = '', ...rest }) => (
  <div className="flex flex-col gap-1 p-1">
    {label && <label className="text-xs text-gray-500">{label} {required && <span className='text-red-500'>*</span> }</label>}
    <input
      type={type}
      value={value ?? ""}   // ✅ FIX HERE
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`border border-gray-50 text-gray-600 bg-gray-100 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 ${className}`}
      {...rest}
    />
  </div>
);

export default Input;
