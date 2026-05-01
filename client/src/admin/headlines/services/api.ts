// import axios from "axios";

import apiClient from "../../../context/api/apiClient";

// const API_BASE_URL = import.meta.env.VITE_API_URL; // Adjust based on your vite proxy or base URL

// export const headlineService = {
//     getAllHeadlines: async () => {
//         const res = await axios.get(`${API_BASE_URL}/headlines`); // Admin view (all)
//         return res.data;
//     },
//     createHeadline: async (data: any) => {
//         const res = await axios.post(`${API_BASE_URL}/headlines/create`, data);
//         return res.data;
//     },
//     updateHeadline: async (id: string, data: any) => {
//         const res = await axios.patch(`${API_BASE_URL}/headlines/update/${id}`, data);
//         return res.data;
//     },
//     deleteHeadline: async (id: string) => {
//         const res = await axios.delete(`${API_BASE_URL}/headlines/delete/${id}`);
//         return res.data;
//     }
// };



export const headlineService = {
    getAllHeadlines: async () => {
        // Use apiClient instead of axios
        const res = await apiClient.get('/headlines'); 
        return res.data;
    },
    
    createHeadline: async (data: any) => {
        const res = await apiClient.post('/headlines/create', data);
        return res.data;
    },
    
    updateHeadline: async (id: string, data: any) => {
        const res = await apiClient.patch(`/headlines/update/${id}`, data);
        return res.data;
    },
    
    deleteHeadline: async (id: string) => {
        const res = await apiClient.delete(`/headlines/delete/${id}`);
        return res.data;
    }
};