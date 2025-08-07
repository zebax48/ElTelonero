import { BASE_URL } from "./serverConfig";

export const getEventos = async (token) => {
    try {
        const res = await fetch(`${BASE_URL}/eventos`, {
            headers: {
                Authorization: `${token}`,
            }
        });
        if (!res.ok) {
            throw new Error('Error fetching eventos');
        }

        return await res.json();
    } catch (error) {
        console.error('Error fetching eventos:', error);
        return { error: 'Error fetching eventos' };
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
        return { error: 'Error fetching evento' };
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
        return { error: 'Error creating evento' };
    }
};

export const getActiveVotacion = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/eventos/votacion-activa/${id}`);
        if (!res.ok) {
            throw new Error('Error fetching active votacion');
        }

        return await res.json();
    } catch (error) {
        console.error('Error fetching active votacion:', error);
        return { error: 'Error fetching active votacion' };
    }
}

export const setVotacionStatus = async (eventId, status, token) => {
    try {
        console.log('Setting votacion status:', { eventId, status });
        console.log('Using token:', token);

        const res = await fetch(`${BASE_URL}/eventos/setVotacionStatus`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` },
            body: JSON.stringify({ eventId, status })
        });
        
        console.log('Response:', res);
        if (!res.ok) {
            throw new Error('Error setting votacion status');
        }
        

        return await res.json();
    } catch (error) {
        console.error('Error setting votacion status:', error);
        return { error: 'Error setting votacion status' };
    }
}

export const setResultVotacionStatus = async (eventId, status, token) => {
    try {
        const res = await fetch(`${BASE_URL}/eventos/setResultVotacionStatus`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` },
            body: JSON.stringify({ eventId, status })
        });
        
        console.log('Response:', res);
        if (!res.ok) {
            throw new Error('Error setting votacion status');
        }
        

        return await res.json();
    } catch (error) {
        console.error('Error setting votacion status:', error);
        return { error: 'Error setting votacion status' };
    }
}