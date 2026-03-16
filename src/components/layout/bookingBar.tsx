import { Button, Flex, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  DEFAULT_GUESTS,
  GuestsPopover,
  type GuestsState,
} from "./guestsPopOver";
import { DateRangePicker } from "./dateRangePicker";
import api from "@/services/api";
import axios from "axios";
import { BookingConfirmDialog } from "./BookingConfirmDialog";

export interface Room {
  id: number;
  number: string;
  type: string;
  status: string;
  dailyRate: number;
}

const ROOM_TYPE_MAP: Record<string, string> = {
  "Suíte Master": "SUITE",
  "Quarto Deluxe": "DELUXE",
  "Quarto Single": "SINGLE",
  "Suíte Casal": "STANDARD_CASAL",
};

export function BookingBar() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: today,
    to: tomorrow,
  });
  const [guests, setGuests] = useState<GuestsState>(DEFAULT_GUESTS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [noRoomAvailable, setNoRoomAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const handleSearchClick = async () => {
    setLoading(true);
    setFetchError(null);
    setNoRoomAvailable(false);
    setSelectedRoom(null);

    try {
      // 1. Busca todos os quartos disponíveis
      const { data: availableRooms } =
        await api.get<Room[]>("/rooms/available");

      console.log(availableRooms);

      // 2. Filtra pelo tipo escolhido pelo usuário
      const backendType = ROOM_TYPE_MAP[guests.roomType] ?? null;
      const compatible = backendType
        ? availableRooms.filter((r) => r.type === backendType)
        : availableRooms;

      console.log(compatible);
      if (compatible.length === 0) {
        setNoRoomAvailable(true);
        setSelectedRoom(null);
        setDialogOpen(true);
        return;
      }

      // 3. Pega o primeiro disponível automaticamente
      setSelectedRoom(compatible[0]);
      setDialogOpen(true);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? err.message)
        : "Erro ao buscar quartos.";
      setFetchError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReservation = async () => {
    if (!selectedRoom || !dateRange?.from || !dateRange?.to) {
      console.log("GUARD falhou:", {
        selectedRoom,
        from: dateRange?.from,
        to: dateRange?.to,
      });
      return;
    }
    try {
      console.log("A. Enviando POST /reservations...");
      const { data: reservation } = await api.post("/reservations", {
        roomId: selectedRoom.id,
        checkIn: dateRange.from.toISOString(),
        checkOut: dateRange.to.toISOString(),
      });
      console.log("B. Reserva criada com sucesso:", reservation);
      // função termina aqui normalmente, sem throw
    } catch (err) {
      console.log("C. ERRO no POST /reservations:", err);
      throw err; // ← importante: relança para o handleConfirm capturar
    }
  };

  return (
    <>
      <Flex position="absolute" top="75%" right="100px" gap={10} zIndex={2}>
        <DateRangePicker dateRange={dateRange} onChange={setDateRange} />

        <GuestsPopover value={guests} onChange={setGuests} />

        <VStack align="center">
          <Text fontSize="xs" fontWeight="bold" letterSpacing="widest">
            VERIFICAR RESERVA
          </Text>
          {fetchError && (
            <Text fontSize="xs" color="red.300" maxW="160px" textAlign="center">
              {fetchError}
            </Text>
          )}
          <Button
            bg="sage.600"
            color="white"
            border="1px solid"
            fontWeight="bold"
            px={6}
            py={4}
            h="auto"
            _hover={{
              bg: "sage.500",
              borderColor: "whiteAlpha.800",
              transform: "translateY(-1px)",
            }}
            _active={{ transform: "translateY(0)" }}
            transition="all 0.2s"
            onClick={handleSearchClick}
          >
            Reservar Quarto
          </Button>
        </VStack>
      </Flex>
      <BookingConfirmDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        room={selectedRoom}
        noRoomAvailable={noRoomAvailable}
        chosenRoomTypeLabel={guests.roomType}
        dateRange={dateRange}
        onConfirm={handleConfirmReservation}
      />
    </>
  );
}
