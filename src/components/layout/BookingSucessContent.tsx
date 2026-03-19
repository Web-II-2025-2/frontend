import {
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  Box,
  Text,
  Button,
  VStack,
  HStack,
} from "@chakra-ui/react";

import type { DateRange } from "react-day-picker";
import { formatDate } from "@/utils/date";
import { formatCurrency } from "@/utils/formatters";
import type { Room } from "@/types/room";

type BookingSuccessContentProps = {
  room: Room | null;
  dateRange?: DateRange;
  nights: number;
  totalPrice: number | null;
  roomTypeLabelMap: Record<string, string>;
  onClose: () => void;
  onGoToReservations: () => void;
};

export function BookingSuccessContent({
  room,
  dateRange,
  nights,
  totalPrice,
  roomTypeLabelMap,
  onClose,
  onGoToReservations,
}: BookingSuccessContentProps) {
  return (
    <>
      <Box bg="green.500" px={6} pt={6} pb={5} textAlign="center">
        <Text fontSize="4xl" mb={2}>✅</Text>
        <DialogHeader p={0}>
          <DialogTitle color="white" fontSize="xl" fontWeight="bold">
            Reserva Confirmada!
          </DialogTitle>
        </DialogHeader>
        <Text color="whiteAlpha.900" fontSize="sm" mt={1}>
          Sua reserva foi realizada com sucesso.
        </Text>
      </Box>

      <DialogBody pt={6} pb={2} px={6}>
        <Box
          bg="gray.50"
          borderRadius="xl"
          p={4}
          border="1px solid"
          borderColor="gray.100"
        >
          <VStack align="stretch" gap={3}>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.500">Quarto</Text>
              <Text fontSize="sm" fontWeight="bold">
                {room?.number} ·{" "}
                {roomTypeLabelMap[room?.type ?? ""] ?? room?.type}
              </Text>
            </HStack>

            <Box borderTop="1px solid" borderColor="gray.200" />

            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.500">Check-in</Text>
              <Text fontSize="sm" fontWeight="bold">
                {formatDate(dateRange?.from)}
              </Text>
            </HStack>

            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.500">Check-out</Text>
              <Text fontSize="sm" fontWeight="bold">
                {formatDate(dateRange?.to)}
              </Text>
            </HStack>

            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.500">Duração</Text>
              <Text fontSize="sm" fontWeight="bold">
                {nights} {nights === 1 ? "noite" : "noites"}
              </Text>
            </HStack>

            <Box borderTop="1px solid" borderColor="gray.200" />

            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.600" fontWeight="semibold">
                Total
              </Text>
              <Text fontSize="lg" fontWeight="extrabold" color="green.600">
                {totalPrice !== null ? formatCurrency(totalPrice) : "—"}
              </Text>
            </HStack>
          </VStack>
        </Box>
      </DialogBody>

      <DialogFooter px={6} pb={6} pt={4} gap={3}>
        <Button
          variant="outline"
          borderRadius="xl"
          flex={1}
          fontWeight="semibold"
          onClick={onClose}
        >
          Fechar
        </Button>

        <Button
          bg="sage.600"
          color="white"
          borderRadius="xl"
          flex={1}
          fontWeight="semibold"
          _hover={{ bg: "sage.500" }}
          onClick={onGoToReservations}
        >
          Ver Reservas
        </Button>
      </DialogFooter>
    </>
  );
}