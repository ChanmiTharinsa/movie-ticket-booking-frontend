import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import api from "../api/api";
import type { Movie } from "../types/models";

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(120);
  const [language, setLanguage] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [status, setStatus] = useState("NOW_SHOWING");

  const loadMovies = () => {
    api.get<Movie[]>("/movies").then((res) => setMovies(res.data));
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await api.post("/movies", {
        title, description, durationMinutes, language, genre, releaseDate, status,
      });
      setMessage("Movie added.");
      setTitle(""); setDescription(""); setLanguage(""); setGenre("");
      loadMovies();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      setError(msg ?? "Could not add the movie.");
    }
  };

  return (
    <div className="page">
      <h2>Manage Movies</h2>
      {message && <p>{message}</p>}
      {error && <div className="error-box">{error}</div>}
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input value={title} required onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Duration (minutes)</label>
          <input type="number" min={1} value={durationMinutes} required
            onChange={(e) => setDurationMinutes(Number(e.target.value))} />
        </div>
        <div className="form-group">
          <label>Language</label>
          <input value={language} onChange={(e) => setLanguage(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Genre</label>
          <input value={genre} onChange={(e) => setGenre(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Release Date</label>
          <input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="UPCOMING">UPCOMING</option>
            <option value="NOW_SHOWING">NOW_SHOWING</option>
            <option value="ENDED">ENDED</option>
          </select>
        </div>
        <button className="btn" type="submit">Add Movie</button>
      </form>

      <h3>Existing movies ({movies.length})</h3>
      <ul>
        {movies.map((m) => (
          <li key={m.movieId}>{m.title} ({m.status})</li>
        ))}
      </ul>
    </div>
  );
}