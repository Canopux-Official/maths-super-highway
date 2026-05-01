import apiClient from "../../../context/api/apiClient";

export const userService = {
    getUsers: async () => {
        // Just provide the relative path
        const res = await apiClient.get('/admin-manage-student');
        return res.data;
    },

    // Admin only updates existing records
    updateUser: async (id: string, data: any) => {
        const res = await apiClient.put(`/admin-manage-student/update-status/${id}`, data);
        return res.data;
    },

    deleteUser: async (id: string) => {
        const res = await apiClient.delete(`/admin-manage-student/delete-user/${id}`);
        return res.data;
    }
};