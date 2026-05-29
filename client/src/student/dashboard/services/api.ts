import apiClient from "../../../context/api/apiClient";


export interface RecentEnrollment {
  enrolledAt: string;
  course: {
    _id: string;
    title: string;
    content: string;
    itemType: string;
    isActive: boolean;
  };
}

export interface UserStats {
  user: {
    name: string;
    email: string;
    phone: string;
    role: string;
    memberSince: string;
  };
  enrollments: {
    total: number;
    recent: RecentEnrollment[];
  };
  testimonials: {
    total: number;
    averageRating: number;
  };
}

export const userDashboardService = {
  getStats: async (userId: string): Promise<UserStats> => {
    const response = await apiClient.get(`/dashboard-user/${userId}`);
    return response.data;
  },
};