import { useState, useEffect } from "react";
import axios from "axios";
import type { Reservation } from "@/types/reservation";
import { fetchMyReservations } from "@/services/ProfileService";

export function useReservationsList() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
    
  const load = () => {
    setLoading(true);
    fetchMyReservations()
      .then(setReservations)
      .catch((err) => {
        setError(
          axios.isAxiosError(err)
            ? (err.response?.data?.message ?? err.message)
            : "Erro ao carregar reservas."
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCardClick = (r: Reservation) => {
    setSelected(r);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleUpdated = () => {
    fetchMyReservations()
      .then((data) => {
        setReservations(data);
        if (selected) {
          const updated = data.find((r) => r.id === selected.id);
          if (updated) setSelected(updated);
        }
      })
      .catch(() => {});
  };

  return {
    reservations,
    loading,
    error,
    selected,
    dialogOpen,
    handleCardClick,
    handleDialogClose,
    handleUpdated,
  };
}