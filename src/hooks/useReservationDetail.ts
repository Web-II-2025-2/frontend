import { useState, useEffect } from "react";
import axios from "axios";
import type { Reservation, ReservationView } from "@/types/reservation";
import {
  fetchRoomById,
  performCheckin,
  performCheckout,
  cancelReservation,
  requestRoomService,
} from "@/services/ReservationService";

interface UseReservationDetailProps {
  open: boolean;
  reservation: Reservation | null;
  onClose: () => void;
  onUpdated: () => void;
}

export function useReservationDetail({
  open,
  reservation,
  onClose,
  onUpdated,
}: UseReservationDetailProps) {
  const [view, setView] = useState<ReservationView>("detail");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [serviceMessage, setServiceMessage] = useState("");
  const [requestCleaning, setRequestCleaning] = useState(false);
  const [roomDirty, setRoomDirty] = useState(false);

  useEffect(() => {
    if (open && reservation?.status === "CHECKED_IN" && reservation?.roomId) {
      fetchRoomById(reservation.roomId)
        .then((room) => setRoomDirty(room.status === "DIRTY"))
        .catch(() => setRoomDirty(false));
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
          : "Ocorreu um erro. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckin = () =>
    withLoading(async () => {
      await performCheckin(reservation!.id);
      setSuccessMsg("Check-in realizado com sucesso!");
      setView("success");
      onUpdated();
    });

  const handleCheckout = () =>
    withLoading(async () => {
      await performCheckout(reservation!.id);
      setSuccessMsg("Check-out realizado com sucesso!");
      setView("success");
      onUpdated();
    });

  const handleCancel = () =>
    withLoading(async () => {
      await cancelReservation(reservation!.id);
      setSuccessMsg("Reserva cancelada com sucesso.");
      setView("success");
      onUpdated();
    });

  const handleRoomService = () =>
    withLoading(async () => {
      if (!serviceMessage.trim() && !requestCleaning) {
        throw new Error("Preencha a mensagem ou selecione solicitar limpeza.");
      }
      await requestRoomService(
        reservation!.id,
        serviceMessage.trim() || "Sem mensagem adicional.",
        requestCleaning
      );
      setSuccessMsg(
        requestCleaning
          ? "Pedido enviado e limpeza solicitada!"
          : "Pedido de serviço enviado com sucesso!"
      );
      setView("success");
      onUpdated();
    });

  return {
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
  };
}