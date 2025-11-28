"use client";

import { Salon } from "@/types/salon";
import Image from "next/image";
import { MapPin, Book, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export type Review = {
    id: number;
    salon_id: number;
    score_1: number;
    score_2: number;
    score_3: number;
    score_4: number;
    score_5: number;
    comments: string;
    created_at: string;
};

type Props = {
    salons: Salon[];
};

/* ---------------------------------------------------
   ⭐ 星の表示コンポーネント
--------------------------------------------------- */
const StarRating = ({
    rating,
    reviewCount,
}: {
    rating: number;
    reviewCount: number;
}) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center space-x-2">
            <div className="flex">
                {[...Array(fullStars)].map((_, i) => (
                    <Star
                        key={`full-${i}`}
                        className="w-4 h-4 text-yellow-500 fill-yellow-500"
                    />
                ))}

                {hasHalfStar && (
                    <div className="relative w-4 h-4">
                        <Star className="w-4 h-4 text-gray-300 absolute top-0 left-0" />
                        <div className="overflow-hidden w-1/2 h-4 absolute top-0 left-0">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        </div>
                    </div>
                )}

                {[...Array(emptyStars)].map((_, i) => (
                    <Star
                        key={`empty-${i}`}
                        className="w-4 h-4 text-gray-300"
                    />
                ))}
            </div>

            <span className="text-gray-700 font-medium text-sm">
                {rating.toFixed(1)}
            </span>
            <span className="text-gray-500 text-sm">({reviewCount})</span>
        </div>
    );
};

/* ---------------------------------------------------
   📌 サロンカード（一覧画面）
   → サロンIDごとにレビュー平均を計算して渡す
--------------------------------------------------- */
export default function SalonCard({ salons }: Props) {
    const [reviewData, setReviewData] = useState<
        Record<number, { rating: number; count: number }>
    >({});

    // ⭐ 全レビューを取得して、サロンIDごとに平均を計算
    useEffect(() => {
        fetch("/api/getReviews")
            .then(async (res) => {
                const data = await res.json();
                const reviews: Review[] = data.reviews ?? [];

                // サロンごとに集計
                const grouped = reviews.reduce((acc, r) => {
                    const total =
                        r.score_1 +
                        r.score_2 +
                        r.score_3 +
                        r.score_4 +
                        r.score_5;

                    const stars = Math.round((total / 25) * 5);

                    if (!acc[r.salon_id]) {
                        acc[r.salon_id] = { sum: 0, count: 0 };
                    }

                    acc[r.salon_id].sum += stars;
                    acc[r.salon_id].count += 1;

                    return acc;
                }, {} as Record<number, { sum: number; count: number }>);

                // 平均を計算
                const mapped = Object.fromEntries(
                    Object.entries(grouped).map(([sid, v]) => [
                        Number(sid),
                        { rating: v.sum / v.count, count: v.count },
                    ])
                );

                setReviewData(mapped);
            })
            .catch((err) => console.error(err));
    }, []);

    const getRating = (salon: Salon) =>
        reviewData[salon.id]?.rating || 0;

    const getReviewCount = (salon: Salon) =>
        reviewData[salon.id]?.count || 0;

    /* --------------------------------------------------- */

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
        <div className="space-y-4">
            {salons.map((salon) => (
                <div
                    key={salon.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition relative cursor-pointer"
                >
                    <Link href={`/salon/${salon.id}`}>
                        <div className="relative w-full h-64">
                            <Image
                                src={
                                    salon.images?.image1 ||
                                    "/fallback.png"
                                }
                                alt={salon.name}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="p-5">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                {salon.name}
                            </h3>

                            {/* ⭐ 平均星評価をここに表示 */}
                            <StarRating
                                rating={getRating(salon)}
                                reviewCount={getReviewCount(salon)}
                            />

                            <div className="flex items-center text-gray-500 text-sm mt-3">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{salon.location}</span>
                            </div>

                            {salon.tags?.length > 0 && (
                                <div className="flex items-center gap-2 mt-4">
                                    <Book className="w-4 h-4 text-gray-400" />
                                    <div className="flex gap-2 flex-wrap">
                                        {salon.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 bg-white text-gray-700 text-sm rounded-full border border-gray-300"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}
