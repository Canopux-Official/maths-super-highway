
import apiClient from "../../../context/api/apiClient";


export const testimonialService = {
  createTestimonial: async (data: { courseId: string; rating: number; message: string }) => {
    const res = await apiClient.post(`/testimonials/create`, data);
    return res.data;
  },

  updateTestimonial: async (id: string, data: { rating?: number; message?: string }) => {
    const res = await apiClient.patch(`/testimonials/update/${id}`, data);
    return res.data;
  },

  deleteTestimonial: async (id: string) => {
    const res = await apiClient.delete(`/testimonials/delete/${id}`);
    return res.data;
  },

  getMyTestimonialForCourse: async (courseId: string) => {
    const res = await apiClient.get(`/testimonials/get-my-testimonial-for-course/${courseId}`);
    return res.data;
  },
};