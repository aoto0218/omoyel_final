// components/Tag.tsx

import React from 'react';
import { TagProps } from '@/types/salon';

export const Tag: React.FC<TagProps> = ({ children }) => {
    return (
        <span className="px-3 py-1 bg-white text-gray-700 text-sm rounded-full border border-gray-300">
            {children}
        </span>
    );
};