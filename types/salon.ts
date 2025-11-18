// types/salon.ts

export interface Salon {
    id: number;
    name: string;
    location: string;
    tags: string[];
    imageType: 'canvas' | 'shell';
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
}