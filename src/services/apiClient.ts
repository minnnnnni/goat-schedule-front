/**
 * API 클라이언트 설정
 * Axios를 사용하여 모든 API 요청의 공통 설정 관리
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type { ApiError } from '@/types/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/**
 * 요청 인터셉터: 토큰 자동 추가
 */
apiClient.interceptors.request.use(
  (config) => {
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    // 개발용: 요청 로그 (URL / method / headers 일부)
    try {
      // avoid printing full headers in prod
      console.debug('[apiClient] request ->', config.method, config.url, {
        headers: {
          Authorization: config.headers?.Authorization,
          'Content-Type': config.headers?.['Content-Type'],
        },
      });
    } catch (e) {
      /* ignore logging errors */
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 응답 인터셉터: 에러 처리
 */
apiClient.interceptors.response.use(
  (response) => {
    try {
      console.debug('[apiClient] response <-', response.config.method, response.config.url, {
        status: response.status,
        // Log CORS-related headers to inspect server behavior
        headers: {
          'access-control-allow-origin': response.headers['access-control-allow-origin'],
          'access-control-allow-credentials': response.headers['access-control-allow-credentials'],
        },
      });
    } catch (e) {
      /* ignore */
    }
    return response;
  },
  (error: AxiosError<ApiError>) => {
    try {
      console.error('[apiClient] response error', {
        url: error.config?.url,
        method: error.config?.method,
        // network-level info
        message: error.message,
        status: error.response?.status,
        responseHeaders: error.response?.headers,
        request: !!error.request,
      });
    } catch (e) {
      /* ignore */
    }

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

