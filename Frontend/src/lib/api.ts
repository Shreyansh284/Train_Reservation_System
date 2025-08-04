import apiClient from "./apiClient";

// Get all trains
export const getTrains = () => apiClient.get("/train").then(res => res.data);

// Get train by ID
export const getTrainById = (trainId: number) => 
  apiClient.get(`/train/${trainId}`).then(res => res.data);

// Search trains
export const searchTrains = (fromStationId: number, toStationId: number, date: string) => {
  return apiClient.get("/searchTrains", {
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
  return apiClient.get(`/train/${trainId}/search`, {
    params: { 
      FromStationId: fromStationId, 
      ToStationId: toStationId, 
      DateOfBooking: date 
    }
  }).then(res => res.data);
};

// Book a train
export const bookTrain = (trainId: number, userId: number, booking: any) =>
  apiClient.post(`/booking/train/${trainId}/user/${userId}`, booking).then(res => res.data);

// Get booking by PNR
export const getBooking = (pnr: number) =>
  apiClient.get(`/booking/${pnr}`).then(res => res.data);

// Add a new train (admin)
export const addTrain = (train: any) =>
  apiClient.post("/train", train).then(res => res.data);

// Get stations by query (for autocomplete)
export const getStationsByQuery = (query: string) =>
  apiClient.get("/station/search", { params: { query } }).then(res => res.data);

// Register a new user
export const registerUser = (userData: {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}) => apiClient.post("/register", userData).then(res => res.data);

// Login user
export const loginUser = (credentials: {
  userName: string;
  password: string;
}) => apiClient.post("/Auth/login", credentials).then(res => res.data);

// Cancel booking
export const cancelBooking = (cancellationRequest: any) =>
  apiClient.post("/cancel-booking", cancellationRequest).then(res => res.data);