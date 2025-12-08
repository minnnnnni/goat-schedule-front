import apiClient from './apiClient';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// 토큰 가져오기 헬퍼 함수
function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem('accessToken') ||
    localStorage.getItem('access_token') ||
    JSON.parse(localStorage.getItem('authTokens') || 'null')?.accessToken ||
    null
  );
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem('refreshToken') ||
    localStorage.getItem('refresh_token') ||
    JSON.parse(localStorage.getItem('authTokens') || 'null')?.refreshToken ||
    null
  );
}

function saveTokens(accessToken: string, refreshToken?: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('access_token', accessToken);
    
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('refresh_token', refreshToken);
    }
  } catch (e) {
    console.error('[authApi] saveTokens error', e);
  }
}

// [수정 1] 로그아웃 시 모든 키 확실하게 삭제
function logout() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('authTokens');
    // 최근 로그아웃 플래그를 세션 스토리지에 남겨서 바로 재로그인할 때 홈으로 리다이렉트되지 않도록 함
    sessionStorage.setItem('recentLogout', '1');
  } catch (e) {
    /* ignore */
  }
}

/**
 * refreshAccessToken
 */
export async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    // API 주소 변경됨
    const resp = await apiClient.post('/auth/refresh-token', { refreshToken });
    const data = resp.data;
    
    // 응답 구조에 따라 data.accessToken 또는 data.response.accessToken 일 수 있음 (확인 필요)
    const newAccessToken = data.accessToken || data.access_token;
    
    if (newAccessToken) {
      saveTokens(newAccessToken, data.refreshToken || data.refresh_token || refreshToken);
      return true;
    }
    return false;
  } catch (e) {
    console.error('[authApi] refreshAccessToken failed', e);
    logout(); // 갱신 실패 시 로그아웃
    return false;
  }
}

/*
 * 앱 켰을 때 토큰 유효성 확인"용 함수
 */
export async function verifyToken(): Promise<boolean> {
  const token = getAccessToken();
  if (!token) return false;

  try {
    // 백엔드 명세: /api/auth/access-token
    await apiClient.post('/auth/access-token'); 
    return true; // 에러 안 나면 유효한 토큰
  } catch (e) {
    return false; // 에러 나면 만료되거나 위조된 토큰
  }
}

/**
 * authorizedRequest
 * (기존 로직 유지: 요청 실패 시 자동 갱신 및 재시도)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function authorizedRequest<T = any>(
  endpoint: string,
  {
    method = 'GET',
    body,
    config,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }: { method?: RequestMethod; body?: any; config?: AxiosRequestConfig } = {}
): Promise<AxiosResponse<T>> {
  const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  const makeRequest = () => {
    const accessToken = getAccessToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(config?.headers || {}),
    };

    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      return apiClient.request<T>({ url, method, data: body, headers, ...config });
    }
    return apiClient.request<T>({ url, method, params: body, headers, ...config });
  };

  try {
    return await makeRequest();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const status = err?.response?.status;
    // 401 에러 발생 시 토큰 갱신 시도
    if (status === 401) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return makeRequest(); // 갱신 성공 시 재요청
      }
      logout(); // 갱신 실패 시 로그아웃
      if (typeof window !== 'undefined') window.location.href = '/login';
      throw err;
    }
    throw err;
  }
}

const authApi = { authorizedRequest, refreshAccessToken, logout, verifyToken };
export default authApi;
