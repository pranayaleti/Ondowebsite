import React, { useEffect, useRef, useState } from 'react';

const SelectField = ({ id, name, value, onChange, options, placeholder = 'Select', required = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const listRef = useRef(null);

  const handleSelect = (newValue) => {
    if (onChange) onChange({ target: { name, value: newValue } });
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!triggerRef.current) return;
      if (triggerRef.current.contains(e.target)) return;
      if (listRef.current && listRef.current.contains(e.target)) return;
      setIsOpen(false);
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const selectedOption = options.find(o => (o.value ?? o) === value);
  const label = selectedOption ? (selectedOption.label ?? selectedOption.value ?? selectedOption) : placeholder;

  return (
    <div className="relative">
      {/* Hidden native select to preserve form submission + required validation */}
      <select id={id} name={name} value={value} required={required} onChange={() => {}} className="hidden" readOnly>
        <option value="">{placeholder}</option>
        {options.map((opt) => {
          const val = opt.value ?? opt;
          const lab = opt.label ?? opt;
          return (
            <option key={val} value={val}>{lab}</option>
          );
        })}
      </select>

      <button
        type="button"
        ref={triggerRef}
        onClick={() => setIsOpen(o => !o)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base bg-white text-gray-900 flex items-center justify-between"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>{label}</span>
        <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg focus:outline-none text-base"
        >
          <li
            role="option"
            aria-selected={!value}
            className={`px-4 py-2 cursor-pointer hover:bg-orange-50 ${!value ? 'text-gray-700' : 'text-gray-500'}`}
            onClick={() => handleSelect('')}
          >
            {placeholder}
          </li>
          {options.map((opt) => {
            const val = opt.value ?? opt;
            const lab = opt.label ?? opt;
            const isActive = value === val;
            return (
              <li
                key={val}
                role="option"
                aria-selected={isActive}
                className={`px-4 py-2 cursor-pointer hover:bg-orange-50 ${isActive ? 'bg-orange-100 text-orange-700' : 'text-gray-900'}`}
                onClick={() => handleSelect(val)}
              >
                {lab}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SelectField;


