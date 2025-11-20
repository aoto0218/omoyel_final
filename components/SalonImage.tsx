'use client';

import React from 'react';
import Image from 'next/image';
import { SalonImageProps } from '@/types/salon';

export const SalonImage: React.FC<SalonImageProps> = ({ type, alt, src }) => {
    if (src) {
        return (
            <div className="relative w-full h-64">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
        );
    }

    return (
        <div className="relative w-full h-64">
            <Image
                src="./fallback.png"
                alt={alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized // SVG data URLの場合は最適化をスキップ
            />
        </div>
    );
};