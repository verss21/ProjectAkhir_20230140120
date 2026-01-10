const axios = require('axios');

const fetchFromAniList = async (query, variables) => {
  try {
    const response = await axios({
      url: 'https://graphql.anilist.co',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Jika pakai token: 'Authorization': `Bearer ${process.env.ANILIST_TOKEN}`
      },
      data: {
        query: query,
        variables: variables,
      },
    });

    return response.data;
  } catch (error) {
    // Ini akan memunculkan error detail di terminal backend
    console.error('AniList API Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = { fetchFromAniList };