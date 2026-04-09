import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

export const testimonialService = {
  createTestimonial: async (data: { courseId: string; rating: number; message: string }) => {
    const res = await axios.post(`${API_BASE_URL}/testimonials/create`, data);
    return res.data;
  },

  updateTestimonial: async (id: string, data: { rating?: number; message?: string }) => {
    const res = await axios.patch(`${API_BASE_URL}/testimonials/update/${id}`, data);
    return res.data;
  },

  deleteTestimonial: async (id: string) => {
    const res = await axios.delete(`${API_BASE_URL}/testimonials/delete/${id}`);
    return res.data;
  },

  getMyTestimonialForCourse: async (courseId: string) => {
    const res = await axios.get(`${API_BASE_URL}/testimonials/get-my-testimonial-for-course/${courseId}`);
    return res.data;
  },
};