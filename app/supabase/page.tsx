import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';

export default async function TestAllDataPage() {
    const supabase = await createClient();

    const { data } = await supabase
        .from('salons')
        .select('*')
        .order('id', { ascending: true });

    return (
        // 外側のコンテナ
        <div className="max-w-6xl mx-auto p-5 bg-gray-50">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">サロンデータ一覧 (テスト版)</h1>
            {data?.map((salon) => {
                let images = { image1: '', image2: '' };
                if (salon.images) {
                    // JSONパース処理
                    const parsedImages = typeof salon.images === 'string'
                        ? JSON.parse(salon.images)
                        : salon.images;
                    images = {
                        image1: parsedImages?.image1 || '',
                        image2: parsedImages?.image2 || ''
                    };
                }

                return (
                    // サロンごとのカードコンテナ
                    <div
                        key={salon.id}
                        className="border border-gray-200 rounded-lg p-5 mb-4 bg-white shadow-md hover:shadow-lg transition duration-300"
                    >
                        {/* サロン名と住所 */}
                        <h2 className="text-xl font-semibold mb-1 text-blue-700">{salon.name}</h2>
                        <p className="text-gray-600 mb-4">{salon.address}</p>

                        {/* 画像コンテナ */}
                        <div className="flex gap-4">
                            {/* 画像1のラッパー */}
                            <div className="flex-1 relative h-48 border border-gray-300 rounded-md overflow-hidden">
                                {images.image1 ? (
                                    <Image
                                        src={images.image1}
                                        alt={`${salon.name} - 画像1`}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div className="h-full flex items-center justify-center bg-gray-100 text-gray-500">
                                        画像なし
                                    </div>
                                )}
                            </div>

                            {/* 画像2のラッパー */}
                            <div className="flex-1 relative h-48 border border-gray-300 rounded-md overflow-hidden">
                                {images.image2 ? (
                                    <Image
                                        src={images.image2}
                                        alt={`${salon.name} - 画像2`}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div className="h-full flex items-center justify-center bg-gray-100 text-gray-500">
                                        画像なし
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}