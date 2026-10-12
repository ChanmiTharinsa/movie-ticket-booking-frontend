import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/api";
import type { Movie, Show, Theatre } from "../types/models";

export default function ShowsPage() {
  const { movieId } = useParams();
  const [shows, setShows] = useState<Show[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get<Show[]>("/shows"),
      api.get<Theatre[]>("/theatres"),
      api.get<Movie[]>("/movies"),
    ])
      .then(([s, t, m]) => {
        setShows(s.data.filter((x) => x.movieId === movieId));
        setTheatres(t.data);
        setMovie(m.data.find((x) => x.movieId === movieId) ?? null);
      })
      .catch(() => setError("Could not load shows. Please try again."))
      .finally(() => setLoading(false));
  }, [movieId]);

  const theatreName = (id: string) =>
    theatres.find((t) => t.theatreId === id)?.name ?? id;

  if (loading) return <p className="page">Loading shows...</p>;
  if (error) return <p className="page error">{error}</p>;

  return (
    <div className="page">
      <h2>Shows for {movie?.title ?? "this movie"}</h2>
      {shows.length === 0 && <p>No shows scheduled yet.</p>}
      <div className="grid">
        {shows.map((s) => (
          <div className="card" key={s.showId}>
            <h3>{theatreName(s.theatreId)}</h3>
            <p>{s.showDate} at {s.showTime}</p>
            <p>Rs. {s.ticketPrice} per ticket</p>
            <Link className="btn-link" to={`/book/${s.showId}`}>Book Seats</Link>
          </div>
        ))}
      </div>
    </div>
  );
}