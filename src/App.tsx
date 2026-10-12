import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MoviesPage from "./pages/MoviesPage";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";
import AdminMoviesPage from "./pages/AdminMoviesPage";
import AdminShowsPage from "./pages/AdminShowsPage";
import AdminTheatresPage from "./pages/AdminTheatresPage";
import ShowsPage from "./pages/ShowsPage";
import BookingPage from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";
import MyBookingsPage from "./pages/MyBookingsPage";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MoviesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/movies"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminMoviesPage />
            </ProtectedRoute>
          }
        />
        <Route
        path="/admin/shows"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminShowsPage />
          </ProtectedRoute>
        }
        />
        <Route
        path="/admin/theatres"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminTheatresPage />
          </ProtectedRoute>
        }
        />
        <Route
        path="/movies/:movieId/shows"
        element={<ProtectedRoute><ShowsPage /></ProtectedRoute>}
        />
        <Route
        path="/book/:showId"
        element={<ProtectedRoute><BookingPage /></ProtectedRoute>}
        />
        <Route
        path="/payment/:bookingId"
        element={<ProtectedRoute><PaymentPage /></ProtectedRoute>}
        />
        <Route
        path="/my-bookings"
        element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>}
        />
      </Routes>
    </>
  );
}