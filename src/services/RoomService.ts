import type { Room } from "@/types/room";
import api from "./api";

export async function getAvailableRooms(): Promise<Room[]> {
  const { data } = await api.get("/rooms/available");
  return data;
}