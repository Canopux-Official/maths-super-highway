import apiClient from "../../../context/api/apiClient";

export const targetExamAdminService = {
    getTargetExams: async () => {
        const res = await apiClient.get('/target-exams-admin');
        return res.data;
    },
    createTargetExam: async (data: { name: string, isActive: boolean }) => {
        const res = await apiClient.post('/target-exams-admin', data);
        return res.data;
    },
    updateTargetExam: async (id: string, data: { name?: string, isActive?: boolean }) => {
        const res = await apiClient.put(`/target-exams-admin/${id}`, data);
        return res.data;
    },
    deleteTargetExam: async (id: string) => {
        const res = await apiClient.delete(`/target-exams-admin/${id}`);
        return res.data;
    }
};

export const targetExamUserService = {
    getActiveTargetExams: async () => {
        const res = await apiClient.get('/target-exams-user');
        return res.data;
    }
};
