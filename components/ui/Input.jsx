import { forwardRef } from 'react';

export const Input = forwardRef(({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  error, 
  textarea = false,
  options = [],
  className = '',
  inputClassName = '',
  ...props 
}, ref) => {
  const baseClasses = `w-full bg-white/5 border ${error ? 'border-red-500' : 'border-[var(--color-navy-700)] focus:border-[var(--color-gold-500)]'} rounded-md px-4 py-3 text-[var(--color-charcoal)] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-500)] transition-colors`;
  const darkClasses = `w-full bg-[var(--color-navy-800)] border ${error ? 'border-red-500' : 'border-[var(--color-navy-700)] focus:border-[var(--color-gold-500)]'} rounded-md px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-500)] transition-colors`;

  // Determine styles based on context. For simplicity, we'll allow an `isDark` prop, but default to light theme styling for now unless specified.
  const inputClasses = `${props.isDark ? darkClasses : baseClasses.replace('text-[var(--color-charcoal)]', 'text-gray-900').replace('bg-white/5', 'bg-white')} ${inputClassName}`;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={name} className={`text-sm font-medium ${props.isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {textarea ? (
        <textarea
          ref={ref}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`${inputClasses} min-h-[120px] resize-y`}
          {...props}
        />
      ) : options.length > 0 ? (
        <select
          ref={ref}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`${inputClasses} appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23c5a24d%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:0.65em_auto]`}
          {...props}
        >
          <option value="" disabled>Select an option</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          ref={ref}
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={inputClasses}
          {...props}
        />
      )}
      
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
