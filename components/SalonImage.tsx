// components/SalonImage.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { SalonImageProps } from '@/types/salon';

export const SalonImage: React.FC<SalonImageProps> = ({ type, alt, src }) => {
    // 実際の画像URLがある場合はそれを使用
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

    // フォールバック用のSVG画像
    const canvasImageSvg = `data:image/svg+xml,%3Csvg width='600' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='600' height='400' fill='%23f5e6d3'/%3E%3Crect x='50' y='50' width='150' height='100' fill='%23d4a574' rx='8'/%3E%3Crect x='220' y='50' width='150' height='100' fill='%23c9985e' rx='8'/%3E%3Crect x='390' y='50' width='150' height='100' fill='%23d4a574' rx='8'/%3E%3Crect x='50' y='170' width='150' height='100' fill='%23c9985e' rx='8'/%3E%3Crect x='220' y='170' width='150' height='100' fill='%23d4a574' rx='8'/%3E%3Crect x='390' y='170' width='150' height='100' fill='%23c9985e' rx='8'/%3E%3Ccircle cx='100' cy='320' r='30' fill='%23b88a52'/%3E%3Ccircle cx='250' cy='320' r='30' fill='%23b88a52'/%3E%3Ccircle cx='400' cy='320' r='30' fill='%23b88a52'/%3E%3C/svg%3E`;

    const shellImageSvg = `data:image/svg+xml,%3Csvg width='600' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23374151;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%231f2937;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='400' fill='url(%23grad)'/%3E%3Crect x='30' y='30' width='80' height='80' fill='%23065f46' rx='8'/%3E%3Crect x='450' y='280' width='130' height='100' fill='%23fef3c7' rx='8'/%3E%3Ctext x='300' y='220' font-family='Georgia, serif' font-size='72' fill='%23fef3c7' text-anchor='middle' font-style='italic'%3Eshell%3C/text%3E%3C/svg%3E`;

    const imageSrc = type === 'canvas' ? canvasImageSvg : shellImageSvg;

    return (
        <div className="relative w-full h-64">
            <Image
                src={imageSrc}
                alt={alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized // SVG data URLの場合は最適化をスキップ
            />
        </div>
    );
};