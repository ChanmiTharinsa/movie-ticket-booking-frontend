import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import type { Booking, Movie, Show, Theatre } from "../types/models";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookings = () =>
    api.get<Booking[]>("/bookings/my-bookings").then((res) => setBookings(res.data));

  useEffect(() => {
    Promise.all([
      loadBookings(),
      api.get<Show[]>("/shows").then((res) => setShows(res.data)),
      api.get<Movie[]>("/movies").then((res) => setMovies(res.data)),
      api.get<Theatre[]>("/theatres").then((res) => setTheatres(res.data)),
    ])
      .catch(() => setError("Could not load your bookings. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const describeShow = (showId: string) => {
    const show = shows.find((s) => s.showId === showId);
    if (!show) return showId;
    const movie = movies.find((m) => m.movieId === show.movieId)?.title ?? "Movie";
    const theatre = theatres.find((t) => t.theatreId === show.theatreId)?.name ?? "Theatre";
    return `${movie} at ${theatre}, ${show.showDate} ${show.showTime}`;
  };

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm("Cancel this booking?")) return;
    setError("");
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      await loadBookings();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      setError(msg ?? "Could not cancel the booking.");
    }
  };

  if (loading) return <p className="page">Loading your bookings...</p>;

  return (
    <div className="page">
      <h2>My Bookings</h2>
      {error && <div className="error-box">{error}</div>}
      {bookings.length === 0 && <p>You have no bookings yet.</p>}
      <div className="grid">
        {bookings.map((b) => (
          <div className="card" key={b.bookingId}>
            <h3>{describeShow(b.showId)}</h3>
            <p>Seats: {b.seatNumbers.join(", ")}</p>
            <p>Total: Rs. {b.totalAmount}</p>
            <span className={`badge ${b.status.toLowerCase()}`}>{b.status}</span>
            <p>
              {b.status === "PENDING" && (
                <Link className="btn-link" to={`/payment/${b.bookingId}`}>Pay Now</Link>
              )}{" "}
              {b.status !== "CANCELLED" && (
                <button className="btn-danger" onClick={() => handleCancel(b.bookingId)}>
                  Cancel
                </button>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}