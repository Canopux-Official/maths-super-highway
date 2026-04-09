import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

export const courseService = {

  getSubItems: async (parentId: string) => {
    const res = await axios.get(`${API_BASE_URL}/courses-user/${parentId}`);
    return res.data;
  },

  getPageDetails: async (pageId: string) => {
    const res = await axios.get(`${API_BASE_URL}/courses-user/getpage/${pageId}`);
    return res.data;
  },

  getMyEnrolledCourses: async () => {
    const res = await axios.get(`${API_BASE_URL}/courses-user/myenroll-courses`);
    return res.data;
  },
};