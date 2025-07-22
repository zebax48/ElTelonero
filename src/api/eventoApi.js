import { BASE_URL } from "./serverConfig";

export const getEventos = async () => {
    try {
        const res = await fetch(`${BASE_URL}/eventos`);
        if (!res.ok) {
            throw new Error('Error fetching eventos');
        }

        return await res.json();
    } catch (error) {
        console.error('Error fetching eventos:', error);
        return {error: 'Error fetching eventos'};
    }
};

export const getEvento = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/eventos/${id}`);
        if (!res.ok) {
            throw new Error('Error fetching evento');
        }

        return await res.json();
    } catch (error) {
        console.error('Error fetching evento:', error);
        return {error: 'Error fetching evento'};
    }
};

export const createEvento = async (data) => {
    try {
        const res = await fetch(`${BASE_URL}/eventos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            throw new Error('Error creating evento');
        }

        return await res.json();
    } catch (error) {
        console.error('Error creating evento:', error);
        return {error: 'Error creating evento'};
    }
};