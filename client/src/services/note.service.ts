import api from '../lib/api';
import type { ApiResponse } from '../lib/api';

// ============ NOTE TYPES ============
export interface StudyNote {
  _id: string;
  courseId?: string;
  title: string;
  description?: string;
  chapterName?: string;
  lectureNumber?: number;
  driveLink: string;
  instructorId: string;
  isPublished: boolean;
  isIndependent: boolean;
  pricing: number;
  category?: string;
  level?: string;
  image?: {
    url: string;
    public_id: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateNoteOrderResponse {
  noteId: string;
  razorpayOrderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
  noteTitle?: string;
  isFree?: boolean;
}

export interface VerifyNotePaymentResponse {
  success: boolean;
  message: string;
  noteId?: string;
}

// ============ NOTE SERVICES ============

// Get all independent notes (for browsing)
export const getAllIndependentNotes = async (filters?: {
  category?: string;
  level?: string;
  sortBy?: string;
}): Promise<ApiResponse<StudyNote[]>> => {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.level) params.append('level', filters.level);
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  
  const response = await api.get<ApiResponse<StudyNote[]>>(
    `/student/notes/get?${params.toString()}`
  );
  return response.data;
};

// Get note details
export const getNoteDetails = async (noteId: string): Promise<ApiResponse<StudyNote>> => {
  const response = await api.get<ApiResponse<StudyNote>>(
    `/student/notes/details/${noteId}`
  );
  return response.data;
};

// Check if note is purchased
export const checkNotePurchase = async (
  noteId: string,
  studentId: string
): Promise<ApiResponse<boolean>> => {
  const response = await api.get<ApiResponse<boolean>>(
    `/student/notes/check-purchase/${noteId}/${studentId}`
  );
  return response.data;
};

// Get purchased notes
export const getPurchasedNotes = async (studentId: string): Promise<ApiResponse<StudyNote[]>> => {
  const response = await api.get<ApiResponse<StudyNote[]>>(
    `/student/notes/purchased/${studentId}`
  );
  return response.data;
};

// Create note order
export const createNoteOrder = async (data: {
  noteId: string;
}): Promise<ApiResponse<CreateNoteOrderResponse>> => {
  const response = await api.post<ApiResponse<CreateNoteOrderResponse>>(
    '/student/notes/order/create',
    data
  );
  return response.data;
};

// Verify note payment
export const verifyNotePayment = async (data: {
  noteId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<ApiResponse<VerifyNotePaymentResponse>> => {
  const response = await api.post<ApiResponse<VerifyNotePaymentResponse>>(
    '/student/notes/order/verify',
    data
  );
  return response.data;
};
