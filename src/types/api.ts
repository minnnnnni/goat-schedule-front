/**
 * API 응답 기본 형식
 */
export type ApiResponse<T> = {
  data: T;
  error?: string;
  message?: string;
};

/**
 * API 에러 응답
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * 페이지네이션 응답
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

