import { useState, useEffect } from "react";
import axios from "axios";
import type { GuestProfile } from "@/types/profile";
import { fetchGuestProfile } from "@/services/ProfileService";

export function useGuestProfile() {
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGuestProfile()
      .then(setProfile)
      .catch((err) => {
        setError(
          axios.isAxiosError(err)
            ? (err.response?.data?.message ?? err.message)
            : "Erro ao carregar perfil."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return { profile, loading, error };
}