import { Button, Flex, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  DEFAULT_GUESTS,
  GuestsPopover,
  type GuestsState,
} from "./guestsPopOver";
import { DateRangePicker } from "../common/DateRangePicker";
import { BookingConfirmDialog } from "./BookingConfirmDialog";
import { useBooking } from "@/hooks/useBooking";
import { ROOM_TYPE_MAP } from "@/constants/roomType";

export function BookingBar() {
  const {
    error,
    selectedRoom,
    noRoomAvailable,
    searchRooms,
    confirmReservation,
  } = useBooking();

  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return { from: today, to: tomorrow };
  });
  const [guests, setGuests] = useState<GuestsState>(DEFAULT_GUESTS);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSearchClick = async () => {
    await searchRooms(guests.roomType);
    if (!error) setDialogOpen(true);
  };

  const handleConfirmReservation = async () => {
    if (!selectedRoom || !dateRange?.from || !dateRange?.to) return;
    await confirmReservation(selectedRoom, dateRange.from, dateRange.to);
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
          {error && (
            <Text fontSize="xs" color="red.300" maxW="160px" textAlign="center">
              {error}
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
        roomTypeLabelMap={ROOM_TYPE_MAP}
      />
    </>
  );
}
