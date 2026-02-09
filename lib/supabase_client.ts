import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
};

const client = createClient();

export const getSalonData = async () => {
    const salondata = await client
        .from('salons')
        .select('*')
        .order('id', { ascending: true });

    const salonData = salondata.data?.map((salon) => {
        let parsedImages = { image1: '', image2: '' };

        if (salon.images) {
            parsedImages = JSON.parse(salon.images);
        }

        return {
            ...salon,
            images: {
                image1: parsedImages?.image1 || '',
                image2: parsedImages?.image2 || ''
            }
        };
    });

    return { salonData };
};

export const getCompanyData = async () => {
    const companyudata = await client
        .from('companies')
        .select('*')
        .order('id', { ascending: true });

    const companyData = companyudata.data?.map((company) => {
        return {
            ...company,
        }
    });

    return { companyData };
};

// 既存のimportとsupabaseクライアントの設定はそのまま

// レビューデータを含むサロンデータを取得する新関数
export async function getSalonDataWithRatings() {
    // サロンデータを取得
    const { data: salondata, error: salonError } = await client
        .from('salons')
        .select('*');

    const salonData = salondata?.map((salon) => {
        let parsedImages = { image1: '', image2: '' };

        if (salon.images) {
            parsedImages = JSON.parse(salon.images);
        }

        return {
            ...salon,
            images: {
                image1: parsedImages?.image1 || '',
                image2: parsedImages?.image2 || ''
            }
        };
    });

    if (salonError) {
        console.error('Error fetching salons:', salonError);
        return { salonData: null };
    }

    const { data: reviewData, error: reviewError } = await client
    .from('review')
    .select('*');

if (reviewError) {
    console.error('Error fetching reviews:', reviewError);
    // レビューがなくてもサロンデータは返す
    const salonsWithoutRatings = (salonData || []).map(salon => ({
        ...salon,
        averageRatings: {
            rating_1: null,
            rating_2: null,
            rating_3: null,
            rating_4: null,
            rating_5: null,
            overall: null,
            reviewCount: 0 // 件数を0に
        }
    }));
    return { salonData: salonsWithoutRatings };
}

// salon_idごとにレビューをグループ化
const reviewsBySalon = (reviewData || []).reduce((acc, review) => {
    if (!acc[review.salon_id]) {
        acc[review.salon_id] = [];
    }
    acc[review.salon_id].push(review);
    return acc;
}, {} as Record<string, any[]>);

// 各サロンに平均評価と件数を追加
const salonsWithRatings = (salonData || []).map(salon => {
    const salonReviews = reviewsBySalon[salon.id] || [];

    if (salonReviews.length === 0) {
        return {
            ...salon,
            averageRatings: {
                rating_1: null,
                rating_2: null,
                rating_3: null,
                rating_4: null,
                rating_5: null,
                overall: null,
                reviewCount: 0
            }
        };
    }

    // 各評価項目の平均を計算（DBのscore_1~score_5を使用）
    const averageRatings = {
        rating_1: calculateAverage(salonReviews, 'score_1'),
        rating_2: calculateAverage(salonReviews, 'score_2'),
        rating_3: calculateAverage(salonReviews, 'score_3'),
        rating_4: calculateAverage(salonReviews, 'score_4'),
        rating_5: calculateAverage(salonReviews, 'score_5'),
        overall: 0,
        reviewCount: salonReviews.length // 件数を追加
    };

    // 総合評価（5項目の平均）
    averageRatings.overall =
        (averageRatings.rating_1 +
            averageRatings.rating_2 +
            averageRatings.rating_3 +
            averageRatings.rating_4 +
            averageRatings.rating_5) / 5;

    return {
        ...salon,
        averageRatings
    };
});

return { salonData: salonsWithRatings };

// 平均値を計算するヘルパー関数
function calculateAverage(reviews: any[], field: string): number {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + (review[field] || 0), 0);
    return sum / reviews.length;
}
}