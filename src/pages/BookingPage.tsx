import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import type { Booking, Movie, Show, Theatre } from "../types/models";

export default function BookingPage() {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState<Show | null>(null);
  const [theatre, setTheatre] = useState<Theatre | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get<Show[]>("/shows"),
      api.get<Theatre[]>("/theatres"),
      api.get<Movie[]>("/movies"),
    ])
      .then(([s, t, m]) => {
        const found = s.data.find((x) => x.showId === showId) ?? null;
        setShow(found);
        setTheatre(t.data.find((x) => x.theatreId === found?.theatreId) ?? null);
        setMovie(m.data.find((x) => x.movieId === found?.movieId) ?? null);
      })
      .catch(() => setError("Could not load the show. Please try again."))
      .finally(() => setLoading(false));
  }, [showId]);

  const capacity = theatre?.capacity ?? 0;
  const seats = Array.from({ length: capacity }, (_, i) =>
    `${String.fromCharCode(65 + Math.floor(i / 10))}${(i % 10) + 1}`
  );

  const toggleSeat = (seat: string) => {
    setSelected((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const total = show ? selected.length * Number(show.ticketPrice) : 0;

  const handleBook = async () => {
    if (!show || selected.length === 0) return;
    setError("");
    setSaving(true);
    try {
      const res = await api.post<Booking>("/bookings", {
        showId: show.showId,
        seatNumbers: selected,
        numberOfTickets: selected.length,
      });
      navigate(`/payment/${res.data.bookingId}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      setError(msg ?? "Could not create the booking. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="page">Loading...</p>;
  if (!show) return <p className="page error">{error || "Show not found."}</p>;

  return (
    <div className="page">
      <h2>{movie?.title ?? "Book seats"}</h2>
      <p>
        {theatre?.name} · {show.showDate} at {show.showTime} · Rs. {show.ticketPrice} per ticket
      </p>
      {error && <div className="error-box">{error}</div>}

      <h3>Choose your seats</h3>
      <div className="seat-grid">
        {seats.map((seat) => (
          <button
            key={seat}
            type="button"
            className={selected.includes(seat) ? "seat selected" : "seat"}
            onClick={() => toggleSeat(seat)}
          >
            {seat}
          </button>
        ))}
      </div>

      <p className="total">
        {selected.length} seat(s) selected: {selected.join(", ") || "none"}
        <br />
        Total: Rs. {total}
      </p>

      <button
        className="btn"
        disabled={selected.length === 0 || saving}
        onClick={handleBook}
      >
        {saving ? "Booking..." : "Confirm Booking"}
      </button>
    </div>
  );
}