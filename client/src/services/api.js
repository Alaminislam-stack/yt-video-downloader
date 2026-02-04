import axios from 'axios';

// Replace with your local machine's IP address if testing on a physical device
const BASE_URL = 'http://192.168.0.103:4522/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getVideoInfo = async (youtubeUrl) => {
    try {
        const response = await api.post('/get', { url: youtubeUrl });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Unknown error occurred';
        console.error('Error fetching video info:', message);
        throw new Error(message);
    }
};

export default api;
