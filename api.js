// api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const registerUser = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, data);
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

export const authenticateUser = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/verify`, data);
        return response.data;
    } catch (error) {
        console.error('Error authenticating user:', error);
        throw error;
    }
};
