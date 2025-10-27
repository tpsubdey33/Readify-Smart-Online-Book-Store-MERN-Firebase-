import React from 'react';

const SelectField = ({ 
  label, 
  name, 
  options, 
  register, 
  required = false, 
  error,
  defaultValue 
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <select
        {...register(name, { required: required ? `${label} is required` : false })}
        defaultValue={defaultValue}
        className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  )
}

export default SelectField;