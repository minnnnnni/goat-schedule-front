/**
 * API 클라이언트 설정
 * Axios를 사용하여 모든 API 요청의 공통 설정 관리
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type { ApiError } from '@/types/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 요청 인터셉터: 토큰 자동 추가
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 응답 인터셉터: 에러 처리
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // 토큰 만료 또는 인증 실패
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }

    if (error.response?.status === 403) {
      // 권한 없음
      console.error('Permission denied');
    }

    if (error.response?.status === 500) {
      // 서버 에러
      console.error('Server error');
    }

    return Promise.reject(error);
  }
);

export default apiClient; 

