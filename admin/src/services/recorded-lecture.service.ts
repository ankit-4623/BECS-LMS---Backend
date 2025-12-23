import api from './api';
import type { RecordedLecture, RecordedLectureFormData } from '../lib/schemas';

export interface RecordedLectureResponse {
  success: boolean;
  data: RecordedLecture | RecordedLecture[];
  message?: string;
}

export const recordedLectureService = {
  getAllRecordedLectures: async (): Promise<{ success: boolean; data: RecordedLecture[] }> => {
    const response = await api.get<{ success: boolean; data: RecordedLecture[] }>('/instructor/recorded-lecture/get');
    return response.data;
  },

  getRecordedLecturesByCourse: async (courseId: string): Promise<{ success: boolean; data: RecordedLecture[] }> => {
    const response = await api.get<{ success: boolean; data: RecordedLecture[] }>(`/instructor/recorded-lecture/course/${courseId}`);
    return response.data;
  },

  getRecordedLectureById: async (id: string): Promise<{ success: boolean; data: RecordedLecture }> => {
    const response = await api.get<{ success: boolean; data: RecordedLecture }>(`/instructor/recorded-lecture/get/${id}`);
    return response.data;
  },

  createRecordedLecture: async (data: RecordedLectureFormData): Promise<RecordedLectureResponse> => {
    const response = await api.post<RecordedLectureResponse>('/instructor/recorded-lecture/create', data);
    return response.data;
  },

  updateRecordedLecture: async (id: string, data: Partial<RecordedLectureFormData>): Promise<RecordedLectureResponse> => {
    const response = await api.put<RecordedLectureResponse>(`/instructor/recorded-lecture/update/${id}`, data);
    return response.data;
  },

  deleteRecordedLecture: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/instructor/recorded-lecture/delete/${id}`);
    return response.data;
  },
};

export type { RecordedLecture, RecordedLectureFormData };
export default recordedLectureService;
