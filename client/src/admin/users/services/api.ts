import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL; // Adjust based on your vite proxy or base URL

export const userService = {
    getUsers: async () => {
        const res = await axios.get(`${API_BASE_URL}/admin-manage-student`);
        return res.data;
    },
    // Admin only updates existing records
    updateUser: async (id: string, data: any) => {
        const res = await axios.put(`${API_BASE_URL}/admin-manage-student/update-status/${id}`, data);
        return res.data;
    },
    deleteUser: async (id: string) => {
        const res = await axios.delete(`${API_BASE_URL}/admin-manage-student/delete-user/${id}`);
        return res.data;
    }
};