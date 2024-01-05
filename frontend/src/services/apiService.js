// frontend/src/services/apiService.js

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/jobs';

export const submitJobApplication = async (jobData) => {
    try {
        const response = await axios.post(API_URL, jobData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTodaysJobCount = async () => {
    try {
        const response = await axios.get(`${API_URL}/countToday`);
        return response.data.count;
    } catch (error) {
        throw error;
    }
};

export const getJobsAppliedToday = async () => {
    try {
        const response = await axios.get(`${API_URL}/today`);
        return response.data; // Assuming this returns an array of job objects
    } catch (error) {
        throw error;
    }
};

export const getTotalJobCount = async () => {
    try {
        const response = await axios.get(`${API_URL}/total`);
        return response.data.total; // Assuming this returns the total count
    } catch (error) {
        throw error;
    }
};

export const getThisWeekJobCount = async () => {
    try {
        const response = await axios.get(`${API_URL}/week`);
        return response.data.week;
    } catch (error) {
        throw error;
    }
};