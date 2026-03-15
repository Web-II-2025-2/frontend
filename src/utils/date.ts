export function getDefaultDates() {
  const today = new Date()

  const checkIn = new Date(today)
  checkIn.setDate(today.getDate() + 1)

  const checkOut = new Date(today)
  checkOut.setDate(today.getDate() + 3)
  
  return { checkIn, checkOut }
}

export function formatDate(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  })
}