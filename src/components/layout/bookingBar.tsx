"use client";

import { Button, Flex, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  DEFAULT_GUESTS,
  GuestsPopover,
  type GuestsState,
} from "./guestsPopOver";
import { DateRangePicker } from "./dateRangePicker";

export function BookingBar() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: today,
    to: tomorrow,
  });
  const [guests, setGuests] = useState<GuestsState>(DEFAULT_GUESTS);

  const handleSearch = () => {
    const params = new URLSearchParams({
      checkIn: dateRange?.from?.toISOString() ?? "",
      checkOut: dateRange?.to?.toISOString() ?? "",
      adults: String(guests.adults),
      children: String(guests.children),
      rooms: String(guests.rooms),
      roomType: guests.roomType,
    });
    window.location.href = `/quartos?${params.toString()}`;
  };

  return (
    <Flex position="absolute" top="75%" right="100px" gap={10} zIndex={2}>
      <DateRangePicker dateRange={dateRange} onChange={setDateRange} />

      <GuestsPopover value={guests} onChange={setGuests} />

      <VStack align="center">
        <Text fontSize="xs" fontWeight="bold" letterSpacing="widest">
          PREÇO ESTIMADO
        </Text>
        <Button
          bg="white"
          color="black"
          fontWeight="bold"
          px={6}
          py={4}
          h="auto"
          _hover={{ bg: "whiteAlpha.800", transform: "translateY(-1px)" }}
          _active={{ transform: "translateY(0)" }}
          transition="all 0.2s"
          onClick={handleSearch}
        >
          Verificar preço
        </Button>
      </VStack>
    </Flex>
  );
}
