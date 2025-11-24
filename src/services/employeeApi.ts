import axios from 'axios';

export interface Employee {
	id: number;
	name: string;
	phone: string;
	email: string;
	maxWeeklyHours: number;
}

// GET /api/stores/{storeId}/employees/{employeeId}
export async function getEmployee(storeId: number, employeeId: number): Promise<Employee> {
	const response = await axios.get(`/api/stores/${storeId}/employees/${employeeId}`);
	return response.data;
}

// GET /api/stores/{storeId}/employees
export async function getEmployees(storeId: number): Promise<Employee[]> {
	const response = await axios.get(`/api/stores/${storeId}/employees`);
	return response.data;
}

// POST /api/stores/{storeId}/employees
export async function addEmployee(storeId: number, employee: Omit<Employee, 'id'>): Promise<Employee> {
	const response = await axios.post(`/api/stores/${storeId}/employees`, employee);
	return response.data;
}

// PUT /api/stores/{storeId}/employees/{employeeId}
export async function updateEmployee(storeId: number, employeeId: number, employee: Employee): Promise<Employee> {
	const response = await axios.put(`/api/stores/${storeId}/employees/${employeeId}`, employee);
	return response.data;
}

// DELETE /api/stores/{storeId}/employees/{employeeId}
export async function deleteEmployee(storeId: number, employeeId: number): Promise<void> {
	await axios.delete(`/api/stores/${storeId}/employees/${employeeId}`);
}

