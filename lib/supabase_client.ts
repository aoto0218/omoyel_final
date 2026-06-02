import { Salon } from '@/types/salon';

// クライアント側でのCookieヘルパー
const getCookie = (name: string) => {
    if (typeof window === 'undefined') return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
};

const setCookie = (name: string, value: string, days = 7) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

class MockQueryBuilder {
    private queryState: any;

    constructor(table: string) {
        this.queryState = {
            table,
            action: 'select',
            filters: []
        };
    }

    select(columns: string = '*') {
        this.queryState.action = 'select';
        this.queryState.columns = columns;
        return this;
    }

    insert(values: any[]) {
        this.queryState.action = 'insert';
        this.queryState.values = values;
        return this;
    }

    update(values: any) {
        this.queryState.action = 'update';
        this.queryState.values = values;
        return this;
    }

    delete() {
        this.queryState.action = 'delete';
        return this;
    }

    eq(column: string, value: any) {
        this.queryState.filters.push({ type: 'eq', column, value });
        return this;
    }

    in(column: string, values: any[]) {
        this.queryState.filters.push({ type: 'in', column, values });
        return this;
    }

    single() {
        this.queryState.single = true;
        return this;
    }

    order(column: string, options?: { ascending?: boolean }) {
        this.queryState.order = { column, options };
        return this;
    }

    async then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
        try {
            const res = await fetch('/api/mock-db', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.queryState)
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            if (onfulfilled) return onfulfilled(data);
            return data;
        } catch (err) {
            if (onrejected) return onrejected(err);
            throw err;
        }
    }
}

export const createClient = () => {
    return {
        auth: {
            getUser: async () => {
                const userId = getCookie('mock_user_id');
                if (userId) {
                    return {
                        data: {
                            user: {
                                id: userId,
                                email: "test@example.com",
                                user_metadata: { name: "テストユーザー" }
                            }
                        },
                        error: null as any
                    };
                }
                return { data: { user: null }, error: null as any };
            },
            signInWithPassword: async ({ email, password }: any) => {
                // プロトタイプ用に任意のログイン情報を許可
                setCookie('mock_user_id', 'mock-user-123');
                return {
                    data: {
                        user: {
                            id: 'mock-user-123',
                            email: email || 'test@example.com'
                        }
                    },
                    error: null as any
                };
            },
            signUp: async ({ email, password, options }: any) => {
                // 新規登録の模擬成功
                return {
                    data: {
                        user: {
                            id: 'mock-user-123',
                            email: email || 'test@example.com'
                        }
                    },
                    error: null as any
                };
            },
            signOut: async () => {
                deleteCookie('mock_user_id');
                return { error: null as any };
            },
            onAuthStateChange: (callback: (event: string, session: any) => void) => {
                const userId = getCookie('mock_user_id');
                if (userId) {
                    callback('SIGNED_IN', {
                        user: {
                            id: userId,
                            email: "test@example.com"
                        }
                    });
                } else {
                    callback('SIGNED_OUT', null);
                }
                return {
                    data: {
                        subscription: {
                            unsubscribe: () => {}
                        }
                    }
                };
            }
        },
        from: (table: string) => {
            return new MockQueryBuilder(table);
        }
    };
};

const client = createClient();

export const getSalonData = async () => {
    const salondata = await client
        .from('salons')
        .select('*')
        .order('id', { ascending: true });

    const salonData = salondata.data?.map((salon: any) => {
        let parsedImages = { image1: '', image2: '' };

        if (salon.images) {
            parsedImages = typeof salon.images === 'string' ? JSON.parse(salon.images) : salon.images;
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

    const companyData = companyudata.data?.map((company: any) => {
        return {
            ...company,
        };
    });

    return { companyData };
};

export async function getSalonDataWithRatings() {
    const { data: salondata, error: salonError } = await client
        .from('salons')
        .select('*');

    const salonData = salondata?.map((salon: any) => {
        let parsedImages = { image1: '', image2: '' };

        if (salon.images) {
            parsedImages = typeof salon.images === 'string' ? JSON.parse(salon.images) : salon.images;
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
        const salonsWithoutRatings = (salonData || []).map((salon: any) => ({
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
        }));
        return { salonData: salonsWithoutRatings };
    }

    // salon_idごとにレビューをグループ化
    const reviewsBySalon = (reviewData || []).reduce((acc: any, review: any) => {
        if (!acc[review.salon_id]) {
            acc[review.salon_id] = [];
        }
        acc[review.salon_id].push(review);
        return acc;
    }, {} as Record<string, any[]>);

    // 各サロンに平均評価と件数を追加
    const salonsWithRatings = (salonData || []).map((salon: any) => {
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

        const averageRatings = {
            rating_1: calculateAverage(salonReviews, 'score_1'),
            rating_2: calculateAverage(salonReviews, 'score_2'),
            rating_3: calculateAverage(salonReviews, 'score_3'),
            rating_4: calculateAverage(salonReviews, 'score_4'),
            rating_5: calculateAverage(salonReviews, 'score_5'),
            overall: 0,
            reviewCount: salonReviews.length
        };

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

    function calculateAverage(reviews: any[], field: string): number {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + (review[field] || 0), 0);
        return sum / reviews.length;
    }
}