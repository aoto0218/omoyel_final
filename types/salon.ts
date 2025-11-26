export interface Salon {
    id: number;
    name: string;
    location: string;
    images:{image1?:string,image2?:string};
    address: string;
    nameKana: string;
    tags: string[];
    imageType: string;
    visitSchedule: string;
    duration: string;
    flow: string;
    guideStaff: string;
    contact: string;
    instagram: string;
    meetingPlace: string;
    staffGenderRatio: string;
    staffAgeGroup: string;
    atmosphere: string;
    customerGenderRatio: string;
    customerAgeGroup: string;
    internationalCustomerFrequency: string;
    featured?: boolean;
    lat: number;
    lon: number;
}