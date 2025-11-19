import { Salon } from '@/types/salon';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function getSalons(params?: {
    areas?: string[];
    menus?: string[];
    search?: string;
    page?: number;
    limit?: number;
}): Promise<Salon[]> {
    try {
        const queryParams = new URLSearchParams();

        if (params?.areas && params.areas.length > 0) {
            queryParams.append('areas', params.areas.join(','));
        }
        if (params?.menus && params.menus.length > 0) {
            queryParams.append('menus', params.menus.join(','));
        }
        if (params?.search) {
            queryParams.append('search', params.search);
        }
        if (params?.page) {
            queryParams.append('page', params.page.toString());
        }
        if (params?.limit) {
            queryParams.append('limit', params.limit.toString());
        }

        const url = `${API_BASE_URL}/salons${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch salons');
        }

        const data = await response.json();
        return data.salons || data;
    } catch (error) {
        console.error('Error fetching salons:', error);
        throw error;
    }
}

export async function getSalonById(id: number): Promise<Salon> {
    try {
        const response = await fetch(`${API_BASE_URL}/salons/${id}`);

        if (!response.ok) {
            throw new Error('Failed to fetch salon');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching salon:', error);
        throw error;
    }
}

export async function bookSalonVisit(data: {
    salonId: number;
    name: string;
    email: string;
    phone: string;
    date: string;
    message?: string;
}): Promise<{ success: boolean; message: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to create booking');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
}

export async function consultSalon(data: {
    salonId: number;
    message: string;
}): Promise<{ success: boolean }> {
    try {
        const response = await fetch(`${API_BASE_URL}/consultations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to send consultation');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error sending consultation:', error);
        throw error;
    }
}