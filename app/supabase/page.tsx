import { getSalonData } from '@/lib/supabase_client';
import Image from 'next/image';

export default async function Page() {
    const data = await getSalonData();

    return (
        <ul>
            {data.processedData?.map((salon) => (
                <div key={salon.id} className="mb-10">
                    <li className="font-bold">{salon.id}</li>
                    <li>{salon.name}</li>
                    <li>{salon.location}</li>
                    <li><Image src={salon.images.image1} alt="Image 1" width={100} height={100} /></li>
                    <li><Image src={salon.images.image2} alt="Image 2" width={100} height={100} /></li>
                    <li>{salon.address}</li>
                    <li>{salon.name_kana}</li>
                    <li>{salon.tags.join(', ')}</li>
                    <li>{salon.image_type}</li>
                    <li>{salon.visit_schedule}</li>
                    <li>{salon.duration}</li>
                    <li>{salon.flow}</li>
                    <li>{salon.guide_staff}</li>
                    <li>{salon.contact}</li>
                    <li>{salon.instagram}</li>
                    <li>{salon.meeting_place}</li>
                    <li>{salon.staff_gender_ratio}</li>
                    <li>{salon.staff_age_group}</li>
                    <li>{salon.atmosphere}</li>
                    <li>{salon.customer_gender_ratio}</li>
                    <li>{salon.customer_age_group}</li>
                    <li>{salon.international_customer_frequency}</li>
                </div>
            ))}
        </ul>
    )
}