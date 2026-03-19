import {
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  HStack,
  VStack,
  Flex,
  Spinner,
  Box,
  Badge,
  Text,
  Button,
} from "@chakra-ui/react";

import type { DateRange } from "react-day-picker";
import { formatDate } from "@/utils/date";
import { formatCurrency } from "@/utils/formatters";
import type { Room } from "@/types/room";
import { DialogCloseButton } from "../common/CloseButton";

type BookingConfirmContentProps = {
  room: Room | null;
  dateRange?: DateRange;
  totalPrice: number | null;
  nights: number;
  estimating: boolean;
  estimateError: string | null;
  confirming: boolean;
  confirmError: string | null;
  onConfirm: () => void;
  canConfirm: boolean;
  roomTypeLabelMap: Record<string, string>;
};

export function BookingConfirmContent({
  room,
  dateRange,
  totalPrice,
  nights,
  estimating,
  estimateError,
  confirming,
  confirmError,
  onConfirm,
  canConfirm,
  roomTypeLabelMap,
}: BookingConfirmContentProps) {
  return (
    <>
      <Box bg="sage.600" px={6} pt={6} pb={5}>
        <DialogHeader p={0}>
          <DialogTitle color="white" fontSize="xl" fontWeight="bold">
            Confirmar Reserva
          </DialogTitle>
        </DialogHeader>

        {room && (
          <HStack mt={2} gap={2}>
            <Badge
              colorScheme="green"
              variant="solid"
              borderRadius="full"
              fontSize="xs"
              px={3}
            >
              Disponível
            </Badge>
            <Text color="whiteAlpha.800" fontSize="sm">
              Quarto {room.number} · {roomTypeLabelMap[room.type] ?? room.type}
            </Text>
          </HStack>
        )}
      </Box>

      <DialogBody pt={6} pb={2} px={6}>
        <VStack align="stretch" gap={4}>
          <Box
            bg="gray.50"
            borderRadius="xl"
            p={4}
            border="1px solid"
            borderColor="gray.100"
          >
            <HStack justify="space-between">
              <VStack align="start" gap={0}>
                <Text
                  fontSize="xs"
                  color="gray.500"
                  fontWeight="semibold"
                  letterSpacing="wider"
                >
                  CHECK-IN
                </Text>
                <Text fontWeight="bold" fontSize="md">
                  {formatDate(dateRange?.from)}
                </Text>
              </VStack>

              <Text color="gray.300" fontSize="xl">
                →
              </Text>

              <VStack align="end" gap={0}>
                <Text
                  fontSize="xs"
                  color="gray.500"
                  fontWeight="semibold"
                  letterSpacing="wider"
                >
                  CHECK-OUT
                </Text>
                <Text fontWeight="bold" fontSize="md">
                  {formatDate(dateRange?.to)}
                </Text>
              </VStack>
            </HStack>

            <Box mt={3} pt={3} borderTop="1px solid" borderColor="gray.200">
              <Text fontSize="sm" color="gray.600" textAlign="center">
                {nights} {nights === 1 ? "noite" : "noites"} ·{" "}
                {room ? formatCurrency(room.dailyRate) : "—"}/noite
              </Text>
            </Box>
          </Box>

          <Box
            bg="sage.50"
            borderRadius="xl"
            p={4}
            border="1px solid"
            borderColor="sage.200"
          >
            {estimating ? (
              <Flex justify="center" align="center" gap={3} py={2}>
                <Spinner size="sm" color="sage.600" />
                <Text fontSize="sm" color="gray.500">
                  Calculando preço…
                </Text>
              </Flex>
            ) : estimateError ? (
              <VStack gap={1} align="start">
                <Text fontSize="sm" color="red.600" fontWeight="semibold">
                  {estimateError}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Não foi possível estimar o preço.
                </Text>
              </VStack>
            ) : totalPrice !== null ? (
              <HStack justify="space-between" align="baseline">
                <Text fontSize="sm" color="gray.600">
                  Total estimado
                </Text>
                <Text fontSize="2xl" fontWeight="extrabold" color="sage.700">
                  {formatCurrency(totalPrice)}
                </Text>
              </HStack>
            ) : null}
          </Box>

          {confirmError && (
            <Box
              bg="red.50"
              borderRadius="xl"
              p={3}
              border="1px solid"
              borderColor="red.200"
            >
              <Text fontSize="sm" color="red.600">
                {confirmError}
              </Text>
            </Box>
          )}
        </VStack>
      </DialogBody>

      <DialogFooter px={6} pb={6} pt={4} gap={3}>
        <DialogCloseButton />

        <Button
          bg="sage.600"
          color="white"
          borderRadius="xl"
          flex={1}
          fontWeight="semibold"
          _hover={{ bg: "sage.500" }}
          _active={{ bg: "sage.700" }}
          disabled={!canConfirm}
          loading={confirming}
          loadingText="Reservando…"
          onClick={onConfirm}
        >
          Confirmar Reserva
        </Button>
      </DialogFooter>
    </>
  );
}
