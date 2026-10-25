import React, { useState, useEffect } from 'react';

function Movies() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load the TMDB API Key from environment variables
    const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
                );
                if (!response.ok) {
                    throw new Error(`TMDB API request failed with status ${response.status}`);
                }
                const data = await response.json();
                // Store the array of movie objects returned by TMDB
                setMovies(data.results || []);
            } catch (error) {
                console.error('Error fetching data from TMDB API:', error);
                setError('Failed to load movies. Please check your connection or API key.');
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
            ) : error ? (
                <div style={{ color: '#e50914', textAlign: 'center', marginTop: '2rem' }}>
                    <p>{error}</p>
                    <button
                        onClick={() => {
                            setError(null);
                            setLoading(true);
                            window.location.reload();
                        }}
                        style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    >
                        Retry
                    </button>
                </div>
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
                            {movie.poster_path ? (
                                <img
                                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                    alt={movie.title}
                                    style={{ width: '100%', borderRadius: '6px', height: '260px', objectFit: 'cover' }}
                                />
                            ) : (
                                <div
                                    style={{ width: '100%', borderRadius: '6px', height: '260px', objectFit: 'cover', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}
                                >
                                    No Image
                                </div>
                            )}
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