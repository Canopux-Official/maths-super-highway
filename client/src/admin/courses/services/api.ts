import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL; // Adjust based on your vite proxy or base URL

export const courseService = {
    // Fetch children of a specific parent (or 'root')
    getSubItems: async (parentId: string) => {
        const response = await axios.get(`${API_BASE_URL}/courses-admin/${parentId}`);
        return response.data;
    },

    // Fetch full details of a single page (including enrolled students)
    getPageDetails: async (id: string) => {
        const response = await axios.get(`${API_BASE_URL}/courses-admin/getpage/${id}`);
        return response.data;
    },

    // Create a new folder or page
    createCourse: async (data: { title: string; content?: string; parentId: string | null; itemType: 'folder' | 'page' }) => {
        const response = await axios.post(`${API_BASE_URL}/courses-admin/create`, data);
        return response.data;
    },

    // Delete a course and all its descendants
    deleteCourse: async (id: string) => {
        const response = await axios.delete(`${API_BASE_URL}/courses-admin/delete/${id}`);
        return response.data;
    },


    updateCourse: async (id: string, data: any) => {
        const res = await axios.patch(`${API_BASE_URL}/courses-admin/update/${id}`, data);
        return res.data;
    }
};