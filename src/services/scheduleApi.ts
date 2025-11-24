import axios from 'axios';

export async function fetchScheduleByDate(date: string) {
	const response = await axios.get(`/api/schedule?date=${date}`);
	return response.data;
}

