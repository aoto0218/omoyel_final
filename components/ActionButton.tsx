import React from 'react';
import { ActionButtonProps } from '@/types/salon';

export const ActionButton: React.FC<ActionButtonProps> = ({
    children,
    onClick,
    variant = 'outline'
}) => {
    const baseClasses = "font-medium py-3 rounded-lg shadow-sm hover:shadow-md transition";
    const variantClasses = variant === 'outline'
        ? "bg-white text-indigo-400 border-2 border-indigo-400 hover:bg-indigo-50"
        : "bg-indigo-400 text-white hover:bg-indigo-500";

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${variantClasses}`}
        >
            {children}
        </button>
    );
};