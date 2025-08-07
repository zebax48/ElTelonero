export const BASE_URL = 'http://localhost:5000/api';
//export const BASE_URL = 'http://localhost:5000/api'; // For local development
//export const BASE_URL = 'https://elteloneroback.onrender.com/api'; // For production development

export async function getActiveEventId () {
    try {
        const res = await fetch(`${BASE_URL}/activeIds`);
        const data = await res.json();
        return data[0].eventId;
    } catch (error) {
        console.error('Error fetching active event id:', error);
        return null;
    }
}

export async function getActiveVotationId () {
    try {
        const res = await fetch(`${BASE_URL}/activeIds`);
        const data = await res.json();
        return data[0].votacionId;
    } catch (error) {
        console.error('Error fetching active votation id:', error);
        return null;
    }
}
