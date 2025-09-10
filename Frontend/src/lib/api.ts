import apiClient from "./apiClient";

// Get all trains
export const getTrains = () => apiClient.get("/trains").then(res => res.data);

// Get train by ID
export const getTrainById = (trainId: number) => 
  apiClient.get(`/trains/${trainId}`).then(res => res.data);

// Search trains
export const searchTrains = (fromStationId: number, toStationId: number, date: string) => {
  return apiClient.get("/trains/search", {
    params: { 
      FromStationId: fromStationId, 
      ToStationId: toStationId, 
      DateOfBooking: date 
    }
  }).then(res => res.data);
};

export const getTrainDetailsBySearch = (
  trainId: number, 
  fromStationId: number, 
  toStationId: number, 
  date: string
) => {
  return apiClient.get(`/trains/${trainId}/search`, {
    params: { 
      FromStationId: fromStationId, 
      ToStationId: toStationId, 
      DateOfBooking: date 
    }
  }).then(res => res.data);
};

// Book a train
export const bookTrain = (trainId: number, userId: number, booking: any) =>
  apiClient.post(`/bookings/trains/${trainId}/users/${userId}`, booking).then(res => res.data);

// Get booking by PNR
export const getBooking = (pnr: number) =>
  apiClient.get(`/bookings/${pnr}`).then(res => res.data);

// Add a new train (admin)
export const addTrain = (train: any) =>
  apiClient.post("/trains", train).then(res => res.data);

// Get stations by query (for autocomplete)
export const getStationsByQuery = (query: string) =>
  apiClient.get("/stations/search", { params: { query } }).then(res => res.data);

// Register a new user
export const registerUser = (userData: {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}) => apiClient.post("/register", userData).then(res => res.data); // remains the same, matches backend

// Login user
export const loginUser = (credentials: {
  userName: string;
  password: string;
}) => apiClient.post("/login", credentials).then(res => res.data); // remains the same, matches backend

// Cancel booking
export const cancelBooking = (cancellationRequest: any) =>
  apiClient.post("/cancelbooking", cancellationRequest).then(res => res.data); // remains the same, matches backend