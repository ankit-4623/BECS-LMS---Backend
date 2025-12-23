import api from './api';
import type { LiveLecture, LiveLectureFormData } from '../lib/schemas';

export interface LiveLectureResponse {
  success: boolean;
  data: LiveLecture | LiveLecture[];
  message?: string;
}

export const liveLectureService = {
  getAllLiveLectures: async (): Promise<{ success: boolean; data: LiveLecture[] }> => {
    const response = await api.get<{ success: boolean; data: LiveLecture[] }>('/instructor/live-lecture/get');
    return response.data;
  },

  getLiveLecturesByCourse: async (courseId: string): Promise<{ success: boolean; data: LiveLecture[] }> => {
    const response = await api.get<{ success: boolean; data: LiveLecture[] }>(`/instructor/live-lecture/course/${courseId}`);
    return response.data;
  },

  createLiveLecture: async (data: LiveLectureFormData): Promise<LiveLectureResponse> => {
    const response = await api.post<LiveLectureResponse>('/instructor/live-lecture/create', data);
    return response.data;
  },

  updateLiveLecture: async (id: string, data: Partial<LiveLectureFormData>): Promise<LiveLectureResponse> => {
    const response = await api.put<LiveLectureResponse>(`/instructor/live-lecture/update/${id}`, data);
    return response.data;
  },

  updateLiveLectureStatus: async (id: string, status: string): Promise<LiveLectureResponse> => {
    const response = await api.patch<LiveLectureResponse>(`/instructor/live-lecture/status/${id}`, { status });
    return response.data;
  },

  deleteLiveLecture: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/instructor/live-lecture/delete/${id}`);
    return response.data;
  },
};

export type { LiveLecture, LiveLectureFormData };
export default liveLectureService;
