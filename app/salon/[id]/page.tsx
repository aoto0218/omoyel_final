// app/salon/[id]/page.tsx
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { SalonImage } from '@/components/SalonImage';
import { MOCK_SALONS } from '@/constants/salondata';

export default function SalonDetailPage() {
    const params = useParams();
    const router = useRouter();
    const salonId = Number(params.id);

    const salon = MOCK_SALONS.find(s => s.id === salonId);

    if (!salon) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">サロンが見つかりません</h1>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-indigo-400 text-white rounded-full hover:bg-indigo-500 transition"
                    >
                        トップページに戻る
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header - Back Button */}
            <div className="px-4 py-4">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1 text-indigo-500 hover:text-indigo-600 transition text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    ホームに戻る
                </button>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-4 pb-24">
                {/* Salon Name */}
                <h1 className="text-2xl font-bold text-gray-900 mb-6 leading-tight">
                    {salon.name}
                </h1>

                {/* Images Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {salon.images?.image1 && (
                        <div className="rounded-xl overflow-hidden">
                            <SalonImage
                                type={salon.imageType}
                                alt={`${salon.name} - 画像1`}
                                src={salon.images.image1}
                            />
                        </div>
                    )}
                    {salon.images?.image2 && (
                        <div className="rounded-xl overflow-hidden">
                            <SalonImage
                                type={salon.imageType}
                                alt={`${salon.name} - 画像2`}
                                src={salon.images.image2}
                            />
                        </div>
                    )}
                </div>

                {/* Address */}
                {salon.address && (
                    <p className="text-gray-700 mb-8 leading-relaxed text-sm">
                        {salon.address}
                    </p>
                )}

                {/* Information Sections */}
                <div className="space-y-6">
                    {/* サロン見学店舗名 */}
                    {salon.nameKana && (
                        <div>
                            <h2 className="text-sm font-bold text-gray-900 mb-1">サロン見学店舗名：</h2>
                            <p className="text-gray-800 text-sm">{salon.nameKana}</p>
                        </div>
                    )}

                    {/* 見学日程 */}
                    {salon.visitSchedule && (
                        <div>
                            <h2 className="text-sm font-bold text-gray-900 mb-1">見学日程：</h2>
                            <p className="text-gray-800 text-sm">{salon.visitSchedule}</p>
                        </div>
                    )}

                    {/* 所要時間 */}
                    {salon.duration && (
                        <div>
                            <h2 className="text-sm font-bold text-gray-900 mb-1">所要時間：</h2>
                            <p className="text-gray-800 text-sm">{salon.duration}</p>
                        </div>
                    )}

                    {/* 当日の流れ */}
                    {salon.flow && (
                        <div>
                            <h2 className="text-sm font-bold text-gray-900 mb-1">当日の流れ：</h2>
                            <p className="text-gray-800 text-sm whitespace-pre-line leading-relaxed">{salon.flow}</p>
                        </div>
                    )}

                    {/* 案内スタッフ */}
                    {salon.guideStaff && (
                        <div>
                            <h2 className="text-sm font-bold text-gray-900 mb-1">案内スタッフ：</h2>
                            <p className="text-gray-800 text-sm">{salon.guideStaff}</p>
                        </div>
                    )}

                    {/* 担当者 */}
                    {salon.contact && (
                        <div>
                            <h2 className="text-sm font-bold text-gray-900 mb-1">担当者：</h2>
                            <p className="text-gray-800 text-sm">{salon.contact}</p>
                        </div>
                    )}

                    {/* Instagram */}
                    {salon.instagram && (
                        <div>
                            <h2 className="text-sm font-bold text-gray-900 mb-1">Instagram：</h2>
                            <a
                                href={salon.instagram.startsWith('http') ? salon.instagram : `https://instagram.com/${salon.instagram.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-800 hover:text-indigo-600 transition text-sm break-all"
                            >
                                {salon.instagram}
                            </a>
                        </div>
                    )}

                    {/* 集合場所 */}
                    {salon.meetingPlace && (
                        <div>
                            <h2 className="text-sm font-bold text-gray-900 mb-1">集合場所：</h2>
                            <a
                                href={salon.meetingPlace.startsWith('http') ? salon.meetingPlace : '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-800 hover:text-indigo-600 transition text-sm break-all"
                            >
                                {salon.meetingPlace}
                            </a>
                        </div>
                    )}
                </div>

                {/* 得意メニュー Section */}
                {salon.tags.length > 0 && (
                    <div className="mt-12 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">得意メニュー</h2>
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

                {/* サロン情報 Section */}
                <div className="mt-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">サロン情報</h2>

                    <div className="space-y-6">
                        {/* スタッフの男女比率 */}
                        {salon.staffGenderRatio && (
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-1">スタッフの男女比率：</h3>
                                <p className="text-gray-800 text-sm">{salon.staffGenderRatio}</p>
                            </div>
                        )}

                        {/* スタッフの多い年齢層 */}
                        {salon.staffAgeGroup && (
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-1">スタッフの多い年齢層：</h3>
                                <p className="text-gray-800 text-sm">{salon.staffAgeGroup}</p>
                            </div>
                        )}

                        {/* 職場の雰囲気 */}
                        {salon.atmosphere && (
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-1">職場の雰囲気：</h3>
                                <p className="text-gray-800 text-sm leading-relaxed">{salon.atmosphere}</p>
                            </div>
                        )}

                        {/* お客様の男女比率 */}
                        {salon.customerGenderRatio && (
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-1">お客様の男女比率：</h3>
                                <p className="text-gray-800 text-sm">{salon.customerGenderRatio}</p>
                            </div>
                        )}

                        {/* お客様の一番多い年齢層 */}
                        {salon.customerAgeGroup && (
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-1">お客様の一番多い年齢層：</h3>
                                <p className="text-gray-800 text-sm">{salon.customerAgeGroup}</p>
                            </div>
                        )}

                        {/* 海外顧客の来店頻度 */}
                        {salon.internationalCustomerFrequency && (
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-1">海外顧客の来店頻度：</h3>
                                <p className="text-gray-800 text-sm">{salon.internationalCustomerFrequency}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
                <div className="max-w-3xl mx-auto">
                    <button className="w-full px-8 py-4 bg-indigo-400 text-white font-medium rounded-full hover:bg-indigo-500 transition shadow-lg">
                        サロン見学に申し込む
                    </button>
                </div>
            </div>
        </div>
    );
}