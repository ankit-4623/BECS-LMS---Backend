import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllIndependentNotes,
  getNoteDetails,
  checkNotePurchase,
  getPurchasedNotes,
  createNoteOrder,
  verifyNotePayment,
} from '../services/note.service';

// Hook to get all independent notes
export const useIndependentNotes = (filters?: {
  category?: string;
  level?: string;
  sortBy?: string;
}) => {
  return useQuery({
    queryKey: ['independentNotes', filters],
    queryFn: () => getAllIndependentNotes(filters),
    select: (data) => data.data,
  });
};

// Hook to get note details
export const useNoteDetails = (noteId: string) => {
  return useQuery({
    queryKey: ['noteDetails', noteId],
    queryFn: () => getNoteDetails(noteId),
    select: (data) => data.data,
    enabled: !!noteId,
  });
};

// Hook to check if note is purchased
export const useCheckNotePurchase = (noteId: string, studentId?: string) => {
  return useQuery({
    queryKey: ['checkNotePurchase', noteId, studentId],
    queryFn: () => checkNotePurchase(noteId, studentId!),
    select: (data) => data.data,
    enabled: !!noteId && !!studentId,
  });
};

// Hook to get purchased notes
export const usePurchasedNotes = (studentId?: string) => {
  return useQuery({
    queryKey: ['purchasedNotes', studentId],
    queryFn: () => getPurchasedNotes(studentId!),
    select: (data) => data.data,
    enabled: !!studentId,
  });
};

// Hook to create note order
export const useCreateNoteOrder = () => {
  return useMutation({
    mutationFn: (data: { noteId: string }) => createNoteOrder(data),
  });
};

// Hook to verify note payment
export const useVerifyNotePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyNotePayment,
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['purchasedNotes'] });
      queryClient.invalidateQueries({ queryKey: ['checkNotePurchase'] });
    },
  });
};
