import api from "./api";

export async function createReservation(payload: {
  roomId: number;
  checkIn: string;
  checkOut: string;
}) {
  const { data } = await api.post("/reservations", payload);
  return data;
}