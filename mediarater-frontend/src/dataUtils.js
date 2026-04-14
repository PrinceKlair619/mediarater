export function bayesianAverage(ratings, m = 2, C = 3) {
    const n = ratings.length
    const sum = ratings.reduce((a, r) => a + r, 0)
    return (m * C + sum) / (m + n)
  }
  
  export function averageRating(ratings) {
    if (!ratings.length) return 0
    return ratings.reduce((a, r) => a + r, 0) / ratings.length
  }
  
  // Format: songID,artist,title,reviewerID,rating
  export function parseSongRatings(csvText) {
    const songMap = new Map()
    for (const line of csvText.trim().split('\n')) {
      const parts = line.split(',')
      if (parts.length < 5) continue
      const [songID, artist, title, reviewerID, ratingStr] = parts
      const rating = parseInt(ratingStr, 10)
      if (isNaN(rating) || rating < 1 || rating > 5) continue
      if (!songMap.has(songID)) {
        songMap.set(songID, { id: songID, title: title.trim(), artist: artist.trim(), ratings: [] })
      }
      const song = songMap.get(songID)
      if (!song.ratings.find(r => r.reviewer === reviewerID)) {
        song.ratings.push({ reviewer: reviewerID, value: rating })
      }
    }
    return Array.from(songMap.values()).map(s => ({
      ...s,
      type: 'song',
      ratingValues: s.ratings.map(r => r.value),
      avgRating: averageRating(s.ratings.map(r => r.value)),
      bayesRating: bayesianAverage(s.ratings.map(r => r.value)),
      reviewCount: s.ratings.length,
    }))
  }
  
  // movies.csv: title,cast1,cast2,...
  // movie_ratings.csv: title,reviewerID,rating
  export function parseMovies(moviesCsv, ratingsCsv) {
    const movieMap = new Map()
    for (const line of moviesCsv.trim().split('\n')) {
      if (!line.trim()) continue
      const parts = line.split(',')
      const title = parts[0].trim()
      const cast = parts.slice(1).map(c => c.trim()).filter(Boolean)
      if (!movieMap.has(title)) {
        movieMap.set(title, { id: title, title, cast, ratings: [], type: 'movie' })
      }
    }
    for (const line of ratingsCsv.trim().split('\n')) {
      if (!line.trim()) continue
      const parts = line.split(',')
      if (parts.length < 3) continue
      const title = parts[0].trim()
      const reviewerID = parts[1].trim()
      const rating = parseInt(parts[2], 10)
      if (isNaN(rating) || rating < 1 || rating > 5) continue
      if (movieMap.has(title)) {
        const movie = movieMap.get(title)
        if (!movie.ratings.find(r => r.reviewer === reviewerID)) {
          movie.ratings.push({ reviewer: reviewerID, value: rating })
        }
      }
    }
    return Array.from(movieMap.values())
      .filter(m => m.ratings.length > 0)
      .map(m => ({
        ...m,
        ratingValues: m.ratings.map(r => r.value),
        avgRating: averageRating(m.ratings.map(r => r.value)),
        bayesRating: bayesianAverage(m.ratings.map(r => r.value)),
        reviewCount: m.ratings.length,
      }))
  }
  
  export function buildLibrary(songs, movies) {
    return [...songs, ...movies].sort((a, b) => b.bayesRating - a.bayesRating)
  }
  
  export function topKRatables(library, k) {
    return library.slice(0, k)
  }