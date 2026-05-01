import axios from "axios";
import type { Course, Testimonial } from ".";

// Base URL — replace with your actual API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL; // Adjust based on your vite proxy or base URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// ─── Courses ─────────────────────────────────────────────────────────────────

/**
 * Fetch all available courses.
 * GET /courses
 */
export const getAllCourses = async (): Promise<Course[]> => {
  const response = await apiClient.get("/landing-page/get-courses/root");
  // Return the array from response.data.data
  return response.data?.data || [];
};

/**
 * Fetch a single course by ID.
 * GET /courses/:id
 */
export const getCourseById = async (id: number): Promise<Course> => {
  const response = await apiClient.get<Course>(`/courses/${id}`);
  return response.data;
};

// ─── Testimonials ─────────────────────────────────────────────────────────────

/**
 * Fetch all testimonials.
 * GET /testimonials
 */
export const getLandingPageTestimonials = async (): Promise<Testimonial[]> => {
  const res = await fetch(`${API_BASE_URL}/landing-page/get-landing-page-testimonials`); // adjust base URL if needed
  if (!res.ok) throw new Error("Failed to fetch testimonials");
  const json = await res.json();
  return json.data; // your backend returns { success, count, data: [...] }
};

export const getNewsTicker = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/landing-page/get-headlines`); // Adjust endpoint as needed
        console.log(response)
        return response.data; 
    } catch (error) {
        console.error("Error fetching news:", error);
        return [];
    }
};