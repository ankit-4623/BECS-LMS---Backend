import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import liveLectureService from '../services/live-lecture.service';
import type { LiveLecture, LiveLectureFormData } from '../lib/schemas';

// Hook to get all live lectures
export const useLiveLectures = () => {
  return useQuery({
    queryKey: ['live-lectures'],
    queryFn: async () => {
      const response = await liveLectureService.getAllLiveLectures();
      return response.data;
    },
  });
};

// Hook to get live lectures by course ID
export const useLiveLecturesByCourse = (courseId: string | undefined) => {
  return useQuery({
    queryKey: ['live-lectures', 'course', courseId],
    queryFn: async () => {
      if (!courseId) throw new Error('Course ID is required');
      const response = await liveLectureService.getLiveLecturesByCourse(courseId);
      return response.data;
    },
    enabled: !!courseId,
  });
};

// Hook to create a new live lecture
export const useCreateLiveLecture = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: LiveLectureFormData) => liveLectureService.createLiveLecture(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['live-lectures'] });
    },
  });
};

// Hook to update a live lecture
export const useUpdateLiveLecture = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LiveLectureFormData> }) => 
      liveLectureService.updateLiveLecture(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['live-lectures'] });
    },
  });
};

// Hook to update live lecture status
export const useUpdateLiveLectureStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      liveLectureService.updateLiveLectureStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['live-lectures'] });
    },
  });
};

// Hook to delete a live lecture
export const useDeleteLiveLecture = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => liveLectureService.deleteLiveLecture(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['live-lectures'] });
    },
  });
};

export type { LiveLecture, LiveLectureFormData };
