import { Salon } from "@/types/salon";
import Image from "next/image";
import { MapPin, Book, Star } from "lucide-react"; // Starをインポートに追加
import Link from "next/link";

type Props = {
    salons: Salon[];
};

// 星の評価を表示するコンポーネントの補助関数 (ここでは簡略化のため、評価値を引数に受け取り星を返す関数を想定)
const StarRating = ({ rating, reviewCount }: { rating: number, reviewCount: number }) => {
    const fullStars = Math.floor(rating); // 塗りつぶす星の数
    const hasHalfStar = rating % 1 !== 0; // 半星があるか
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // 空の星の数

    return (
        <div className="flex items-center space-x-2">
            <div className="flex">
                {/* 塗りつぶされた星 */}
                {[...Array(fullStars)].map((_, i) => (
                    <Star key={`full-${i}`} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                ))}
                {/* 半星 */}
                {hasHalfStar && (
                    <div className="relative w-4 h-4">
                        {/* 背景の空の星 */}
                        <Star className="w-4 h-4 text-gray-300 absolute top-0 left-0" />
                        {/* 上に重ねる半分の塗りつぶされた星 */}
                        <div className="overflow-hidden w-1/2 h-4 absolute top-0 left-0">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        </div>
                    </div>
                )}
                {/* 空の星 */}
                {[...Array(emptyStars)].map((_, i) => (
                    <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
                ))}
            </div>
            <span className="text-gray-700 font-medium text-sm">{rating.toFixed(1)}</span>
            <span className="text-gray-500 text-sm">({reviewCount})</span>
        </div>
    );
};


export default function SalonCard({ salons }: Props) {
    if (salons.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                    条件に合うサロンが見つかりませんでした
                </p>
            </div>
        );
    }

    // デモ用: articleの型にratingとreviewCountがない場合を考慮し、暫定的な値を使用
    // 実際のアプリケーションでは、Salon型を更新し、実際のデータを使用してください。
    const getRating = (article: any) => article.rating || 4.2;
    const getReviewCount = (article: any) => article.reviewCount || 98;


    return (
        <div className="space-y-4">
            {salons.map((article) => (
                <div key={article.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition relative cursor-pointer">
                    <Link href={`/salon/${article.id}`}>
                        <div className="relative w-full h-64">
                            <Image
                                src={article.images?.image1 ? article.images.image1 : '/fallback.png'}
                                alt={article.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                        <div className="p-5">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{article.name}</h3>

                            <div className="mb-3">
                                <StarRating rating={getRating(article)} reviewCount={getReviewCount(article)} />
                            </div>
                            
                            <div className="flex items-center text-gray-500 text-sm mb-3">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{article.location}</span>
                            </div>

                            {article.tags.length > 0 && (
                                <div className="flex items-center gap-2 mb-4">
                                    <Book className="w-4 h-4 text-gray-400" />
                                    <div className="flex gap-2 flex-wrap">
                                        {article.tags.map((tag, index) => (
                                            <span key={index} className="px-3 py-1 bg-white text-gray-700 text-sm rounded-full border border-gray-300">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    )
}