import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  Textarea,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogBackdrop,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "@/services/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Reservation {
  id: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: "CONFIRMED" | "CANCELED" | "CHECKED_IN" | "CHECKED_OUT";
  room?: { number: string; type: string };
}

interface Room {
  id: number;
  number: string;
  type: string;
  status: string;
  dailyRate: number;
}

interface ReservationDetailDialogProps {
  open: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  onUpdated: () => void;
}

type View = "detail" | "room-service" | "confirm-cancel" | "success";

// ─── Constants ────────────────────────────────────────────────────────────────

const ROOM_TYPE_LABEL: Record<string, string> = {
  SINGLE: "Single",
  STANDARD_CASAL: "Standard Casal",
  SUITE: "Suíte",
  DELUXE: "Deluxe",
};

const STATUS_CONFIG: Record<
  Reservation["status"],
  { label: string; color: string; bg: string; border: string }
> = {
  CONFIRMED: {
    label: "Confirmada",
    color: "#2d7a4f",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
  CHECKED_IN: {
    label: "Hospedado",
    color: "#1e40af",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  CHECKED_OUT: {
    label: "Finalizada",
    color: "#6b7280",
    bg: "#f9fafb",
    border: "#e5e7eb",
  },
  CANCELED: {
    label: "Cancelada",
    color: "#b91c1c",
    bg: "#fef2f2",
    border: "#fecaca",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
}

function nightsBetween(checkIn: string, checkOut: string): number {
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ReservationDetailDialog({
  open,
  onClose,
  reservation,
  onUpdated,
}: ReservationDetailDialogProps) {
  const [view, setView] = useState<View>("detail");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [serviceMessage, setServiceMessage] = useState("");
  const [requestCleaning, setRequestCleaning] = useState(false);
  const [roomDirty, setRoomDirty] = useState(false);

  // ── Busca status do quarto via GET /rooms quando CHECKED_IN ─────────────────
  useEffect(() => {
    if (open && reservation?.status === "CHECKED_IN" && reservation?.roomId) {
      api
        .get<Room>(`/rooms/${reservation.roomId}`) // ← Room, não Room[]
        .then(({ data }) => {
          setRoomDirty(data.status === "DIRTY"); // ← direto, sem .find()
        })
        .catch(() => {
          setRoomDirty(false);
        });
    }
    if (!open) {
      setRoomDirty(false);
    }
  }, [open, reservation]);

  const resetState = () => {
    setView("detail");
    setError(null);
    setServiceMessage("");
    setRequestCleaning(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleOpenChange = (details: { open: boolean }) => {
    if (!details.open) handleClose();
  };

  const withLoading = async (fn: () => Promise<void>) => {
    setLoading(true);
    setError(null);
    try {
      await fn();
    } catch (err: unknown) {
      setError(
        axios.isAxiosError(err)
          ? (err.response?.data?.message ?? err.message)
          : "Ocorreu um erro. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckin = () =>
    withLoading(async () => {
      await api.patch(`/reservations/${reservation!.id}/checkin`);
      setSuccessMsg("Check-in realizado com sucesso!");
      setView("success");
      onUpdated();
    });

  const handleCheckout = () =>
    withLoading(async () => {
      await api.patch(`/reservations/${reservation!.id}/checkout`);
      setSuccessMsg("Check-out realizado com sucesso!");
      setView("success");
      onUpdated();
    });

  const handleCancel = () =>
    withLoading(async () => {
      await api.delete(`/reservations/${reservation!.id}`);
      setSuccessMsg("Reserva cancelada com sucesso.");
      setView("success");
      onUpdated();
    });

  const handleRoomService = () =>
    withLoading(async () => {
      if (!serviceMessage.trim() && !requestCleaning) {
        throw new Error("Preencha a mensagem ou selecione solicitar limpeza.");
      }
      await api.post(`/service/${reservation!.id}/room-service`, {
        message: serviceMessage.trim() || "Sem mensagem adicional.",
        requestCleaning,
      });
      setSuccessMsg(
        requestCleaning
          ? "Pedido enviado e limpeza solicitada!"
          : "Pedido de serviço enviado com sucesso!",
      );
      setView("success");
      onUpdated();
    });

  if (!reservation) return null;

  const cfg = STATUS_CONFIG[reservation.status];
  const nights = nightsBetween(reservation.checkIn, reservation.checkOut);

  const renderContent = () => {
    // ── Sucesso ──────────────────────────────────────────────────────────────
    if (view === "success") {
      return (
        <DialogContent
          maxW="420px"
          borderRadius="2xl"
          overflow="hidden"
          boxShadow="2xl"
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          <Box bg="green.500" px={6} pt={6} pb={5} textAlign="center">
            <Text fontSize="4xl" mb={2}>
              ✅
            </Text>
            <DialogHeader p={0}>
              <DialogTitle color="white" fontSize="xl" fontWeight="bold">
                Pronto!
              </DialogTitle>
            </DialogHeader>
            <Text color="whiteAlpha.900" fontSize="sm" mt={1}>
              {successMsg}
            </Text>
          </Box>
          <DialogFooter px={6} pb={6} pt={6}>
            <Button
              bg="sage.600"
              color="white"
              borderRadius="xl"
              w="full"
              fontWeight="semibold"
              _hover={{ bg: "sage.500" }}
              onClick={handleClose}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      );
    }

    // ── Confirmar cancelamento ────────────────────────────────────────────────
    if (view === "confirm-cancel") {
      return (
        <DialogContent
          maxW="420px"
          borderRadius="2xl"
          overflow="hidden"
          boxShadow="2xl"
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          <Box bg="red.600" px={6} pt={6} pb={5}>
            <DialogHeader p={0}>
              <DialogTitle color="white" fontSize="xl" fontWeight="bold">
                Cancelar Reserva
              </DialogTitle>
            </DialogHeader>
            <Text color="whiteAlpha.800" fontSize="sm" mt={1}>
              Esta ação não pode ser desfeita.
            </Text>
          </Box>
          <DialogBody pt={6} pb={2} px={6}>
            <VStack align="stretch" gap={3}>
              <Box
                bg="red.50"
                borderRadius="xl"
                p={4}
                border="1px solid"
                borderColor="red.200"
              >
                <Text fontSize="sm" color="red.700">
                  Tem certeza que deseja cancelar a reserva{" "}
                  <strong>#{reservation.id}</strong>
                  {reservation.room && (
                    <>
                      {" "}
                      — Quarto {reservation.room.number},{" "}
                      {formatDate(reservation.checkIn)} →{" "}
                      {formatDate(reservation.checkOut)}
                    </>
                  )}
                  ?
                </Text>
              </Box>
              {error && (
                <Box
                  bg="red.50"
                  borderRadius="xl"
                  p={3}
                  border="1px solid"
                  borderColor="red.200"
                >
                  <Text fontSize="sm" color="red.600">
                    {error}
                  </Text>
                </Box>
              )}
            </VStack>
          </DialogBody>
          <DialogFooter px={6} pb={6} pt={4} gap={3}>
            <Button
              variant="outline"
              borderRadius="xl"
              flex={1}
              fontWeight="semibold"
              onClick={() => {
                setError(null);
                setView("detail");
              }}
            >
              Voltar
            </Button>
            <Button
              bg="red.600"
              color="white"
              borderRadius="xl"
              flex={1}
              fontWeight="semibold"
              _hover={{ bg: "red.500" }}
              loading={loading}
              loadingText="Cancelando…"
              onClick={handleCancel}
            >
              Confirmar Cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      );
    }

    // ── Serviço de quarto ─────────────────────────────────────────────────────
    if (view === "room-service") {
      return (
        <DialogContent
          maxW="460px"
          borderRadius="2xl"
          overflow="hidden"
          boxShadow="2xl"
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          <Box bg="sage.600" px={6} pt={6} pb={5}>
            <DialogHeader p={0}>
              <DialogTitle color="white" fontSize="xl" fontWeight="bold">
                Serviço de Quarto
              </DialogTitle>
            </DialogHeader>
            <Text color="whiteAlpha.800" fontSize="sm" mt={1}>
              Quarto {reservation.room?.number} · Reserva #{reservation.id}
            </Text>
          </Box>
          <DialogBody pt={6} pb={2} px={6}>
            <VStack align="stretch" gap={4}>
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.700"
                  mb={2}
                >
                  Mensagem para a equipe
                </Text>
                <Textarea
                  placeholder="Descreva o que você precisa… (opcional se solicitar limpeza)"
                  value={serviceMessage}
                  onChange={(e) => setServiceMessage(e.target.value)}
                  borderRadius="xl"
                  resize="none"
                  rows={4}
                  fontSize="sm"
                  borderColor="gray.200"
                  _focus={{
                    borderColor: "sage.400",
                    boxShadow: "0 0 0 1px var(--chakra-colors-sage-400)",
                  }}
                />
              </Box>

              {/* Checkbox manual */}
              <Box
                bg={requestCleaning ? "orange.50" : "gray.50"}
                borderRadius="xl"
                p={4}
                border="1px solid"
                borderColor={requestCleaning ? "orange.300" : "gray.200"}
                cursor="pointer"
                transition="all 0.2s"
                onClick={() => setRequestCleaning((v) => !v)}
              >
                <HStack gap={3} align="start">
                  <Box
                    w="20px"
                    h="20px"
                    borderRadius="md"
                    border="2px solid"
                    borderColor={requestCleaning ? "orange.400" : "gray.300"}
                    bg={requestCleaning ? "orange.400" : "white"}
                    flexShrink={0}
                    mt="1px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    transition="all 0.15s"
                  >
                    {requestCleaning && (
                      <Text
                        color="white"
                        fontSize="xs"
                        fontWeight="bold"
                        lineHeight={1}
                      >
                        ✓
                      </Text>
                    )}
                  </Box>
                  <VStack align="start" gap={0}>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color={requestCleaning ? "orange.700" : "gray.700"}
                    >
                      🧹 Solicitar limpeza do quarto
                    </Text>
                    <Text
                      fontSize="xs"
                      color={requestCleaning ? "orange.600" : "gray.500"}
                    >
                      Nossa equipe será notificada para limpar o quarto.
                    </Text>
                  </VStack>
                </HStack>
              </Box>

              {error && (
                <Box
                  bg="red.50"
                  borderRadius="xl"
                  p={3}
                  border="1px solid"
                  borderColor="red.200"
                >
                  <Text fontSize="sm" color="red.600">
                     {error}
                  </Text>
                </Box>
              )}
            </VStack>
          </DialogBody>
          <DialogFooter px={6} pb={6} pt={4} gap={3}>
            <Button
              variant="outline"
              borderRadius="xl"
              flex={1}
              fontWeight="semibold"
              onClick={() => {
                setError(null);
                setView("detail");
              }}
            >
              Voltar
            </Button>
            <Button
              bg="sage.600"
              color="white"
              borderRadius="xl"
              flex={1}
              fontWeight="semibold"
              _hover={{ bg: "sage.500" }}
              loading={loading}
              loadingText="Enviando…"
              disabled={!serviceMessage.trim() && !requestCleaning}
              onClick={handleRoomService}
            >
              Enviar Pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      );
    }

    // ── Detalhe principal ─────────────────────────────────────────────────────
    return (
      <DialogContent
        maxW="480px"
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="2xl"
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      >
        <Box bg="sage.600" px={6} pt={6} pb={5}>
          <DialogHeader p={0}>
            <DialogTitle color="white" fontSize="xl" fontWeight="bold">
              Detalhes da Reserva
            </DialogTitle>
          </DialogHeader>
          <HStack mt={2} gap={2}>
            <Box
              px={3}
              py={1}
              borderRadius="full"
              fontSize="xs"
              fontWeight="bold"
              color={cfg.color}
              bg="white"
            >
              {cfg.label}
            </Box>
            {reservation.room && (
              <Text color="whiteAlpha.800" fontSize="sm">
                Quarto {reservation.room.number} ·{" "}
                {ROOM_TYPE_LABEL[reservation.room.type] ??
                  reservation.room.type}
              </Text>
            )}
          </HStack>
        </Box>

        <DialogBody pt={6} pb={2} px={6}>
          <VStack align="stretch" gap={4}>
            {/* Datas e total */}
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
                    color="gray.400"
                    fontWeight="semibold"
                    letterSpacing="wider"
                  >
                    CHECK-IN
                  </Text>
                  <Text fontWeight="bold">
                    {formatDate(reservation.checkIn)}
                  </Text>
                </VStack>
                <Text color="gray.300" fontSize="xl">
                  →
                </Text>
                <VStack align="end" gap={0}>
                  <Text
                    fontSize="xs"
                    color="gray.400"
                    fontWeight="semibold"
                    letterSpacing="wider"
                  >
                    CHECK-OUT
                  </Text>
                  <Text fontWeight="bold">
                    {formatDate(reservation.checkOut)}
                  </Text>
                </VStack>
              </HStack>
              <Box mt={3} pt={3} borderTop="1px solid" borderColor="gray.200">
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.500">
                    {nights} {nights === 1 ? "noite" : "noites"}
                  </Text>
                  <Text fontSize="sm" fontWeight="extrabold" color="sage.700">
                    {formatCurrency(reservation.totalPrice)}
                  </Text>
                </HStack>
              </Box>
            </Box>

            {/* Ações por status */}
            <VStack align="stretch" gap={2}>
              {reservation.status === "CONFIRMED" && (
                <>
                  <Button
                    bg="blue.600"
                    color="white"
                    borderRadius="xl"
                    fontWeight="semibold"
                    _hover={{ bg: "blue.500" }}
                    loading={loading}
                    loadingText="Processando…"
                    onClick={handleCheckin}
                  >
                    🏨 Realizar Check-in
                  </Button>
                  <Button
                    variant="outline"
                    borderRadius="xl"
                    fontWeight="semibold"
                    borderColor="red.300"
                    color="red.600"
                    _hover={{ bg: "red.50" }}
                    onClick={() => {
                      setError(null);
                      setView("confirm-cancel");
                    }}
                  >
                    ✕ Cancelar Reserva
                  </Button>
                </>
              )}

              {reservation.status === "CHECKED_IN" && (
                <>
                  {/* Botão desabilitado se quarto já estiver DIRTY */}
                  <Button
                    bg={roomDirty ? "gray.100" : "sage.600"}
                    color={roomDirty ? "gray.400" : "white"}
                    borderRadius="xl"
                    fontWeight="semibold"
                    _hover={{ bg: roomDirty ? "gray.100" : "sage.500" }}
                    disabled={roomDirty}
                    cursor={roomDirty ? "not-allowed" : "pointer"}
                    onClick={() => {
                      if (!roomDirty) {
                        setError(null);
                        setView("room-service");
                      }
                    }}
                  >
                    🛎{" "}
                    {roomDirty
                      ? "Limpeza já solicitada"
                      : "Solicitar Serviço de Quarto"}
                  </Button>

                  {roomDirty && (
                    <Box
                      bg="orange.50"
                      borderRadius="xl"
                      p={3}
                      border="1px solid"
                      borderColor="orange.200"
                    >
                      <Text fontSize="xs" color="orange.700" textAlign="center">
                        🧹 Sua solicitação de limpeza está em andamento.
                      </Text>
                    </Box>
                  )}

                  <Button
                    bg="gray.700"
                    color="white"
                    borderRadius="xl"
                    fontWeight="semibold"
                    _hover={{ bg: "gray.600" }}
                    loading={loading}
                    loadingText="Processando…"
                    onClick={handleCheckout}
                  >
                    🚪 Realizar Check-out
                  </Button>
                </>
              )}

              {(reservation.status === "CHECKED_OUT" ||
                reservation.status === "CANCELED") && (
                <Box
                  bg="gray.50"
                  borderRadius="xl"
                  p={4}
                  border="1px solid"
                  borderColor="gray.200"
                  textAlign="center"
                >
                  <Text fontSize="sm" color="gray.500">
                    {reservation.status === "CHECKED_OUT"
                      ? "Esta reserva foi finalizada."
                      : "Esta reserva foi cancelada."}
                  </Text>
                </Box>
              )}
            </VStack>

            {error && (
              <Box
                bg="red.50"
                borderRadius="xl"
                p={3}
                border="1px solid"
                borderColor="red.200"
              >
                <Text fontSize="sm" color="red.600">
                   {error}
                </Text>
              </Box>
            )}
          </VStack>
        </DialogBody>

        <DialogFooter px={6} pb={6} pt={4}>
          <DialogCloseTrigger asChild>
            <Button
              variant="outline"
              borderRadius="xl"
              w="full"
              fontWeight="semibold"
            >
              Fechar
            </Button>
          </DialogCloseTrigger>
        </DialogFooter>
      </DialogContent>
    );
  };

  return (
    <DialogRoot
      open={open}
      onOpenChange={handleOpenChange}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogBackdrop />
      {renderContent()}
    </DialogRoot>
  );
}
