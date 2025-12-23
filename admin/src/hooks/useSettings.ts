import { useQuery } from '@tanstack/react-query';
import settingsService from '../services/settings.service';
import type { DashboardStats } from '../lib/schemas';

// Hook to get dashboard stats
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await settingsService.getDashboardStats();
      return response.data;
    },
  });
};

export type { DashboardStats };
