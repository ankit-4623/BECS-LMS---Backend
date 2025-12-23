import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import studyNoteService from '../services/study-note.service';
import type { StudyNote, StudyNoteFormData } from '../lib/schemas';

// Hook to get all study notes
export const useStudyNotes = () => {
  return useQuery({
    queryKey: ['study-notes'],
    queryFn: async () => {
      const response = await studyNoteService.getAllStudyNotes();
      return response.data;
    },
  });
};

// Hook to get study notes by course ID
export const useStudyNotesByCourse = (courseId: string | undefined) => {
  return useQuery({
    queryKey: ['study-notes', 'course', courseId],
    queryFn: async () => {
      if (!courseId) throw new Error('Course ID is required');
      const response = await studyNoteService.getStudyNotesByCourse(courseId);
      return response.data;
    },
    enabled: !!courseId,
  });
};

// Hook to get a single study note by ID
export const useStudyNote = (id: string | undefined) => {
  return useQuery({
    queryKey: ['study-note', id],
    queryFn: async () => {
      if (!id) throw new Error('Study Note ID is required');
      const response = await studyNoteService.getStudyNoteById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

// Hook to create a new study note
export const useCreateStudyNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: StudyNoteFormData) => studyNoteService.createStudyNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-notes'] });
    },
  });
};

// Hook to update a study note
export const useUpdateStudyNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StudyNoteFormData> }) => 
      studyNoteService.updateStudyNote(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['study-notes'] });
      queryClient.invalidateQueries({ queryKey: ['study-note', variables.id] });
    },
  });
};

// Hook to delete a study note
export const useDeleteStudyNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => studyNoteService.deleteStudyNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-notes'] });
    },
  });
};

export type { StudyNote, StudyNoteFormData };
