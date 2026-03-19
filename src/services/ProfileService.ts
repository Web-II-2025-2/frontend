import api from "@/services/api";
import type { GuestProfile } from "@/types/profile";
import type { Reservation } from "@/types/reservation";

export async function fetchGuestProfile(): Promise<GuestProfile> {
  const { data } = await api.get<GuestProfile>("/guests/profile");
  return data;
}

export async function fetchMyReservations(): Promise<Reservation[]> {
  const { data } = await api.get<Reservation[]>("/reservations/my-reservations");
  return data;
}