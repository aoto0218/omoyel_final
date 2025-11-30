import { Salon } from '@/types/salon';

interface SalonInfoProps {
    salon: Salon;
}

export default function SalonInfo({ salon }: SalonInfoProps) {
    return (
        <div className="space-y-6">
            {/* スタッフ情報 */}
            {(salon.staff_gender_ratio || salon.staff_age_group || salon.atmosphere) && (
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                        スタッフ情報
                    </h3>
                    <div className="space-y-3">
                        {salon.staff_gender_ratio && (
                            <div className="flex gap-3">
                                <span className="text-sm text-gray-500 min-w-[120px]">男女比率</span>
                                <span className="text-sm text-gray-900">{salon.staff_gender_ratio}</span>
                            </div>
                        )}
                        
                        {salon.staff_age_group && (
                            <div className="flex gap-3">
                                <span className="text-sm text-gray-500 min-w-[120px]">年齢層</span>
                                <span className="text-sm text-gray-900">{salon.staff_age_group}</span>
                            </div>
                        )}
                        
                        {salon.atmosphere && (
                            <div className="flex gap-3">
                                <span className="text-sm text-gray-500 min-w-[120px]">職場の雰囲気</span>
                                <span className="text-sm text-gray-900 flex-1">{salon.atmosphere}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* お客様情報 */}
            {(salon.customer_gender_ratio || salon.customer_age_group || salon.international_customer_frequency) && (
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                        お客様情報
                    </h3>
                    <div className="space-y-3">
                        {salon.customer_gender_ratio && (
                            <div className="flex gap-3">
                                <span className="text-sm text-gray-500 min-w-[120px]">男女比率</span>
                                <span className="text-sm text-gray-900">{salon.customer_gender_ratio}</span>
                            </div>
                        )}
                        
                        {salon.customer_age_group && (
                            <div className="flex gap-3">
                                <span className="text-sm text-gray-500 min-w-[120px]">年齢層</span>
                                <span className="text-sm text-gray-900">{salon.customer_age_group}</span>
                            </div>
                        )}
                        
                        {salon.international_customer_frequency && (
                            <div className="flex gap-3">
                                <span className="text-sm text-gray-500 min-w-[120px]">海外顧客</span>
                                <span className="text-sm text-gray-900">{salon.international_customer_frequency}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}