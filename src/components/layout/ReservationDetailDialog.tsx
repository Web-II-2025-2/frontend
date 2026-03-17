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
import type { Reservation } from "@/types/reservation";
import { useReservationDetail } from "@/hooks/useReservationDetail";
import { ROOM_TYPE_LABEL, STATUS_CONFIG } from "@/constants/reservationConstants";
import { DialogCloseButton } from "../common/CloseButton";
import { formatCurrency, nightsBetween } from "@/utils/formatters";
import { formatDate } from "@/utils/date";


interface ReservationDetailDialogProps {
  open: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  onUpdated: () => void;
}

export function ReservationDetailDialog({
  open,
  onClose,
  reservation,
  onUpdated,
}: ReservationDetailDialogProps) {
  const {
    view,
    setView,
    loading,
    error,
    setError,
    successMsg,
    serviceMessage,
    setServiceMessage,
    requestCleaning,
    setRequestCleaning,
    roomDirty,
    handleClose,
    handleOpenChange,
    handleCheckin,
    handleCheckout,
    handleCancel,
    handleRoomService,
  } = useReservationDetail({ open, reservation, onClose, onUpdated });

  if (!reservation) return null;

  const cfg = STATUS_CONFIG[reservation.status];
  const checkIn = new Date(reservation.checkIn);
  const checkOut = new Date(reservation.checkOut);
  const nights = nightsBetween(checkIn, checkOut);


  if (view === "success") {
    return (
      <DialogRoot open={open} onOpenChange={handleOpenChange} placement="center" closeOnInteractOutside={false}>
        <DialogBackdrop />
        <DialogContent maxW="420px" borderRadius="2xl" overflow="hidden" boxShadow="2xl">
          <Box bg="green.500" px={6} pt={6} pb={5} textAlign="center" position="relative">
            <DialogCloseButton />
            <Text fontSize="4xl" mb={2}>✅</Text>
            <DialogHeader p={0}>
              <DialogTitle color="white" fontSize="xl" fontWeight="bold">Pronto!</DialogTitle>
            </DialogHeader>
            <Text color="whiteAlpha.900" fontSize="sm" mt={1}>{successMsg}</Text>
          </Box>
          <DialogFooter px={6} pb={6} pt={6}>
            <Button bg="sage.600" color="white" borderRadius="xl" w="full" fontWeight="semibold" _hover={{ bg: "sage.500" }} onClick={handleClose}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    );
  }

  if (view === "confirm-cancel") {
    return (
      <DialogRoot open={open} onOpenChange={handleOpenChange} placement="center" closeOnInteractOutside={false}>
        <DialogBackdrop />
        <DialogContent maxW="420px" borderRadius="2xl" overflow="hidden" boxShadow="2xl">
          <Box bg="red.600" px={6} pt={6} pb={5} position="relative">
            <DialogCloseButton />
            <DialogHeader p={0}>
              <DialogTitle color="white" fontSize="xl" fontWeight="bold">Cancelar Reserva</DialogTitle>
            </DialogHeader>
            <Text color="whiteAlpha.800" fontSize="sm" mt={1}>Esta ação não pode ser desfeita.</Text>
          </Box>
          <DialogBody pt={6} pb={2} px={6}>
            <VStack align="stretch" gap={3}>
              <Box bg="red.50" borderRadius="xl" p={4} border="1px solid" borderColor="red.200">
                <Text fontSize="sm" color="red.700">
                  Tem certeza que deseja cancelar a reserva <strong>#{reservation.id}</strong>
                  {reservation.room && (
                    <> — Quarto {reservation.room.number}, {checkIn} → {checkOut}</>
                  )}?
                </Text>
              </Box>
              {error && (
                <Box bg="red.50" borderRadius="xl" p={3} border="1px solid" borderColor="red.200">
                  <Text fontSize="sm" color="red.600">⚠ {error}</Text>
                </Box>
              )}
            </VStack>
          </DialogBody>
          <DialogFooter px={6} pb={6} pt={4} gap={3}>
            <Button variant="outline" borderRadius="xl" flex={1} fontWeight="semibold" onClick={() => { setError(null); setView("detail"); }}>
              Voltar
            </Button>
            <Button bg="red.600" color="white" borderRadius="xl" flex={1} fontWeight="semibold" _hover={{ bg: "red.500" }} loading={loading} loadingText="Cancelando…" onClick={handleCancel}>
              Confirmar Cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    );
  }

  if (view === "room-service") {
    return (
      <DialogRoot open={open} onOpenChange={handleOpenChange} placement="center" closeOnInteractOutside={false}>
        <DialogBackdrop />
        <DialogContent maxW="460px" borderRadius="2xl" overflow="hidden" boxShadow="2xl">
          <Box bg="sage.600" px={6} pt={6} pb={5} position="relative">
            <DialogCloseButton />
            <DialogHeader p={0}>
              <DialogTitle color="white" fontSize="xl" fontWeight="bold">Serviço de Quarto</DialogTitle>
            </DialogHeader>
            <Text color="whiteAlpha.800" fontSize="sm" mt={1}>
              Quarto {reservation.room?.number} · Reserva #{reservation.id}
            </Text>
          </Box>
          <DialogBody pt={6} pb={2} px={6}>
            <VStack align="stretch" gap={4}>
              <Box>
                <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
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
                  _focus={{ borderColor: "sage.400", boxShadow: "0 0 0 1px var(--chakra-colors-sage-400)" }}
                />
              </Box>

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
                    w="20px" h="20px" borderRadius="md" border="2px solid"
                    borderColor={requestCleaning ? "orange.400" : "gray.300"}
                    bg={requestCleaning ? "orange.400" : "white"}
                    flexShrink={0} mt="1px"
                    display="flex" alignItems="center" justifyContent="center"
                    transition="all 0.15s"
                  >
                    {requestCleaning && (
                      <Text color="white" fontSize="xs" fontWeight="bold" lineHeight={1}>✓</Text>
                    )}
                  </Box>
                  <VStack align="start" gap={0}>
                    <Text fontSize="sm" fontWeight="semibold" color={requestCleaning ? "orange.700" : "gray.700"}>
                      🧹 Solicitar limpeza do quarto
                    </Text>
                    <Text fontSize="xs" color={requestCleaning ? "orange.600" : "gray.500"}>
                      Nossa equipe será notificada para limpar o quarto.
                    </Text>
                  </VStack>
                </HStack>
              </Box>

              {error && (
                <Box bg="red.50" borderRadius="xl" p={3} border="1px solid" borderColor="red.200">
                  <Text fontSize="sm" color="red.600">⚠ {error}</Text>
                </Box>
              )}
            </VStack>
          </DialogBody>
          <DialogFooter px={6} pb={6} pt={4} gap={3}>
            <Button variant="outline" borderRadius="xl" flex={1} fontWeight="semibold" onClick={() => { setError(null); setView("detail"); }}>
              Voltar
            </Button>
            <Button
              bg="sage.600" color="white" borderRadius="xl" flex={1} fontWeight="semibold"
              _hover={{ bg: "sage.500" }} loading={loading} loadingText="Enviando…"
              disabled={!serviceMessage.trim() && !requestCleaning}
              onClick={handleRoomService}
            >
              Enviar Pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    );
  }

  return (
    <DialogRoot open={open} onOpenChange={handleOpenChange} placement="center" closeOnInteractOutside={false}>
      <DialogBackdrop />
      <DialogContent maxW="480px" borderRadius="2xl" overflow="hidden" boxShadow="2xl">
        <Box bg="sage.600" px={6} pt={6} pb={5} position="relative">
          <DialogCloseButton />
          <DialogHeader p={0}>
            <DialogTitle color="white" fontSize="xl" fontWeight="bold">Detalhes da Reserva</DialogTitle>
          </DialogHeader>
          <HStack mt={2} gap={2}>
            <Box px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="bold" color={cfg.color} bg="white">
              {cfg.label}
            </Box>
            {reservation.room && (
              <Text color="whiteAlpha.800" fontSize="sm">
                Quarto {reservation.room.number} · {ROOM_TYPE_LABEL[reservation.room.type] ?? reservation.room.type}
              </Text>
            )}
          </HStack>
        </Box>

        <DialogBody pt={6} pb={2} px={6}>
          <VStack align="stretch" gap={4}>
            <Box bg="gray.50" borderRadius="xl" p={4} border="1px solid" borderColor="gray.100">
              <HStack justify="space-between">
                <VStack align="start" gap={0}>
                  <Text fontSize="xs" color="gray.400" fontWeight="semibold" letterSpacing="wider">CHECK-IN</Text>
                  <Text fontWeight="bold">{formatDate(checkIn)}</Text>
                </VStack>
                <Text color="gray.300" fontSize="xl">→</Text>
                <VStack align="end" gap={0}>
                  <Text fontSize="xs" color="gray.400" fontWeight="semibold" letterSpacing="wider">CHECK-OUT</Text>
                  <Text fontWeight="bold">{formatDate(checkOut)}</Text>
                </VStack>
              </HStack>
              <Box mt={3} pt={3} borderTop="1px solid" borderColor="gray.200">
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.500">{nights} {nights === 1 ? "noite" : "noites"}</Text>
                  <Text fontSize="sm" fontWeight="extrabold" color="sage.700">{formatCurrency(reservation.totalPrice)}</Text>
                </HStack>
              </Box>
            </Box>

            <VStack align="stretch" gap={2}>
              {reservation.status === "CONFIRMED" && (
                <>
                  <Button bg="blue.600" color="white" borderRadius="xl" fontWeight="semibold" _hover={{ bg: "blue.500" }} loading={loading} loadingText="Processando…" onClick={handleCheckin}>
                    🏨 Realizar Check-in
                  </Button>
                  <Button variant="outline" borderRadius="xl" fontWeight="semibold" borderColor="red.300" color="red.600" _hover={{ bg: "red.50" }} onClick={() => { setError(null); setView("confirm-cancel"); }}>
                    ✕ Cancelar Reserva
                  </Button>
                </>
              )}

              {reservation.status === "CHECKED_IN" && (
                <>
                  <Button
                    bg={roomDirty ? "gray.100" : "sage.600"}
                    color={roomDirty ? "gray.400" : "white"}
                    borderRadius="xl" fontWeight="semibold"
                    _hover={{ bg: roomDirty ? "gray.100" : "sage.500" }}
                    disabled={roomDirty}
                    cursor={roomDirty ? "not-allowed" : "pointer"}
                    onClick={() => { if (!roomDirty) { setError(null); setView("room-service"); } }}
                  >
                    🛎 {roomDirty ? "Limpeza já solicitada" : "Solicitar Serviço de Quarto"}
                  </Button>

                  {roomDirty && (
                    <Box bg="orange.50" borderRadius="xl" p={3} border="1px solid" borderColor="orange.200">
                      <Text fontSize="xs" color="orange.700" textAlign="center">
                        🧹 Sua solicitação de limpeza está em andamento.
                      </Text>
                    </Box>
                  )}

                  <Button bg="gray.700" color="white" borderRadius="xl" fontWeight="semibold" _hover={{ bg: "gray.600" }} loading={loading} loadingText="Processando…" onClick={handleCheckout}>
                    🚪 Realizar Check-out
                  </Button>
                </>
              )}

              {(reservation.status === "CHECKED_OUT" || reservation.status === "CANCELED") && (
                <Box bg="gray.50" borderRadius="xl" p={4} border="1px solid" borderColor="gray.200" textAlign="center">
                  <Text fontSize="sm" color="gray.500">
                    {reservation.status === "CHECKED_OUT" ? "Esta reserva foi finalizada." : "Esta reserva foi cancelada."}
                  </Text>
                </Box>
              )}
            </VStack>

            {error && (
              <Box bg="red.50" borderRadius="xl" p={3} border="1px solid" borderColor="red.200">
                <Text fontSize="sm" color="red.600"> {error}</Text>
              </Box>
            )}
          </VStack>
        </DialogBody>

        <DialogFooter px={6} pb={6} pt={4}>
          <DialogCloseTrigger asChild>
            <Button variant="outline" borderRadius="xl" w="full" fontWeight="semibold">
              Fechar
            </Button>
          </DialogCloseTrigger>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}