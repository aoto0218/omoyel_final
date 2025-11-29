export interface Salon {
    id: number;
    name: string;
    location: string;
    images: { image1?: string, image2?: string };
    address: string;
    name_kana: string;
    tags: string[];
    imageType: string;
    visit_schedule: string;
    duration: string;
    flow: string;
    guideStaff: string;
    contact: string;
    instagram: string;
    meeting_place: string;
    staff_gender_ratio: string;
    staff_age_group: string;
    atmosphere: string;
    customer_gender_ratio: string;
    customer_age_group: string;
    international_customer_frequency: string;
    company_id: number;
    featured?: boolean;
    lat: number;
    lon: number;
    averageRatings?: {
        rating_1: number;
        rating_2: number;
        rating_3: number;
        rating_4: number;
        rating_5: number;
        overall: number;
    } | null;
}

export interface Company {
    id: number;
    name: string;
    hr: string[];
    recruit: string;
    experience: string[];
    provided: string;
    salons: string;
    event: string[];
    expansion: string;
    appeal: string;
    point: string;
    customer: string;
    staff: string;
    start_salary: string;
    assist_salary: string;
    stylist_salary: string;
    manager_salary: string;
    area_salary: string;
    ten_million: boolean;
    bonus: string;
    benefits: string;
    insurance: string;
    vacation_system: string;
    paid_holiday: string;
    weekends_off: string;
    shift: string;
    lesson: string;
    item: string[];
    debut: string;
    process: string;
}