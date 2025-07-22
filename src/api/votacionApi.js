import { BASE_URL } from "./serverConfig";

export const getVotaciones = async () => {
    try {
        const res = await fetch(`${BASE_URL}/votaciones`);
        if (!res.ok) {
            throw new Error('Error fetching votaciones');
        }
        return await res.json();
    } catch (error) {
        console.error('Error fetching votaciones:', error);
        return {error: 'Error fetching votaciones'};
    }
};

export const getVotacion = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/votaciones/${id}`);
        if (!res.ok) {
            throw new Error('Error fetching votacion');
        }
        return await res.json();
    } catch (error) {
        console.error('Error fetching votacion:', error);
        return {error: 'Error fetching votacion'};
    }
};

export const createVotacion = async (data) => {
    try {
        const res = await fetch(`${BASE_URL}/votaciones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            throw new Error('Error creating votacion');
        }
        const result = await res.json();
        return { ok: res.ok, status: res.status, data: result };
    } catch (error) {
        console.error('Error creating votacion:', error);
        return {error: 'Error creating votacion'};
    }
};

export const getVotacionActiva = async (eventoId) => {
    if (!eventoId) {
        throw new Error('Evento ID is required to fetch active votaciones');
    }
    try {
        const res = await fetch(`${BASE_URL}/votaciones/${eventoId}`);
        if (!res.ok) {
            throw new Error('Error fetching active votaciones');
        }
        return await res.json();
    } catch (error) {
        console.error('Error fetching active votaciones:', error);
        return {error: 'Error fetching active votaciones'};
    }
};