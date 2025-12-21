import api from './api';

export interface LiveLecture {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  scheduledAt: string;
  meetingLink: string;
  duration: number;
  instructorId: string;
  instructorName: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

export interface LiveLectureFormData {
  courseId: string;
  title: string;
  description: string;
  scheduledAt: string;
  meetingLink: string;
  duration: number;
}

export interface LiveLectureResponse {
  success: boolean;
  data: LiveLecture | LiveLecture[];
}

export const liveLectureService = {
  getLiveLecturesByCourse: async (courseId: string): Promise<LiveLectureResponse> => {
    const response = await api.get<LiveLectureResponse>(`/instructor/live-lecture/course/${courseId}`);
    return response.data;
  },

  createLiveLecture: async (data: LiveLectureFormData): Promise<LiveLectureResponse> => {
    const response = await api.post<LiveLectureResponse>('/instructor/live-lecture/create', data);
    return response.data;
  },

  deleteLiveLecture: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/instructor/live-lecture/delete/${id}`);
    return response.data;
  },
};

export default liveLectureService;
