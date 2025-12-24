import api from '../lib/api';
import type { ApiResponse } from '../lib/api';

// ============ ORDER/PAYMENT SERVICES ============

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  razorpayOrderId: string;
  keyId: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
}

// Create order - backend handles fetching user and course details
export const createOrder = async (data: {
  courseId: string;
}): Promise<ApiResponse<CreateOrderResponse>> => {
  const response = await api.post<ApiResponse<CreateOrderResponse>>(
    '/student/order/create',
    data
  );
  return response.data;
};

// Verify payment (Razorpay)
export const verifyPayment = async (data: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<ApiResponse<VerifyPaymentResponse>> => {
  const response = await api.post<ApiResponse<VerifyPaymentResponse>>(
    '/student/order/verify',
    data
  );
  return response.data;
};
