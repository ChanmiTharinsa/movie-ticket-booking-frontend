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