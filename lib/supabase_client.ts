import { createBrowserClient } from '@supabase/ssr';

const createClient = () => {
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
            images:{
                image1:parsedImages?.image1 || '',
                image2:parsedImages?.image2 || ''
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
        return{
            ...company,
        }
    });

    return { companyData };
};