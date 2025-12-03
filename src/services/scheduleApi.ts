import apiClient from './apiClient';

// GET /api/stores/{storeId}/schedules?date=YYYY-MM-DD
export async function fetchScheduleByDate(storeId: number, date: string) {
  const response = await apiClient.get(`/stores/${storeId}/schedules?date=${date}`);
  return response.data;
}

