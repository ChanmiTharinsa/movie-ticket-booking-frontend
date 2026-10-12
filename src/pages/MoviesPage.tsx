import { useEffect, useState } from "react";
import api from "../api/api";
import type { Movie } from "../types/models";

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<Movie[]>("/movies")
      .then((res) => setMovies(res.data))
      .catch(() => setError("Could not load movies. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="page">Loading movies...</p>;
  if (error) return <p className="page error">{error}</p>;

  return (
    <div className="page">
      <h2>Now Showing</h2>
      {movies.length === 0 && <p>No movies available yet.</p>}
      <div className="grid">
        {movies.map((m) => (
          <div className="card" key={m.movieId}>
            <h3>{m.title}</h3>
            <p>{m.genre} · {m.language}</p>
            <p>{m.durationMinutes} min</p>
            <p>{m.description}</p>
            <span className="badge">{m.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}