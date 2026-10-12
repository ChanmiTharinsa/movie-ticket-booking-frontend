export interface Movie {
  movieId: string;
  title: string;
  description: string;
  durationMinutes: number;
  language: string;
  genre: string;
  releaseDate: string;
  status: string;
}

export interface Theatre {
  theatreId: string;
  name: string;
  location: string;
  capacity: number;
  status: string;
}

export interface Show {
  showId: string;
  movieId: string;
  theatreId: string;
  showDate: string;
  showTime: string;
  ticketPrice: number;
  status: string;
}

export interface Booking {
  bookingId: string;
  userId: string;
  showId: string;
  numberOfTickets: number;
  seatNumbers: string[];
  bookingDate: string;
  totalAmount: number;
  status: string;
}

export interface Payment {
  paymentId: string;
  bookingId: string;
  paymentDate: string;
  amount: number;
  status: string;
  method: string;
  bookingStatus: string;
}