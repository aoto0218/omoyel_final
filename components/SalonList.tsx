'use client';

import React from 'react';
import { SalonCard } from './SalonCard';
import { Salon } from '@/types/salon';

interface SalonListProps {
    salons: Salon[];
    onVisit: (salonId: number) => void;
    onConsult: (salonId: number) => void;
}

export const SalonList: React.FC<SalonListProps> = ({
    salons,
    onVisit,
    onConsult
}) => {
    if (salons.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                    条件に合うサロンが見つかりませんでした
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {salons.map((salon) => (
                <SalonCard
                    key={salon.id}
                    salon={salon}
                    onVisit={onVisit}
                    onConsult={onConsult}
                />
            ))}
        </div>
    );
};