import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL; // Adjust based on your vite proxy or base URL

export const headlineService = {
    getAllHeadlines: async () => {
        const res = await axios.get(`${API_BASE_URL}/headlines`); // Admin view (all)
        return res.data;
    },
    createHeadline: async (data: any) => {
        const res = await axios.post(`${API_BASE_URL}/headlines/create`, data);
        return res.data;
    },
    updateHeadline: async (id: string, data: any) => {
        const res = await axios.patch(`${API_BASE_URL}/headlines/update/${id}`, data);
        return res.data;
    },
    deleteHeadline: async (id: string) => {
        const res = await axios.delete(`${API_BASE_URL}/headlines/delete/${id}`);
        return res.data;
    }
};