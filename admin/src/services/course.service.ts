import api from './api';
import type { Course, CourseFormData } from '../lib/schemas';

export interface CourseResponse {
  success: boolean;
  data: Course[];
}

export interface SingleCourseResponse {
  success: boolean;
  data: Course;
}

export const courseService = {
  getAllCourses: async (): Promise<CourseResponse> => {
    const response = await api.get<CourseResponse>('/instructor/course/get');
    return response.data;
  },

  getCourseById: async (id: string): Promise<SingleCourseResponse> => {
    const response = await api.get<SingleCourseResponse>(`/instructor/course/get/details/${id}`);
    return response.data;
  },

  createCourse: async (data: FormData): Promise<SingleCourseResponse> => {
    const response = await api.post<SingleCourseResponse>('/instructor/course/add', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateCourse: async (id: string, data: FormData): Promise<SingleCourseResponse> => {
    const response = await api.put<SingleCourseResponse>(`/instructor/course/update/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteCourse: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/instructor/course/delete/${id}`);
    return response.data;
  },
};

export type { Course, CourseFormData };
export default courseService;
