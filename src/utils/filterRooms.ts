import type { Room } from "@/types/room";

const ROOM_TYPE_MAP: Record<string, string> = {
  "Suíte Master": "SUITE",
  "Quarto Deluxe": "DELUXE",
  "Quarto Single": "SINGLE",
  "Suíte Casal": "STANDARD_CASAL",
};

export function filterRoomsByType(
  rooms: Room[],
  roomType?: string
): Room[] {
  const backendType = ROOM_TYPE_MAP[roomType ?? ""];
  return backendType
    ? rooms.filter((r) => r.type === backendType)
    : rooms;
}