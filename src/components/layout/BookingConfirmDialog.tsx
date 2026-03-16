import {
  Box,
  Button,
  Flex,
  HStack,
  Spinner,
  Text,
  VStack,
  Badge,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogBackdrop,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import axios from "axios";
import type { Room } from "./bookingBar";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BookingConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  room: Room | null;
  noRoomAvailable: boolean;
  chosenRoomTypeLabel: string;
  dateRange: DateRange | undefined;
  onConfirm: () => Promise<void>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ROOM_TYPE_LABEL: Record<string, string> = {
  SINGLE: "Single",
  STANDARD_CASAL: "Standard Casal",
  SUITE: "Suíte",
  DELUXE: "Deluxe",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(date: Date | undefined) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function nightsBetween(from: Date | undefined, to: Date | undefined): number {
  if (!from || !to) return 0;
  return Math.max(0, Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)));
}

// ─── useEstimatePrice ─────────────────────────────────────────────────────────

function useEstimatePrice() {
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const estimate = async (roomId: number, checkIn: Date, checkOut: Date) => {
    setLoading(true);
    setError(null);
    setTotalPrice(null);
    try {
      const { data } = await api.post<{ totalPrice: number }>("/reservations/estimate-price", {
        roomId,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
      });
      setTotalPrice(data.totalPrice);
    } catch (err: unknown) {
      setError(axios.isAxiosError(err) ? (err.response?.data?.message ?? err.message) : "Erro ao estimar preço.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setTotalPrice(null); setError(null); setLoading(false); };

  return { totalPrice, loading, error, estimate, reset };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BookingConfirmDialog({
  open,
  onClose,
  room,
  noRoomAvailable,
  chosenRoomTypeLabel,
  dateRange,
  onConfirm,
}: BookingConfirmDialogProps) {
  const navigate = useNavigate();
  const { totalPrice, loading: estimating, error: estimateError, estimate, reset } = useEstimatePrice();
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const nights = nightsBetween(dateRange?.from, dateRange?.to);

  useEffect(() => {
    if (open && room && dateRange?.from && dateRange?.to && !noRoomAvailable) {
      estimate(room.id, dateRange.from, dateRange.to);
    }
    if (!open) {
      reset();
      setConfirmError(null);
      setSuccess(false);
    }
  }, [open, room]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpenChange = (details: { open: boolean }) => {
    if (!details.open) onClose();
  };

  const handleConfirm = async () => {
    setConfirming(true);
    setConfirmError(null);
    try {
      await onConfirm();
      setSuccess(true);
    } catch (err: unknown) {
      setConfirmError(axios.isAxiosError(err) ? (err.response?.data?.message ?? err.message) : "Erro ao confirmar reserva.");
    } finally {
      setConfirming(false);
    }
  };

  const handleGoToReservations = () => {
    onClose();
    navigate("/profile/reservations");
  };

  const canConfirm = !estimating && !estimateError && totalPrice !== null && !confirming;

  // ── Conteúdo: sem disponibilidade ───────────────────────────────────────────
  const noRoomContent = (
    <DialogContent maxW="420px" borderRadius="2xl" overflow="hidden" boxShadow="2xl">
      <Box bg="red.600" px={6} pt={6} pb={5}>
        <DialogHeader p={0}>
          <DialogTitle color="white" fontSize="xl" fontWeight="bold">Sem Disponibilidade</DialogTitle>
        </DialogHeader>
        <Text color="whiteAlpha.800" fontSize="sm" mt={1}>{chosenRoomTypeLabel}</Text>
      </Box>
      <DialogBody pt={6} pb={2} px={6}>
        <Box bg="red.50" borderRadius="xl" p={4} border="1px solid" borderColor="red.200">
          <Text fontSize="sm" color="red.700" fontWeight="semibold" mb={1}>Nenhum quarto disponível</Text>
          <Text fontSize="sm" color="red.600">
            Não encontramos quartos do tipo <strong>{chosenRoomTypeLabel}</strong> para{" "}
            {formatDate(dateRange?.from)} → {formatDate(dateRange?.to)}.
          </Text>
          <Text fontSize="xs" color="red.500" mt={2}>Tente outras datas ou escolha um tipo diferente.</Text>
        </Box>
      </DialogBody>
      <DialogFooter px={6} pb={6} pt={4}>
        <DialogCloseTrigger asChild>
          <Button bg="sage.600" color="white" borderRadius="xl" w="full" fontWeight="semibold" _hover={{ bg: "sage.500" }}>
            Alterar Busca
          </Button>
        </DialogCloseTrigger>
      </DialogFooter>
    </DialogContent>
  );

  // ── Conteúdo: sucesso ────────────────────────────────────────────────────────
  const successContent = (
    <DialogContent maxW="460px" borderRadius="2xl" overflow="hidden" boxShadow="2xl">
      <Box bg="green.500" px={6} pt={6} pb={5} textAlign="center">
        <Text fontSize="4xl" mb={2}>✅</Text>
        <DialogHeader p={0}>
          <DialogTitle color="white" fontSize="xl" fontWeight="bold">Reserva Confirmada!</DialogTitle>
        </DialogHeader>
        <Text color="whiteAlpha.900" fontSize="sm" mt={1}>Sua reserva foi realizada com sucesso.</Text>
      </Box>
      <DialogBody pt={6} pb={2} px={6}>
        <Box bg="gray.50" borderRadius="xl" p={4} border="1px solid" borderColor="gray.100">
          <VStack align="stretch" gap={3}>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.500">Quarto</Text>
              <Text fontSize="sm" fontWeight="bold">
                {room?.number} · {ROOM_TYPE_LABEL[room?.type ?? ""] ?? room?.type}
              </Text>
            </HStack>
            <Box borderTop="1px solid" borderColor="gray.200" />
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.500">Check-in</Text>
              <Text fontSize="sm" fontWeight="bold">{formatDate(dateRange?.from)}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.500">Check-out</Text>
              <Text fontSize="sm" fontWeight="bold">{formatDate(dateRange?.to)}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.500">Duração</Text>
              <Text fontSize="sm" fontWeight="bold">{nights} {nights === 1 ? "noite" : "noites"}</Text>
            </HStack>
            <Box borderTop="1px solid" borderColor="gray.200" />
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.600" fontWeight="semibold">Total</Text>
              <Text fontSize="lg" fontWeight="extrabold" color="green.600">
                {totalPrice !== null ? formatCurrency(totalPrice) : "—"}
              </Text>
            </HStack>
          </VStack>
        </Box>
      </DialogBody>
      <DialogFooter px={6} pb={6} pt={4} gap={3}>
        <Button variant="outline" borderRadius="xl" flex={1} fontWeight="semibold" onClick={onClose}>
          Fechar
        </Button>
        <Button
          bg="sage.600" color="white" borderRadius="xl" flex={1} fontWeight="semibold"
          _hover={{ bg: "sage.500" }} onClick={handleGoToReservations}
        >
          Ver Reservas
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  // ── Conteúdo: confirmação ────────────────────────────────────────────────────
  const confirmContent = (
    <DialogContent maxW="460px" borderRadius="2xl" overflow="hidden" boxShadow="2xl">
      <Box bg="sage.600" px={6} pt={6} pb={5}>
        <DialogHeader p={0}>
          <DialogTitle color="white" fontSize="xl" fontWeight="bold">Confirmar Reserva</DialogTitle>
        </DialogHeader>
        {room && (
          <HStack mt={2} gap={2}>
            <Badge colorScheme="green" variant="solid" borderRadius="full" fontSize="xs" px={3}>Disponível</Badge>
            <Text color="whiteAlpha.800" fontSize="sm">
              Quarto {room.number} · {ROOM_TYPE_LABEL[room.type] ?? room.type}
            </Text>
          </HStack>
        )}
      </Box>

      <DialogBody pt={6} pb={2} px={6}>
        <VStack align="stretch" gap={4}>
          <Box bg="gray.50" borderRadius="xl" p={4} border="1px solid" borderColor="gray.100">
            <HStack justify="space-between">
              <VStack align="start" gap={0}>
                <Text fontSize="xs" color="gray.500" fontWeight="semibold" letterSpacing="wider">CHECK-IN</Text>
                <Text fontWeight="bold" fontSize="md">{formatDate(dateRange?.from)}</Text>
              </VStack>
              <Text color="gray.300" fontSize="xl">→</Text>
              <VStack align="end" gap={0}>
                <Text fontSize="xs" color="gray.500" fontWeight="semibold" letterSpacing="wider">CHECK-OUT</Text>
                <Text fontWeight="bold" fontSize="md">{formatDate(dateRange?.to)}</Text>
              </VStack>
            </HStack>
            <Box mt={3} pt={3} borderTop="1px solid" borderColor="gray.200">
              <Text fontSize="sm" color="gray.600" textAlign="center">
                {nights} {nights === 1 ? "noite" : "noites"} · {room ? formatCurrency(room.dailyRate) : "—"}/noite
              </Text>
            </Box>
          </Box>

          <Box bg="sage.50" borderRadius="xl" p={4} border="1px solid" borderColor="sage.200">
            {estimating ? (
              <Flex justify="center" align="center" gap={3} py={2}>
                <Spinner size="sm" color="sage.600" />
                <Text fontSize="sm" color="gray.500">Calculando preço…</Text>
              </Flex>
            ) : estimateError ? (
              <VStack gap={1} align="start">
                <Text fontSize="sm" color="red.600" fontWeight="semibold">⚠ {estimateError}</Text>
                <Text fontSize="xs" color="gray.500">Não foi possível estimar o preço.</Text>
              </VStack>
            ) : totalPrice !== null ? (
              <HStack justify="space-between" align="baseline">
                <Text fontSize="sm" color="gray.600">Total estimado</Text>
                <Text fontSize="2xl" fontWeight="extrabold" color="sage.700">{formatCurrency(totalPrice)}</Text>
              </HStack>
            ) : null}
          </Box>

          {confirmError && (
            <Box bg="red.50" borderRadius="xl" p={3} border="1px solid" borderColor="red.200">
              <Text fontSize="sm" color="red.600">⚠ {confirmError}</Text>
            </Box>
          )}
        </VStack>
      </DialogBody>

      <DialogFooter px={6} pb={6} pt={4} gap={3}>
        <DialogCloseTrigger asChild>
          <Button variant="outline" borderRadius="xl" flex={1} fontWeight="semibold">Cancelar</Button>
        </DialogCloseTrigger>
        <Button
          bg="sage.600" color="white" borderRadius="xl" flex={1} fontWeight="semibold"
          _hover={{ bg: "sage.500" }} _active={{ bg: "sage.700" }}
          disabled={!canConfirm} loading={confirming} loadingText="Reservando…"
          onClick={handleConfirm}
        >
          Confirmar Reserva
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  // ── Um único DialogRoot, conteúdo troca por estado ──────────────────────────
  return (
    <DialogRoot
      open={open}
      onOpenChange={handleOpenChange}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogBackdrop />
      {noRoomAvailable ? noRoomContent : success ? successContent : confirmContent}
    </DialogRoot>
  );
}