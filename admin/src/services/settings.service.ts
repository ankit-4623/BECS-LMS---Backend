import api from './api';
import type { DashboardStats } from '../lib/schemas';

export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
}

export const settingsService = {
  getDashboardStats: async (): Promise<DashboardStatsResponse> => {
    const response = await api.get<DashboardStatsResponse>('/instructor/settings/stats');
    return response.data;
  },
};

export type { DashboardStats };
export default settingsService;
