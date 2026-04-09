import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

export const enrollmentService = {
  enrollInCourse: async (courseId: string) => {
    const res = await axios.post(`${API_BASE_URL}/enrollment/enroll`, { courseId });
    return res.data;
  },

  unenrollFromCourse: async (courseId: string) => {
    const res = await axios.delete(`${API_BASE_URL}/enrollment/unenroll`, {
      data: { courseId },
    });
    return res.data;
  },

  checkEnrollment: async (courseId: string) => {
    const res = await axios.get(`${API_BASE_URL}/enrollment/check-enrollment/${courseId}`);
    return res.data;
  },
};