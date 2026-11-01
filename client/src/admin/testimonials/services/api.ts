import apiClient from '../../../context/api/apiClient';

export interface ReviewStat { ownCount: number; ownAvg: number; allCount: number; allAvg: number }

export interface AdminReview {
    _id: string;
    rating: number;
    message: string;
    showOnLanding: boolean;
    createdAt: string;
    updatedAt: string;
    studentName: string;
    studentEmail: string;
    topic: string;
}

export const reviewService = {
    getStats: async (): Promise<Record<string, ReviewStat>> =>
        (await apiClient.get('/testimonials/admin/stats')).data.data,

    getNodeReviews: async (id: string, inside: boolean): Promise<{ reviews: AdminReview[]; count: number; average: number }> =>
        (await apiClient.get(`/testimonials/admin/node/${id}`, { params: { inside: inside ? 1 : 0 } })).data.data,

    setVisibility: async (id: string, showOnLanding: boolean) =>
        (await apiClient.patch(`/testimonials/admin/${id}/visibility`, { showOnLanding })).data,

    deleteReview: async (id: string) => (await apiClient.delete(`/testimonials/admin/${id}`)).data,
};