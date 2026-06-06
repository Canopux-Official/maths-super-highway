
import apiClient from "../../../context/api/apiClient";


export const courseService = {

  getSubItems: async (parentId: string) => {
    const res = await apiClient.get(`/courses-user/${parentId}`);
    return res.data;
  },

  getPageDetails: async (pageId: string) => {
    const res = await apiClient.get(`/courses-user/getpage/${pageId}`);
    return res.data;
  },

  getMyEnrolledCourses: async () => {
    const res = await apiClient.get(`/courses-user/myenroll-courses`);
    return res.data;
  },

  getEnrolledStudents: async (id: string) => {
    const response = await apiClient.get(`/courses-user/enrolled-count/${id}`);
    return response.data;
  },
  getPdfBlobUrl: async (fileId: string): Promise<string> => {
    const response = await apiClient.get(
      `/courses-user/stream/pdf/${fileId}`,
      {
        responseType: 'blob',
      }
    );

    return URL.createObjectURL(response.data);
  },
};