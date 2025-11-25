import { Salon } from '@/types/salon';

interface SalonInfoProps {
    salon: Salon;
}

export default function SalonInfo({ salon }: SalonInfoProps) {
    return (
        <div className="space-y-4">
            {salon.staff_gender_ratio && (
                <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">スタッフの男女比率</h3>
                    <p className="text-gray-700 text-sm">{salon.staff_gender_ratio}</p>
                </div>
            )}

            {salon.staff_age_group && (
                <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">スタッフの多い年齢層</h3>
                    <p className="text-gray-700 text-sm">{salon.staff_age_group}</p>
                </div>
            )}

            {salon.atmosphere && (
                <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">職場の雰囲気</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{salon.atmosphere}</p>
                </div>
            )}

            {salon.customer_gender_ratio && (
                <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">お客様の男女比率</h3>
                    <p className="text-gray-700 text-sm">{salon.customer_gender_ratio}</p>
                </div>
            )}

            {salon.customer_age_group && (
                <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">お客様の一番多い年齢層</h3>
                    <p className="text-gray-700 text-sm">{salon.customer_age_group}</p>
                </div>
            )}

            {salon.international_customer_frequency && (
                <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">海外顧客の来店頻度</h3>
                    <p className="text-gray-700 text-sm">{salon.international_customer_frequency}</p>
                </div>
            )}
        </div>
    );
}