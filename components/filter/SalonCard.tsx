import { Salon } from "@/types/salon";
import Image from "next/image";
import { MapPin, Book } from "lucide-react";
import Link from "next/link";

type Props = {
    salons: Salon[];
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