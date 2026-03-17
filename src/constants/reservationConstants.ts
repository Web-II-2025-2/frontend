import type { ReservationStatus } from "@/types/reservation";

export const ROOM_TYPE_LABEL: Record<string, string> = {
  SINGLE: "Single",
  STANDARD_CASAL: "Standard Casal",
  SUITE: "Suíte",
  DELUXE: "Deluxe",
};

export const STATUS_CONFIG: Record<
  ReservationStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  CONFIRMED:   { label: "Confirmada",  color: "#2d7a4f", bg: "#f0fdf4", border: "#bbf7d0" },
  CHECKED_IN:  { label: "Hospedado",   color: "#1e40af", bg: "#eff6ff", border: "#bfdbfe" },
  CHECKED_OUT: { label: "Finalizada",  color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb" },
  CANCELED:    { label: "Cancelada",   color: "#b91c1c", bg: "#fef2f2", border: "#fecaca" },
};