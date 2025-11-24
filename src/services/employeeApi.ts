import axios from 'axios';

export async function fetchEmployees() {
	const response = await axios.get('/api/employees');
	return response.data;
}

