import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import recordedLectureService from '../services/recorded-lecture.service';
import type { RecordedLecture, RecordedLectureFormData } from '../lib/schemas';

// Hook to get all recorded lectures
export const useRecordedLectures = () => {
  return useQuery({
    queryKey: ['recorded-lectures'],
    queryFn: async () => {
      const response = await recordedLectureService.getAllRecordedLectures();
      return response.data;
    },
  });
};

// Hook to get recorded lectures by course ID
export const useRecordedLecturesByCourse = (courseId: string | undefined) => {
  return useQuery({
    queryKey: ['recorded-lectures', 'course', courseId],
    queryFn: async () => {
      if (!courseId) throw new Error('Course ID is required');
      const response = await recordedLectureService.getRecordedLecturesByCourse(courseId);
      return response.data;
    },
    enabled: !!courseId,
  });
};

// Hook to get a single recorded lecture by ID
export const useRecordedLecture = (id: string | undefined) => {
  return useQuery({
    queryKey: ['recorded-lecture', id],
    queryFn: async () => {
      if (!id) throw new Error('Recorded Lecture ID is required');
      const response = await recordedLectureService.getRecordedLectureById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

// Hook to create a new recorded lecture
export const useCreateRecordedLecture = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: RecordedLectureFormData) => recordedLectureService.createRecordedLecture(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recorded-lectures'] });
    },
  });
};

// Hook to update a recorded lecture
export const useUpdateRecordedLecture = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RecordedLectureFormData> }) => 
      recordedLectureService.updateRecordedLecture(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['recorded-lectures'] });
      queryClient.invalidateQueries({ queryKey: ['recorded-lecture', variables.id] });
    },
  });
};

// Hook to delete a recorded lecture
export const useDeleteRecordedLecture = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => recordedLectureService.deleteRecordedLecture(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recorded-lectures'] });
    },
  });
};

export type { RecordedLecture, RecordedLectureFormData };
