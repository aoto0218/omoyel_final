import Image from 'next/image';
import { Salon } from '@/types/salon';
import SalonMap from '../mapcomponents/submap';
import Link from 'next/link';

interface SalonBasicInfoProps {
    salon: Salon;
}

export default function SalonBasicInfo({ salon }: SalonBasicInfoProps) {
    return (
        <div className="space-y-6">
            {/* Salon Images */}
            {(salon.images?.image1 || salon.images?.image2) && (
                <div className="grid grid-cols-2 gap-4">
                    {salon.images?.image1 && (
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200">
                            <Image
                                alt='サロン内観1'
                                src={salon.images.image1}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}
                    {salon.images?.image2 && (
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200">
                            <Image
                                alt='サロン内観2'
                                src={salon.images.image2}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* 得意メニュー */}
            {salon.tags && salon.tags.length > 0 && (
                <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3">得意メニュー</h3>
                    <div className="flex gap-2 flex-wrap">
                        {salon.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-md border border-gray-300"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Visit Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                    見学情報
                </h3>
                <div className="space-y-3">
                    {salon.visit_schedule && (
                        <div className="flex gap-3">
                            <span className="text-sm text-gray-500 min-w-[80px]">見学日程</span>
                            <span className="text-sm text-gray-900">{salon.visit_schedule}</span>
                        </div>
                    )}

                    {salon.duration && (
                        <div className="flex gap-3">
                            <span className="text-sm text-gray-500 min-w-[80px]">所要時間</span>
                            <span className="text-sm text-gray-900">{salon.duration}</span>
                        </div>
                    )}

                    {salon.meeting_place && (
                        <div className="flex gap-3">
                            <span className="text-sm text-gray-500 min-w-[80px]">集合場所</span>
                            <a
                                href={salon.meeting_place.startsWith('http') ? salon.meeting_place : '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-700 hover:underline break-all"
                            >
                                {salon.meeting_place}
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Flow */}
            {salon.flow && (
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-3">当日の流れ</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{salon.flow}</p>
                </div>
            )}

            {/* Location & Map */}
            {(salon.address || (salon.lat && salon.lon)) && (
                <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3">アクセス</h3>

                    {salon.address && (
                        <p className="text-sm text-gray-700 mb-3">{salon.address}</p>
                    )}

                    {salon.lat && salon.lon && (
                        <div className="space-y-3">
                            <div className="rounded-lg overflow-hidden border border-gray-200">
                                <SalonMap salon={salon} />
                            </div>
                            <Link
                                href={`https://www.google.co.jp/maps/dir/現在地/${salon.address}`}
                                target="_blank"
                                className="inline-block bg-gray-900 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition"
                            >
                                経路を検索する
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* Additional Information */}
            <div className="space-y-3 pt-3 border-t border-gray-200">
                {salon.name_kana && (
                    <div className="flex gap-3">
                        <span className="text-sm text-gray-500 min-w-[120px]">店舗名</span>
                        <span className="text-sm text-gray-900">{salon.name_kana}</span>
                    </div>
                )}

                {salon.guideStaff && (
                    <div className="flex gap-3">
                        <span className="text-sm text-gray-500 min-w-[120px]">案内スタッフ</span>
                        <span className="text-sm text-gray-900">{salon.guideStaff}</span>
                    </div>
                )}

                {salon.contact && (
                    <div className="flex gap-3">
                        <span className="text-sm text-gray-500 min-w-[120px]">担当者</span>
                        <span className="text-sm text-gray-900">{salon.contact}</span>
                    </div>
                )}

                {salon.instagram && (
                    <div className="flex gap-3">
                        <span className="text-sm text-gray-500 min-w-[120px]">Instagram</span>
                        <Link
                            href={salon.instagram.startsWith('http') ? salon.instagram : `https://instagram.com/${salon.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 hover:underline break-all"
                        >
                            {salon.instagram}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}