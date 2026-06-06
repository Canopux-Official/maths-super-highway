// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL; // Adjust based on your vite proxy or base URL

// export const courseService = {
//     // Fetch children of a specific parent (or 'root')
//     getSubItems: async (parentId: string) => {
//         const response = await axios.get(`${API_BASE_URL}/courses-admin/${parentId}`);
//         return response.data;
//     },

//     // Fetch full details of a single page (including enrolled students)
//     getPageDetails: async (id: string) => {
//         const response = await axios.get(`${API_BASE_URL}/courses-admin/getpage/${id}`);
//         return response.data;
//     },

//     // Create a new folder or page
//     createCourse: async (data: { title: string; content?: string; parentId: string | null; itemType: 'folder' | 'page' }) => {
//         const response = await axios.post(`${API_BASE_URL}/courses-admin/create`, data);
//         return response.data;
//     },

//     // Delete a course and all its descendants
//     deleteCourse: async (id: string) => {
//         const response = await axios.delete(`${API_BASE_URL}/courses-admin/delete/${id}`);
//         return response.data;
//     },


//     updateCourse: async (id: string, data: any) => {
//         const res = await axios.patch(`${API_BASE_URL}/courses-admin/update/${id}`, data);
//         return res.data;
//     }
// };

import apiClient from '../../../context/api/apiClient';

export const courseService = {
    // Fetch children of a specific parent (or 'root')
    getSubItems: async (parentId: string) => {
        // Use 'apiClient' instead of 'axios'
        const response = await apiClient.get(`/courses-admin/${parentId}`);
        return response.data;
    },

    // Fetch full details of a single page
    getPageDetails: async (id: string) => {
        const response = await apiClient.get(`/courses-admin/getpage/${id}`);
        return response.data;
    },

    // Create a new folder or page
    createCourse: async (data: { title: string; content?: string; parentId: string | null; itemType: 'folder' | 'page' }) => {
        const response = await apiClient.post(`/courses-admin/create`, data);
        return response.data;
    },

    // Delete a course and all its descendants
    deleteCourse: async (id: string) => {
        const response = await apiClient.delete(`/courses-admin/delete/${id}`);
        return response.data;
    },

    updateCourse: async (id: string, data: any) => {
        const res = await apiClient.patch(`/courses-admin/update/${id}`, data);
        return res.data;
    },


    getEnrolledStudents: async (id: string) => {
        const response = await apiClient.get(`/courses-admin/enrolled-count/${id}`);
        return response.data;
    },

    exportCourseStudents: async (id: string) => {
        const response = await apiClient.get(`/courses-admin/enrolled-students/${id}`);
        return response.data;
    },
    uploadImage: async (file: File): Promise<{ success: boolean; url: string; publicId: string }> => {
        const formData = new FormData();
        // Ensure 'image' matches exactly what your backend middleware (like multer) expects
        formData.append('image', file);

        const response = await apiClient.post('/courses-admin/upload-image', formData);
        // ^ Removed the headers object entirely. Let Axios handle it automatically.

        return response.data;
    },

    // Delete an image from Cloudinary by its publicId.
    // publicId comes from the data-public-id attribute stored on the <img> tag.
    deleteImage: async (publicId: string): Promise<{ success: boolean; message: string }> => {
        const response = await apiClient.delete(
            `/courses-admin/image/${encodeURIComponent(publicId)}`
        );
        return response.data;
    },
    getPdfBlobUrl: async (fileId: string): Promise<string> => {
        const response = await apiClient.get(
            `/courses-admin/stream/pdf/${fileId}`,
            {
                responseType: 'blob',
            }
        );

        return URL.createObjectURL(response.data);
    },
};