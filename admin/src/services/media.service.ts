import api from './api';

export interface UploadResponse {
  success: boolean;
  data: {
    url: string;
    public_id: string;
  };
}

export const mediaService = {
  uploadMedia: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('media', file);
    
    const response = await api.post<UploadResponse>('/instructor/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteMedia: async (publicId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/instructor/media/delete/${publicId}`);
    return response.data;
  },
};

export default mediaService;
