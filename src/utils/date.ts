export function getDefaultDates() {
  const today = new Date();

  const checkIn = new Date(today);
  checkIn.setDate(today.getDate() + 1);

  const checkOut = new Date(today);
  checkOut.setDate(today.getDate() + 3);

  return { checkIn, checkOut };
}

export function formatDate(date: Date | undefined) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
