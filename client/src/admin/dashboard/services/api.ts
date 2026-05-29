import apiClient from "../../../context/api/apiClient";


export interface AdminStats {
  users: {
    total: number;
    active: number;
    inactive: number;
    newThisWeek: number;
    newThisMonth: number;
    byRole: Record<string, number>;
  };
  courses: {
    totalFolders: number;
    totalPages: number;
    active: number;
    inactive: number;
  };
  enrollments: {
    total: number;
    topCourses: { courseId: string; title: string; enrolledCount: number }[];
  };
  testimonials: {
    total: number;
    averageRating: number;
    ratingBreakdown: Record<number, number>;
  };
  headlines: {
    live: number;
  };
}

export const adminDashboardService = {
  getStats: async (): Promise<AdminStats> => {
    const response = await apiClient.get('/dashboard-admin');
    return response.data;
  },
};