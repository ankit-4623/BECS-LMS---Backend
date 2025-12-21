import { useMutation } from '@tanstack/react-query';
import { createOrder, verifyPayment } from '../services/order.service';

// Hook to create an order
export const useCreateOrder = () => {
  return useMutation({
    mutationFn: createOrder,
  });
};

// Hook to verify payment
export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: verifyPayment,
  });
};
