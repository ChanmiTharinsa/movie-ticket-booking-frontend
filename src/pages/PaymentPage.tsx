import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/api";
import type { Booking, Payment } from "../types/models";

export default function PaymentPage() {
  const { bookingId } = useParams();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [method, setMethod] = useState("CARD");
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Payment | null>(null);

  useEffect(() => {
    api
      .get<Booking>(`/bookings/${bookingId}`)
      .then((res) => setBooking(res.data))
      .catch(() => setError("Could not load the booking."))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handlePay = async () => {
    setError("");
    setResult(null);
    setPaying(true);
    try {
      const res = await api.post<Payment>("/payments", {
        bookingId,
        method,
        simulateFailure,
      });
      setResult(res.data);
      if (res.data.status === "FAILED") {
        setError("Payment failed. Your booking is still saved, so you can try again.");
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      setError(msg ?? "Payment could not be processed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <p className="page">Loading...</p>;
  if (!booking) return <p className="page error">{error || "Booking not found."}</p>;

  const paid = result?.status === "COMPLETED";

  return (
    <div className="page">
      <h2>Payment</h2>
      <div className="card">
        <p>Booking: {booking.bookingId}</p>
        <p>Seats: {booking.seatNumbers.join(", ")}</p>
        <p className="total">Amount: Rs. {booking.totalAmount}</p>
        <span className={`badge ${booking.status.toLowerCase()}`}>{booking.status}</span>
      </div>

      {error && <div className="error-box">{error}</div>}

      {paid ? (
        <div className="success-box">
          <p>Payment successful. Your booking is confirmed.</p>
          <Link className="btn-link" to="/my-bookings">View My Bookings</Link>
        </div>
      ) : booking.status === "CANCELLED" ? (
        <p className="error">This booking is cancelled and cannot be paid.</p>
      ) : (
        <div className="auth-card">
          <div className="form-group">
            <label>Payment Method</label>
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="CARD">CARD</option>
              <option value="CASH">CASH</option>
              <option value="ONLINE">ONLINE</option>
            </select>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={simulateFailure}
                onChange={(e) => setSimulateFailure(e.target.checked)}
              />{" "}
              Simulate a failed payment (demo only)
            </label>
          </div>
          <button className="btn" disabled={paying} onClick={handlePay}>
            {paying ? "Processing..." : `Pay Rs. ${booking.totalAmount}`}
          </button>
        </div>
      )}
    </div>
  );
}