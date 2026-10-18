import React, { useState, useEffect } from 'react';

function Movies() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    // Replace this string with your actual TMDB API Key (v3)
    const API_KEY = '751cd125fb14f3e1b6cfa0fad013c7a3';

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
                );
                const data = await response.json();
                // Store the array of movie objects returned by TMDB
                setMovies(data.results || []);
            } catch (error) {
                console.error('Error fetching data from TMDB API:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [API_KEY]);

    return (
        <div className="page-container" style={{ padding: '2rem', color: '#fff' }}>
            <h1>Popular Movies</h1>
            <p>Browse popular titles retrieved dynamically from the TMDB API.</p>

            {loading ? (
                <p>Loading movies from TMDB API...</p>
            ) : (
                <div
                    className="movie-grid"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                        gap: '1.5rem',
                        marginTop: '1.5rem'
                    }}
                >
                    {movies.slice(0, 10).map((movie) => (
                        <div
                            key={movie.id}
                            className="movie-card"
                            style={{
                                background: '#1f1f1f',
                                border: '1px solid #333',
                                padding: '1rem',
                                borderRadius: '8px',
                                textAlign: 'center'
                            }}
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                alt={movie.title}
                                style={{ width: '100%', borderRadius: '6px', height: '260px', objectFit: 'cover' }}
                            />
                            <h3 style={{ fontSize: '1rem', margin: '0.75rem 0 0.25rem', color: '#fff' }}>{movie.title}</h3>
                            <p style={{ color: '#e50914', fontWeight: 'bold', fontSize: '0.9rem', margin: 0 }}>
                                Rating: ⭐ {movie.vote_average}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Movies;