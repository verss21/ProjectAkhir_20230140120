const axios = require('axios');

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

/**
 * Fetch data from Jikan API with basic retry logic for 429 (Rate Limit)
 */
const fetchFromJikan = async (endpoint, params = {}, retries = 3, delay = 1000) => {
    const url = `${JIKAN_BASE_URL}${endpoint}`;

    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.get(url, { params });
            return response.data;
        } catch (error) {
            if (error.response?.status === 429 && i < retries - 1) {
                console.warn(`Jikan API Rate Limited (429). Retrying in ${delay * (i + 1)}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
                continue;
            }
            console.error('Jikan API Error:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
};

module.exports = { fetchFromJikan };
