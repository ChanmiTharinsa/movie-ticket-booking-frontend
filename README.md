# Movie Ticket Booking System - Frontend

A React + TypeScript web application for the Movie Ticket Booking System. Customers can browse movies, pick seats, book tickets and pay. Admins can manage movies, theatres and shows. It talks to the Spring Boot backend with JWT authentication.

Backend repository: https://github.com/ChanmiTharinsa/movie-ticket-booking-backend

## Technologies

- React 19 with TypeScript
- Vite
- React Router
- Axios
- Plain CSS (responsive layout)

## Features

- Sign up and sign in with JWT authentication
- Protected routes and role-based access (ADMIN / USER)
- Browse movies and view the shows for each movie
- Seat selection with a live total price
- Booking with server-side validation errors shown on screen (for example seat conflicts)
- Payment page with a "simulate failed payment" option and retry
- My Bookings page with Cancel
- Admin pages to add and list movies, theatres and shows
- Loading states and error messages on every page

## How to Run

1. Install Node.js (LTS).
2. Start the backend first. It must run on `http://localhost:8081` (see the backend README).
3. In this project folder, run:

```
npm install
npm run dev
```

4. Open `http://localhost:5173`.

## Default Admin Login

- Email: `admin@moviebooking.com`
- Password: `Admin@123`

New users who sign up get the normal user role.

## Pages

| Route | Page | Access |
|---|---|---|
| `/login` | Sign in | Public |
| `/register` | Sign up | Public |
| `/` | Movies | Signed in |
| `/movies/:movieId/shows` | Shows for a movie | Signed in |
| `/book/:showId` | Seat selection and booking | Signed in |
| `/payment/:bookingId` | Payment | Signed in |
| `/my-bookings` | My bookings and cancel | Signed in |
| `/admin/movies` | Manage movies | Admin |
| `/admin/theatres` | Manage theatres | Admin |
| `/admin/shows` | Manage shows | Admin |

## Project Structure

```
src/
  api/          axios instance with the JWT interceptor
  components/   Navbar, ProtectedRoute
  context/      AuthContext (sign in, sign up, sign out)
  pages/        all pages
  types/        TypeScript types
  utils/        helpers
```

## Future Expansion

1. **Interactive seat layout:** show the real theatre layout with the already booked seats greyed out, so users can see which seats are free before they choose.
2. **Email and SMS notification screen:** let users choose how they receive booking confirmations and payment receipts, and show a confirmation message after booking.
3. **Movie posters and trailers:** show a poster and a trailer on each movie card to make browsing easier and more attractive.

## Repository Submission Process

1. Work on feature branches, then merge them into `main`.
2. Push `main` to GitHub: `git push origin main`.
3. Check that the README displays on the GitHub page.
4. Submit the repository URL: https://github.com/ChanmiTharinsa/movie-ticket-booking-frontend