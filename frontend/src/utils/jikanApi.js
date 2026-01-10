import axios from 'axios';

const fetchWithRetry = async (url, retries = 5, delay = 1500) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await axios.get(url);
        } catch (err) {
            if (err.response?.status === 429 && i < retries - 1) {
                console.warn(`Jikan API Busy (429). Retrying in ${delay * (i + 1)}ms...`);
                await new Promise(res => setTimeout(res, delay * (i + 1)));
                continue;
            }
            throw err;
        }
    }
};

export default fetchWithRetry;
