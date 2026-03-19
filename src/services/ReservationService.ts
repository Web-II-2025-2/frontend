import type { Room } from "@/types/room";
import api from "./api";

export async function createReservation(payload: {
  roomId: number;
  checkIn: string;
  checkOut: string;
}) {
  const { data } = await api.post("/reservations", payload);
  return data;
}

export async function fetchRoomById(roomId: number): Promise<Room> {
  const { data } = await api.get<Room>(`/rooms/${roomId}`);
  return data;
}

export async function performCheckin(reservationId: number): Promise<void> {
  await api.patch(`/reservations/${reservationId}/checkin`);
}

export async function performCheckout(reservationId: number): Promise<void> {
  await api.patch(`/reservations/${reservationId}/checkout`);
}

export async function cancelReservation(reservationId: number): Promise<void> {
  await api.delete(`/reservations/${reservationId}`);
}

export async function requestRoomService(
  reservationId: number,
  message: string,
  requestCleaning: boolean
): Promise<void> {
  await api.post(`/reservations/${reservationId}/room-service`, {
    message,
    requestCleaning,
  });
}