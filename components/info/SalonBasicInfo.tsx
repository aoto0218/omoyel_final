import Image from 'next/image';
import { Salon } from '@/types/salon';

interface SalonBasicInfoProps {
    salon: Salon;
}

export default function SalonBasicInfo({ salon }: SalonBasicInfoProps) {
    return (
        <div className="space-y-6">
            {/* Salon Images */}
            {(salon.images?.image1 || salon.images?.image2) && (
                <div className="grid grid-cols-2 gap-3">
                    {salon.images?.image1 && (
                        <div className="rounded-xl overflow-hidden">
                            <Image
                                alt='画像1'
                                src={salon.images.image1}
                                width={500}
                                height={500}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    {salon.images?.image2 && (
                        <div className="rounded-xl overflow-hidden">
                            <Image
                                alt='画像2'
                                src={salon.images.image2}
                                width={500}
                                height={500}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Address */}
            {salon.address && (
                <p className="text-gray-700 leading-relaxed text-sm">
                    {salon.address}
                </p>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
                {salon.name_kana && (
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1">サロン見学店舗名</h3>
                        <p className="text-gray-700 text-sm">{salon.name_kana}</p>
                    </div>
                )}

                {salon.visit_schedule && (
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1">見学日程</h3>
                        <p className="text-gray-700 text-sm">{salon.visit_schedule}</p>
                    </div>
                )}

                {salon.duration && (
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1">所要時間</h3>
                        <p className="text-gray-700 text-sm">{salon.duration}</p>
                    </div>
                )}

                {salon.flow && (
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1">当日の流れ</h3>
                        <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{salon.flow}</p>
                    </div>
                )}

                {salon.guideStaff && (
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1">案内スタッフ</h3>
                        <p className="text-gray-700 text-sm">{salon.guideStaff}</p>
                    </div>
                )}

                {salon.contact && (
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1">担当者</h3>
                        <p className="text-gray-700 text-sm">{salon.contact}</p>
                    </div>
                )}

                {salon.instagram && (
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1">Instagram</h3>
                        <a
                            href={salon.instagram.startsWith('http') ? salon.instagram : `https://instagram.com/${salon.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-700 transition text-sm break-all underline"
                        >
                            {salon.instagram}
                        </a>
                    </div>
                )}

                {salon.meeting_place && (
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1">集合場所</h3>
                        <a
                            href={salon.meeting_place.startsWith('http') ? salon.meeting_place : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-700 transition text-sm break-all underline"
                        >
                            {salon.meeting_place}
                        </a>
                    </div>
                )}
            </div>

            {/* 得意メニュー */}
            {salon.tags && salon.tags.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">得意メニュー</h3>
                    <div className="flex gap-2 flex-wrap">
                        {salon.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-gray-100 text-gray-800 text-sm rounded-md border border-gray-200"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}