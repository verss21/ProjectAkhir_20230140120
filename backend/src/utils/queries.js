// Gunakan module.exports karena kita pakai CommonJS di backend
const GET_POPULAR_ANIME = `
  query ($page: Int, $perPage: Int) {
    Page (page: $page, perPage: $perPage) {
      media (sort: POPULARITY_DESC, type: ANIME) {
        id
        title {
          romaji
        }
        coverImage {
          large
        }
      }
    }
  }
`;

const GET_ANIME_DETAIL = `
  query ($id: Int) {
    Media (id: $id, type: ANIME) {
      id
      title {
        romaji
        english
      }
      coverImage {
        large
      }
      description
      bannerImage
      genres
      averageScore
      trailer {
        id
        site
      }
    }
  }
`;

module.exports = {
  GET_POPULAR_ANIME,
  GET_ANIME_DETAIL
};