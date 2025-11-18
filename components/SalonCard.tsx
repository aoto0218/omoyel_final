// components/SalonCard.tsx

import React from 'react';
import { MapPin, Book, MessageCircle } from 'lucide-react';
import { Tag } from './Tag';
import { SalonImage } from './SalonImage';
import { SalonCardProps } from '@/types/salon';

export const SalonCard: React.FC<SalonCardProps> = ({
    salon,
    onVisit,
    onConsult
}) => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition relative">
            {/* Salon Image */}
            <SalonImage type={salon.imageType} alt={salon.name} />

            {/* Salon Info */}
            <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{salon.name}</h3>

                <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{salon.location}</span>
                </div>

                {salon.tags.length > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                        <Book className="w-4 h-4 text-gray-400" />
                        <div className="flex gap-2 flex-wrap">
                            {salon.tags.map((tag, index) => (
                                <Tag key={index}>{tag}</Tag>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    onClick={() => onVisit?.(salon.id)}
                    className="px-6 py-2 bg-white border-2 border-gray-800 text-gray-800 font-medium rounded-full hover:bg-gray-800 hover:text-white transition"
                >
                    見学
                </button>
            </div>

            {/* Featured Floating Button */}
            {salon.featured && (
                <button
                    onClick={() => onConsult?.(salon.id)}
                    className="absolute bottom-5 right-5 bg-indigo-400 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-500 transition flex items-center gap-2 text-sm"
                >
                    マッチするサロンを相談
                    <MessageCircle className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};