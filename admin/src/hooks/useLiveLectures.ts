import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import liveLectureService, { LiveLecture, LiveLectureFormData } from '../services/live-lecture.service';

// Hook to get live lectures by course ID
export const useLiveLectures = (courseId: string | undefined) => {
  return useQuery({
    queryKey: ['live-lectures', courseId],
    queryFn: async () => {
      if (!courseId) throw new Error('Course ID is required');
      const response = await liveLectureService.getLiveLecturesByCourse(courseId);
      return Array.isArray(response.data) ? response.data : [response.data];
    },
    enabled: !!courseId,
  });
};

// Hook to create a new live lecture
export const useCreateLiveLecture = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: LiveLectureFormData) => liveLectureService.createLiveLecture(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['live-lectures', variables.courseId] });
    },
  });
};

// Hook to delete a live lecture
export const useDeleteLiveLecture = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, courseId }: { id: string; courseId: string }) => 
      liveLectureService.deleteLiveLecture(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['live-lectures', variables.courseId] });
    },
  });
};

export type { LiveLecture, LiveLectureFormData };
