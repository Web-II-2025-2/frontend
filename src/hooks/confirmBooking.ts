import axios from "axios";
import { useState } from "react";

export function confirmBooking(onConfirm: () => Promise<void>) {
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

  const reset = () => {
    setConfirmError(null);
    setSuccess(false);
    setConfirming(false);
  };

  return { confirming, confirmError, success, handleConfirm, reset };
}
