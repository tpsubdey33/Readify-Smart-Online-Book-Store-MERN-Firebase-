import React from 'react';

const InputField = ({ 
  label, 
  name, 
  type = "text", 
  placeholder, 
  register, 
  required = false, 
  error, 
  defaultValue,
  ...props 
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        {...register(name, { 
          required: required ? `${label} is required` : false,
          valueAsNumber: type === 'number'
        })}
        className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  )
}

export default InputField;