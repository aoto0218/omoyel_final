import React from 'react';
import { ChevronDown } from 'lucide-react';
import { DropdownProps } from '@/types/salon';

export const Dropdown: React.FC<DropdownProps> = ({
    label,
    options,
    selected,
    onToggle,
    isOpen,
    onOpenChange
}) => {
    return (
        <div className="relative">
            <button
                onClick={() => onOpenChange(!isOpen)}
                className="w-full bg-white rounded-lg px-4 py-3 text-left flex items-center justify-between shadow-sm hover:shadow-md transition border border-gray-200"
            >
                <span className="text-gray-700 font-medium">{label}</span>
                <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg max-h-64 overflow-y-auto border border-gray-200">
                    {options.map((option) => (
                        <label
                            key={option}
                            className="flex items-center px-4 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                            <input
                                type="checkbox"
                                checked={selected.includes(option)}
                                onChange={() => onToggle(option)}
                                className="w-4 h-4 text-indigo-400 rounded border-gray-300 focus:ring-indigo-400"
                            />
                            <span className="ml-3 text-gray-700 text-sm">{option}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};