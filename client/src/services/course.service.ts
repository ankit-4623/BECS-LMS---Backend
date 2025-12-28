import api from '../lib/api';
import type { Course } from '../lib/schemas';

// ============ COURSE SERVICES ============

// Backend response interfaces (matching actual API response)
export interface BackendCoursesResponse {
  success: boolean;
  data: Course[];
}

export interface BackendCourseResponse {
  success: boolean;
  data: Course;
}

export interface BackendPurchasedCoursesResponse {
  success: boolean;
  data: {
    courseId: string;
    title: string;
    instructorId: string;
    instructorName: string;
    dateOfPurchase: string;
    courseImage: string;
  }[];
}

export interface BackendPurchaseCheckResponse {
  success: boolean;
  data: boolean;
}

// Get all courses (student view)
export const getAllCourses = async (filters?: {
  category?: string;
  level?: string;
  primaryLanguage?: string;
  sortBy?: string;
}): Promise<BackendCoursesResponse> => {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.level) params.append('level', filters.level);
  if (filters?.primaryLanguage) params.append('primaryLanguage', filters.primaryLanguage);
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  
  const response = await api.get<BackendCoursesResponse>(
    `/student/course/get?${params.toString()}`
  );
  return response.data;
};

// Get single course details
export const getCourseDetails = async (courseId: string): Promise<BackendCourseResponse> => {
  const response = await api.get<BackendCourseResponse>(
    `/student/course/get/details/${courseId}`
  );
  return response.data;
};

// Get purchased courses
export const getPurchasedCourses = async (studentId: string): Promise<BackendPurchasedCoursesResponse> => {
  const response = await api.get<BackendPurchasedCoursesResponse>(
    `/student/courses-bought/get/${studentId}`
  );
  return response.data;
};

// Check if course is purchased
export const checkCoursePurchase = async (
  courseId: string,
  studentId: string
): Promise<BackendPurchaseCheckResponse> => {
  const response = await api.get<BackendPurchaseCheckResponse>(
    `/student/course/purchase-info/${courseId}/${studentId}`
  );
  return response.data;
};

export interface BackendLiveLectureResponse {
  success: boolean;
  data: LiveLecture | null;
  allLectures: LiveLecture[];
  message?: string;
}

// Live Lecture interface
export interface LiveLecture {
  _id: string;
  courseId: string;
  meetingLink: string;
  title?: string;
  description?: string;
  scheduledAt: string;
  duration?: number;
  instructorId?: string;
  instructorName?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecordedLecture {
  _id: string;
  courseId: string;
  title: string;
  chapterName: string;
  lectureNumber: number;
  videoUrl: string;
  duration: string;
  instructorId: {
    _id: string;
    userName: string;
  };
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackendRecordedLecturesResponse {
  success: boolean;
  data: RecordedLecture[];
}

// Get live lecture by course ID (using student endpoint)
export const getLiveLectureByCourse = async (courseId: string): Promise<BackendLiveLectureResponse> => {
  const response = await api.get<BackendLiveLectureResponse>(
    `/student/live-lecture/course/${courseId}`
  );
  return response.data;
};

// Get recorded lectures by course ID
export const getRecordedLecturesByCourse = async (courseId: string): Promise<BackendRecordedLecturesResponse> => {
  const response = await api.get<BackendRecordedLecturesResponse>(
    `/student/recorded-lecture/course/${courseId}`
  );
  return response.data;
};
