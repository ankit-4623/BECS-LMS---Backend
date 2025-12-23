import api from './api';
import type { StudyNote, StudyNoteFormData } from '../lib/schemas';

export interface StudyNoteResponse {
  success: boolean;
  data: StudyNote | StudyNote[];
  message?: string;
}

export const studyNoteService = {
  getAllStudyNotes: async (): Promise<{ success: boolean; data: StudyNote[] }> => {
    const response = await api.get<{ success: boolean; data: StudyNote[] }>('/instructor/study-note/get');
    return response.data;
  },

  getStudyNotesByCourse: async (courseId: string): Promise<{ success: boolean; data: StudyNote[] }> => {
    const response = await api.get<{ success: boolean; data: StudyNote[] }>(`/instructor/study-note/course/${courseId}`);
    return response.data;
  },

  getStudyNoteById: async (id: string): Promise<{ success: boolean; data: StudyNote }> => {
    const response = await api.get<{ success: boolean; data: StudyNote }>(`/instructor/study-note/get/${id}`);
    return response.data;
  },

  createStudyNote: async (data: StudyNoteFormData): Promise<StudyNoteResponse> => {
    const response = await api.post<StudyNoteResponse>('/instructor/study-note/create', data);
    return response.data;
  },

  updateStudyNote: async (id: string, data: Partial<StudyNoteFormData>): Promise<StudyNoteResponse> => {
    const response = await api.put<StudyNoteResponse>(`/instructor/study-note/update/${id}`, data);
    return response.data;
  },

  deleteStudyNote: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/instructor/study-note/delete/${id}`);
    return response.data;
  },
};

export type { StudyNote, StudyNoteFormData };
export default studyNoteService;
