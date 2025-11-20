export interface SalonDB {
    id: number;
    name: string;
    location: string;
    images: string;
    address: string;
    name_kana: string;
    tags: string[];
    image_type: string;
    visit_schedule: string;
    duration: string;
    flow: string;
    guide_staff: string;
    contact: string;
    instagram: string;
    meeting_place: string;
    staff_gender_ratio: string;
    staff_age_group: string;
    atmosphere: string;
    customer_gender_ratio: string;
    customer_age_group: string;
    international_customer_frequency: string;
}

export interface Salon {
    id: number;
    name: string;
    location: string;
    images?: {
        image1?: string;
        image2?: string;
    };
    address: string;
    nameKana: string;
    tags: string[];
    imageType: string;
    visitSchedule: string;
    duration: string;
    flow: string;
    guideStaff: string;
    contact?: string;
    instagram: string;
    meetingPlace: string;
    staffGenderRatio: string;
    staffAgeGroup: string;
    atmosphere: string;
    customerGenderRatio: string;
    customerAgeGroup: string;
    internationalCustomerFrequency: string;
    featured?: boolean;
}

export interface DropdownProps {
    label: string;
    options: string[];
    selected: string[];
    onToggle: (option: string) => void;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}

export interface ActionButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'outline' | 'filled';
}

export interface TagProps {
    children: React.ReactNode;
}

export interface SalonCardProps {
    salon: Salon;
    onVisit?: (salonId: number) => void;
    onConsult?: (salonId: number) => void;
}

export interface SalonImageProps {
    type: 'canvas' | 'shell';
    alt: string;
    src: string;
}