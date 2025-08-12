import { BASE_URL } from "./serverConfig";

export const getParticipantes = async (eventId, token) => {
    try {
        const res = await fetch(`${BASE_URL}/eventos/${eventId}/participantes`, 
            {
                headers: {
                    Authorization: `${token}`,
                }
            }
        );
        if (!res.ok) {
            throw new Error('Error fetching participantes');
        }
        return await res.json();
    } catch (error) {
        console.error('Error fetching participantes:', error);
        return {error: 'Error fetching participantes'};
    }
};

export const createParticipante = async (data) => {
    try {
        const res = await fetch(`${BASE_URL}/eventos/${data.eventId}/participantes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            throw new Error('Error creating participante');
        }
        return await res.json();
    } catch (error) {
        console.error('Error creating participante:', error);
        return {error: 'Error creating participante'};
    }
};

export const enviarVoto = async (votacionId, participanteId) => {
    if (!votacionId) {
        throw new Error('Votacion ID is required to vote');
    }
    if (!participanteId) {
        throw new Error('Participante ID is required to vote');
    }
    try {
        const res = await fetch(`${BASE_URL}/votar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ votacionId,participanteId })
        });
        if (!res.ok) {
            throw new Error('Error al votar, intente nuevamente');
        }
        return res;
    } catch (error) {
        console.error('Error voting:', error);
        return {error: 'Error voting'};
    }
};

export const resetVotosPorEvento = async (eventId, token) => {
    if (!eventId) throw new Error('Evento ID es requerido');
    try {
        const res = await fetch(`${BASE_URL}/eventos/${eventId}/reset-votos`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${token}`
            }
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data?.error || 'Error al resetear votos');
        }
        return data;
    } catch (error) {
        console.error('Error reseteando votos:', error);
        return { error: error.message || 'Error reseteando votos' };
    }
};