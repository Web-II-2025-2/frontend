import { useState } from "react";
import { filterRoomsByType } from "@/utils/filterRooms";
import type { Room } from "@/types/room";
import { getAvailableRooms } from "@/services/RoomService";
import { createReservation } from "@/services/ReservationService";

export function useBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [noRoomAvailable, setNoRoomAvailable] = useState(false);

  const searchRooms = async (roomType?: string) => {
    setLoading(true);
    setError(null);
    setNoRoomAvailable(false);
    setSelectedRoom(null);

    try {
      const rooms = await getAvailableRooms();
      const filtered = filterRoomsByType(rooms, roomType);
      if (filtered.length === 0) {
        setNoRoomAvailable(true);
        return;
      }
      setSelectedRoom(filtered[0]);
    } catch (err) {
      setError("Erro ao buscar quartos");
    } finally {
      setLoading(false);
    }
  };

  const confirmReservation = async (
    room: Room,
    from: Date,
    to: Date
  ) => {
    await createReservation({
      roomId: room.id,
      checkIn: from.toISOString(),
      checkOut: to.toISOString(),
    });
  };

  return {
    loading,
    error,
    selectedRoom,
    noRoomAvailable,
    searchRooms,
    confirmReservation,
  };
}