import React from 'react';

const Select = ({ label, value, onChange, options = [], className = '', ...rest }) => (
  <div className="flex flex-col gap-1 p-2">
    {label && <label className="text-xs text-gray-500">{label}</label>}
    <select
      value={value}
      onChange={onChange}
      className={`border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...rest}
    >
      {options.map((opt) => (
        <option key={opt.key} value={opt.key}>
          {opt.value}
        </option>
      ))}
    </select>
  </div>
);

export default Select;
