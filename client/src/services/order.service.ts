import api from '../lib/api';
import type { ApiResponse } from '../lib/api';

// ============ ORDER/PAYMENT SERVICES ============

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  razorpayOrderId?: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
}

// Create order
export const createOrder = async (data: {
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseTitle: string;
  coursePricing: number;
  courseImage?: string;
  instructorId?: string;
  instructorName?: string;
}): Promise<ApiResponse<CreateOrderResponse>> => {
  const response = await api.post<ApiResponse<CreateOrderResponse>>(
    '/student/order/create',
    data
  );
  return response.data;
};

// Verify payment (Razorpay)
export const verifyPayment = async (data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
}): Promise<ApiResponse<VerifyPaymentResponse>> => {
  const response = await api.post<ApiResponse<VerifyPaymentResponse>>(
    '/student/order/verify',
    data
  );
  return response.data;
};
