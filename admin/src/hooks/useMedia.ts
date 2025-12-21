import { useMutation } from '@tanstack/react-query';
import mediaService from '../services/media.service';

// Hook to upload media
export const useUploadMedia = () => {
  return useMutation({
    mutationFn: (file: File) => mediaService.uploadMedia(file),
  });
};

// Hook to delete media
export const useDeleteMedia = () => {
  return useMutation({
    mutationFn: (publicId: string) => mediaService.deleteMedia(publicId),
  });
};
