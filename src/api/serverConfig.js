export const BASE_URL = 'https://elteloneroback.onrender.com/api';
//export const BASE_URL = 'http://localhost:5000/api'; // For local development
//export const BASE_URL = 'https://elteloneroback.onrender.com/api'; // For production development

export async function getActiveEventId () {
    try {
        const res = await fetch(`${BASE_URL}/activeIds`);
        const data = await res.json();
        return Array.isArray(data) && data.length > 0 ? data[0].eventId : null;
    } catch (error) {
        console.error('Error fetching active event id:', error);
        return null;
    }
}

export async function getActiveVotationId () {
    try {
        const res = await fetch(`${BASE_URL}/activeIds`);
        const data = await res.json();
        return Array.isArray(data) && data.length > 0 ? data[0].votacionId : null;
    } catch (error) {
        console.error('Error fetching active votation id:', error);
        return null;
    }
}

export async function setActiveVotacionId(votacionId, token) {
    try {
        const res = await fetch(`${BASE_URL}/activeIds/setVotacionId`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `${token}` },
            body: JSON.stringify({ votacionId })
        });
        if (!res.ok) throw new Error('Error setting active votacion id');
        return await res.json();
    } catch (error) {
        console.error('Error setting active votacion id:', error);
        return { error: 'Error setting active votacion id' };
    }
}
