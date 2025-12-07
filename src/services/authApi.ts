import apiClient from './apiClient';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// 토큰 키를 일관되게 처리하기 위한 헬퍼
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
		// 저장 형식은 기존 코드에 맞춰 둘 다 넣음
		localStorage.setItem('accessToken', accessToken);
		localStorage.setItem('access_token', accessToken);
		const existing = JSON.parse(localStorage.getItem('authTokens') || 'null') || {};
		existing.accessToken = accessToken;
		if (refreshToken) {
			localStorage.setItem('refreshToken', refreshToken);
			localStorage.setItem('refresh_token', refreshToken);
			existing.refreshToken = refreshToken;
		}
		localStorage.setItem('authTokens', JSON.stringify(existing));
	} catch (e) {
		console.error('[authApi] saveTokens error', e);
	}
}

function clearTokens() {
	if (typeof window === 'undefined') return;
	try {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('access_token');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('refresh_token');
		localStorage.removeItem('authTokens');
	} catch (e) {
		/* ignore */
	}
}

/**
 * refreshAccessToken
 * 백엔드에 refresh token을 전달해 access token을 재발급 받습니다.
 * 반환값: 성공 여부
 */
export async function refreshAccessToken(): Promise<boolean> {
	const refreshToken = getRefreshToken();
	if (!refreshToken) return false;

	try {
		const resp = await apiClient.post('/auth/refresh', { refreshToken });
		const data = resp.data;
		if (data?.accessToken) {
			saveTokens(data.accessToken, data.refreshToken || refreshToken);
			return true;
		}
		return false;
	} catch (e) {
		console.error('[authApi] refreshAccessToken failed', e);
		clearTokens();
		return false;
	}
}

/**
 * authorizedRequest
 * - 기본적으로 local에 저장된 access token을 Authorization 헤더에 넣음
 * - 401 응답(토큰 만료) 시 refresh 시도 후 한 번 재시도
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

	// 요청 실행 함수
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
		const response = await makeRequest();
		return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		// 401 처리: 토큰 만료 등
		const status = err?.response?.status;
		const body = err?.response?.data;

		if (status === 401) {
			// 서버에서 error code를 제공하면 검사 가능 (예: 'tokenExpired')
			const errorCode = typeof body === 'object' ? (body.error || body.code) : null;
			const isTokenExpired =
				!errorCode || // 서버가 코드를 주지 않으면 401은 대개 만료/인증 문제
				/token/i.test(String(errorCode));

			if (isTokenExpired) {
				const refreshed = await refreshAccessToken();
				if (refreshed) {
					// 토큰 재발급 성공 시 원래 요청 재시도
					return makeRequest();
				}
				// refresh 실패 -> 로그아웃 처리
				clearTokens();
				if (typeof window !== 'undefined') window.location.href = '/login';
				throw err;
			}
		}

		// 이외의 에러는 상위로 전달
		throw err;
	}
}

// [수정] 객체를 변수에 할당한 후 export default로 내보내기
const authApi = { authorizedRequest, refreshAccessToken };
export default authApi;