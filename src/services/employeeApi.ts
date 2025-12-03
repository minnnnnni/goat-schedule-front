import apiClient from './apiClient';

export interface Employee {
	id: number;
	name: string;
	phone: string;
	email: string;
	maxWeeklyHours: number;
}

// GET /api/stores/{storeId}/employees/{employeeId}
export async function getEmployee(storeId: number, employeeId: number): Promise<Employee> {
  const response = await apiClient.get(`/stores/${storeId}/employees/${employeeId}`);
  return response.data;
}

// GET /api/stores/{storeId}/employees
export async function getEmployees(storeId: number): Promise<Employee[]> {
  const response = await apiClient.get(`/stores/${storeId}/employees`);
  return response.data;
}

// POST /api/stores/{storeId}/employees
export async function addEmployee(storeId: number, employee: Omit<Employee, 'id'>): Promise<Employee> {
  const response = await apiClient.post(`/stores/${storeId}/employees`, employee);
  return response.data;
}

// PUT /api/stores/{storeId}/employees/{employeeId}
export async function updateEmployee(storeId: number, employeeId: number, employee: Employee): Promise<Employee> {
  const response = await apiClient.put(`/stores/${storeId}/employees/${employeeId}`, employee);
  return response.data;
}

// DELETE /api/stores/{storeId}/employees/{employeeId}
export async function deleteEmployee(storeId: number, employeeId: number): Promise<void> {
  await apiClient.delete(`/stores/${storeId}/employees/${employeeId}`);
}

