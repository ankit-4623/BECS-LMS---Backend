import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder, verifyPayment } from '../services/order.service';

// Hook to create an order
export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (data: { courseId: string }) => createOrder(data),
  });
};

// Hook to verify payment
export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: verifyPayment,
    onSuccess: () => {
      // Invalidate purchased courses query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['purchasedCourses'] });
      queryClient.invalidateQueries({ queryKey: ['checkPurchase'] });
    },
  });
};
