
import apiClient from "../../../context/api/apiClient";


export const enrollmentService = {
  enrollInCourse: async (courseId: string) => {
    const res = await apiClient.post(`/enrollment/enroll`, { courseId });
    return res.data;
  },

  unenrollFromCourse: async (courseId: string) => {
    const res = await apiClient.delete(`/enrollment/unenroll`, {
      data: { courseId },
    });
    return res.data;
  },

  checkEnrollment: async (courseId: string) => {
    const res = await apiClient.get(`/enrollment/check-enrollment/${courseId}`);
    return res.data;
  },
};