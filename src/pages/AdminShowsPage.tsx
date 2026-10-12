import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import api from "../api/api";
import type { Movie, Theatre, Show } from "../types/models";

export default function AdminShowsPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [movieId, setMovieId] = useState("");
  const [theatreId, setTheatreId] = useState("");
  const [showDate, setShowDate] = useState("");
  const [showTime, setShowTime] = useState("");
  const [ticketPrice, setTicketPrice] = useState(1000);

  const loadShows = () => {
    api.get<Show[]>("/shows").then((res) => setShows(res.data));
  };

  useEffect(() => {
    api.get<Movie[]>("/movies").then((res) => setMovies(res.data));
    api.get<Theatre[]>("/theatres").then((res) => setTheatres(res.data));
    loadShows();
  }, []);

  const movieTitle = (id: string) =>
    movies.find((m) => m.movieId === id)?.title ?? id;
  const theatreName = (id: string) =>
    theatres.find((t) => t.theatreId === id)?.name ?? id;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await api.post("/shows", {
        movieId, theatreId, showDate, showTime, ticketPrice,
      });
      setMessage("Show added.");
      loadShows();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      setError(msg ?? "Could not add the show.");
    }
  };

  return (
    <div className="page">
      <h2>Manage Shows</h2>
      {message && <p>{message}</p>}
      {error && <div className="error-box">{error}</div>}
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Movie</label>
          <select value={movieId} required onChange={(e) => setMovieId(e.target.value)}>
            <option value="">-- choose a movie --</option>
            {movies.map((m) => (
              <option key={m.movieId} value={m.movieId}>{m.title}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Theatre</label>
          <select value={theatreId} required onChange={(e) => setTheatreId(e.target.value)}>
            <option value="">-- choose a theatre --</option>
            {theatres.map((t) => (
              <option key={t.theatreId} value={t.theatreId}>{t.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Show Date</label>
          <input type="date" value={showDate} required onChange={(e) => setShowDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Show Time</label>
          <input type="time" value={showTime} required onChange={(e) => setShowTime(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Ticket Price</label>
          <input type="number" min={1} value={ticketPrice} required
            onChange={(e) => setTicketPrice(Number(e.target.value))} />
        </div>
        <button className="btn" type="submit">Add Show</button>
      </form>

      <h3>Existing shows ({shows.length})</h3>
      <ul>
        {shows.map((s) => (
          <li key={s.showId}>
            {movieTitle(s.movieId)} at {theatreName(s.theatreId)} on {s.showDate} {s.showTime} (Rs. {s.ticketPrice})
          </li>
        ))}
      </ul>
    </div>
  );
}