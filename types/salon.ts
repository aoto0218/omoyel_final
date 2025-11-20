export interface Salon {
    id: number;
    name: string;
    location: string;
    address?:string;
    nameKana?:string;
    images?:{image1:string,image2:string};
    tags: string[];
    imageType: 'canvas' | 'shell';
    visitSchedule?: string;
    duration?: string;
    flow?:string;
    guideStaff?:string;
    contact?:string;
    instagram?: string;
    meetingPlace?: string;
    staffGenderRatio?: string;
    staffAgeGroup?: string;
    atmosphere?: string;
    customerGenderRatio?: string;
    customerAgeGroup?: string;
    internationalCustomerFrequency?: string;
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