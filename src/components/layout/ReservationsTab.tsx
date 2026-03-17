import { Box, Flex, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import { STATUS_CONFIG, ROOM_TYPE_LABEL } from "@/constants/reservationConstants";
import { formatCurrency, nightsBetween } from "@/utils/formatters";
import { formatDate } from "@/utils/date";
import type { Reservation } from "@/types/reservation";
import { ReservationDetailDialog } from "./ReservationDetailDialog";
import { useReservationsList } from "@/hooks/useReservationList";

function ReservationCard({
  reservation,
  onClick,
}: {
  reservation: Reservation;
  onClick: () => void;
}) {
  const cfg = STATUS_CONFIG[reservation.status];
  const checkIn = new Date(reservation.checkIn);
  const checkOut = new Date(reservation.checkOut);
  const nights = nightsBetween(checkIn, checkOut);

  return (
    <Box
      bg="white" borderRadius="xl" overflow="hidden"
      border="1px solid" borderColor="gray.100"
      boxShadow="0 1px 3px rgba(0,0,0,0.06)"
      cursor="pointer"
      transition="all 0.2s"
      _hover={{ boxShadow: "0 4px 16px rgba(0,0,0,0.12)", transform: "translateY(-1px)" }}
      _active={{ transform: "translateY(0)" }}
      onClick={onClick}
    >
      <Box h="3px" bg={cfg.border} />

      <Flex p={5} justify="space-between" align="start" gap={4} flexWrap="wrap">
        <VStack align="start" gap={2}>
          <HStack gap={2}>
            <Box
              px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="bold"
              color={cfg.color} bg={cfg.bg} border="1px solid" borderColor={cfg.border}
            >
              {cfg.label}
            </Box>
            <Text fontSize="xs" color="gray.400">#{reservation.id}</Text>
          </HStack>

          {reservation.room && (
            <Text fontSize="sm" fontWeight="semibold" color="gray.700">
              Quarto {reservation.room.number} · {ROOM_TYPE_LABEL[reservation.room.type] ?? reservation.room.type}
            </Text>
          )}

          <HStack gap={4}>
            <VStack align="start" gap={0}>
              <Text fontSize="xs" color="gray.400" fontWeight="semibold" letterSpacing="wider">CHECK-IN</Text>
              <Text fontSize="sm" fontWeight="bold" color="gray.700">{formatDate(checkIn)}</Text>
            </VStack>
            <Text color="gray.300">→</Text>
            <VStack align="start" gap={0}>
              <Text fontSize="xs" color="gray.400" fontWeight="semibold" letterSpacing="wider">CHECK-OUT</Text>
              <Text fontSize="sm" fontWeight="bold" color="gray.700">{formatDate(checkOut)}</Text>
            </VStack>
          </HStack>

          <Text fontSize="xs" color="gray.400">
            {nights} {nights === 1 ? "noite" : "noites"}
          </Text>
        </VStack>

        <VStack align="end" gap={0}>
          <Text fontSize="xs" color="gray.400" fontWeight="semibold" letterSpacing="wider">TOTAL</Text>
          <Text fontSize="xl" fontWeight="extrabold" color="sage.700">
            {formatCurrency(reservation.totalPrice)}
          </Text>
          <Text fontSize="xs" color="gray.400" mt={2}>Clique para detalhes →</Text>
        </VStack>
      </Flex>
    </Box>
  );
}

export function ReservationsTab() {
  const {
    reservations,
    loading,
    error,
    selected,
    dialogOpen,
    handleCardClick,
    handleDialogClose,
    handleUpdated,
  } = useReservationsList();

  if (loading) {
    return (
      <Flex justify="center" align="center" py={16}>
        <Spinner size="lg" color="sage.600" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box bg="red.50" borderRadius="xl" p={6} border="1px solid" borderColor="red.200">
        <Text color="red.600" fontWeight="semibold">⚠ {error}</Text>
      </Box>
    );
  }

  if (reservations.length === 0) {
    return (
      <Flex direction="column" align="center" justify="center" py={16} gap={3}>
        <Text fontSize="4xl">🛎</Text>
        <Text fontWeight="bold" color="gray.600" fontSize="lg">Nenhuma reserva encontrada</Text>
        <Text fontSize="sm" color="gray.400">Suas futuras reservas aparecerão aqui.</Text>
      </Flex>
    );
  }

  return (
    <>
      <VStack align="stretch" gap={4}>
        {reservations.map((r) => (
          <ReservationCard
            key={r.id}
            reservation={r}
            onClick={() => handleCardClick(r)}
          />
        ))}
      </VStack>

      <ReservationDetailDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        reservation={selected}
        onUpdated={handleUpdated}
      />
    </>
  );
}