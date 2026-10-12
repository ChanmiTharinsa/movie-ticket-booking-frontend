import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import api from "../api/api";
import type { Theatre } from "../types/models";

export default function AdminTheatresPage() {
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState(50);
  const [status, setStatus] = useState("ACTIVE");

  const loadTheatres = () => {
    api.get<Theatre[]>("/theatres").then((res) => setTheatres(res.data));
  };

  useEffect(() => {
    loadTheatres();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await api.post("/theatres", { name, location, capacity, status });
      setMessage("Theatre added.");
      setName("");
      setLocation("");
      loadTheatres();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      setError(msg ?? "Could not add the theatre.");
    }
  };

  return (
    <div className="page">
      <h2>Manage Theatres</h2>
      {message && <p>{message}</p>}
      {error && <div className="error-box">{error}</div>}
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input value={name} required onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Capacity</label>
          <input type="number" min={1} value={capacity} required
            onChange={(e) => setCapacity(Number(e.target.value))} />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
        <button className="btn" type="submit">Add Theatre</button>
      </form>

      <h3>Existing theatres ({theatres.length})</h3>
      <ul>
        {theatres.map((t) => (
          <li key={t.theatreId}>
            {t.name} - {t.location} ({t.status})
          </li>
        ))}
      </ul>
    </div>
  );
}