import apiClient from '../../../context/api/apiClient';

export interface MyReview {
  _id: string;
  courseId: string;
  rating: number;
  message: string;
  updatedAt: string;
}

export interface MyFeedback {
  limit: number;
  used: number;
  reviews: MyReview[];
}

export const testimonialService = {
  getMine: async (): Promise<MyFeedback> => (await apiClient.get('/testimonials/mine')).data.data,

  create: async (data: { courseId: string; rating: number; message: string }) =>
    (await apiClient.post('/testimonials/create', data)).data,

  // students can edit but never delete
  update: async (id: string, data: { rating: number; message: string }) =>
    (await apiClient.patch(`/testimonials/update/${id}`, data)).data,
};