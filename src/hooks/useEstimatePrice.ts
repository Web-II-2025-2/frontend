import api from "@/services/api";
import axios from "axios";
import { useState } from "react";

export function useEstimatePrice() {
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