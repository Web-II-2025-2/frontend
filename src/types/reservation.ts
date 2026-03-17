export interface Reservation {
  id: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: "CONFIRMED" | "CANCELED" | "CHECKED_IN" | "CHECKED_OUT";
  room?: { number: string; type: string };
}
 
export type ReservationStatus = Reservation["status"];
 
export type ReservationView = "detail" | "room-service" | "confirm-cancel" | "success";