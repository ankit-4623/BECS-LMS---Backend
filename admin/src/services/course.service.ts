import api from './api';

export interface Curriculum {
  _id?: string;
  title: string;
  videoUrl: string;
  notesUrl?: string;
  freePreview: boolean;
}

export interface Course {
  _id: string;
  instructorId: string;
  instructorName: string;
  date: string;
  title: string;
  category: string;
  level: string;
  primaryLanguage: string;
  subtitle: string;
  description: string;
  image: string;
  welcomeMessage: string;
  pricing: number;
  objectives: string;
  students: Array<{ studentId: string; studentName: string; studentEmail: string; paidAmount: number }>;
  curriculum: Curriculum[];
  isPublished: boolean;
  teachers?: {
    teacherName: string;
    teacherImage: string;
    teacherBio: string;
  };
  totalDuration?: string;
  lastUpdated?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseFormData {
  title: string;
  category: string;
  level: string;
  primaryLanguage: string;
  subtitle: string;
  description: string;
  welcomeMessage: string;
  pricing: number;
  objectives: string;
  curriculum: Curriculum[];
  isPublished: boolean;
  image?: File;
  teachers?: {
    teacherName: string;
    teacherImage: string;
    teacherBio: string;
  };
}

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

export default courseService;
