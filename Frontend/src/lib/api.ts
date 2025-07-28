import axios from "axios";
import { DateToSystemTimezoneSetter } from "node_modules/date-fns/parse/_lib/Setter";

const API_BASE_URL = "http://localhost:5245/api"; // Change to your backend URL if different

// Get all trains
export const getTrains = () => axios.get(`${API_BASE_URL}/train`).then(res => res.data);

// Get train by ID
export const getTrainById = (trainId: number) => axios.get(`${API_BASE_URL}/train/${trainId}`).then(res => res.data);

// Search trains
export const searchTrains = (fromStationId: number, toStationId: number, date: string) =>
{
console.log(`${API_BASE_URL}/searchTrains?FromStationId=${fromStationId}&ToStationId=${toStationId}&DateOfBooking=${date}`)
 return axios.get(`${API_BASE_URL}/searchTrains`, {
    params: { FromStationId: fromStationId, ToStationId: toStationId, DateOfBooking: date }
  }).then(res => res.data)
  .catch(err => console.log(err));
}
export const getTrainDetailsBySearch=(trainId:Number,fromStationId: number, toStationId: number, date: string)=>
{
  return axios.get(`${API_BASE_URL}/train/${trainId}/search`,
    {params: { FromStationId: fromStationId, ToStationId: toStationId, DateOfBooking: date }})

    .then(res=>res.data)
}
// Book a train
export const bookTrain = (trainId: number, userId: number, booking: any) =>
  axios.post(`${API_BASE_URL}/booking/train/${trainId}/user/${userId}`, booking).then(res => res.data);

// Get booking by PNR
export const getBooking = (pnr: number) =>
  axios.get(`${API_BASE_URL}/booking/${pnr}`).then(res => res.data);

// Add a new train (admin)
export const addTrain = (train: any) =>
  axios.post(`${API_BASE_URL}/train`, train).then(res => res.data);

// Get stations by query (for autocomplete)
export const getStationsByQuery = (query: string) =>
  axios.get(`${API_BASE_URL}/station/search`, { params: { query } }).then(res => res.data); 

export const cancelBooking = (cancellationRequest: any) =>
  axios.post(`${API_BASE_URL}/cancel-booking`, cancellationRequest).then(res => res.data);