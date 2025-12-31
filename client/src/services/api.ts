import type { Contract } from '../types/contract';

const BASE_URL = "/api/contracts";

export const contractService = {
    getAll: async (): Promise<Contract[]> => {
        const res = await fetch(BASE_URL);
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
    },

    create: async (data: Contract) => {
        return fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    },

    delete: async (id: number | string) => {
        return fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    }
};