import { confirmBooking } from "@/hooks/confirmBooking";
import { useEstimatePrice } from "@/hooks/useEstimatePrice";
import { nightsBetween } from "@/utils/formatters";
import {
  DialogRoot,
  DialogBackdrop,
  DialogContent,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookingConfirmContent } from "./BookingConfirmContent";
import { BookingUnavailableContent } from "./BookingUnavailableContent";
import { BookingSuccessContent } from "./BookingSucessContent";
import type { DateRange } from "react-day-picker";
import type { Room } from "@/types/room";

type BookingConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  room: Room | null;
  noRoomAvailable: boolean;
  dateRange?: DateRange;
  chosenRoomTypeLabel: string;
  onConfirm: () => Promise<void>;
  roomTypeLabelMap: Record<string, string>;
};

export function BookingConfirmDialog({
  open,
  onClose,
  room,
  noRoomAvailable,
  dateRange,
  chosenRoomTypeLabel,
  onConfirm,
  roomTypeLabelMap,
}: BookingConfirmDialogProps) {
  const navigate = useNavigate();

  const {
    totalPrice,
    loading: estimating,
    error: estimateError,
    estimate,
    reset,
  } = useEstimatePrice();

  const {
    confirming,
    confirmError,
    success,
    handleConfirm,
    reset: resetConfirm,
  } = confirmBooking(onConfirm);

  const nights = nightsBetween(dateRange?.from, dateRange?.to);

  useEffect(() => {
    if (open && room && dateRange?.from && dateRange?.to && !noRoomAvailable) {
      estimate(room.id, dateRange.from, dateRange.to);
    }
    if (!open) {
      reset();
      resetConfirm();
    }
  }, [open, room, dateRange, noRoomAvailable]);

  const handleGoToReservations = () => {
    onClose();
    navigate("/profile/reservations");
  };

  const canConfirm =
    !!room &&
    !!dateRange?.from &&
    !!dateRange?.to &&
    !estimating &&
    !confirming;

  const maxW = noRoomAvailable ? "420px" : "460px";

  return (
    <DialogRoot
      open={open}
      onOpenChange={(d) => !d.open && onClose()}
      placement="center"
      closeOnInteractOutside={false}
    >
      <DialogBackdrop />

      <DialogContent
        maxW={maxW}
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="2xl"
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      >
        {noRoomAvailable ? (
          <BookingUnavailableContent
            chosenRoomTypeLabel={chosenRoomTypeLabel}
            dateRange={dateRange}
            onClose={onClose}
          />
        ) : success ? (
          <BookingSuccessContent
            room={room}
            dateRange={dateRange}
            nights={nights}
            totalPrice={totalPrice}
            roomTypeLabelMap={roomTypeLabelMap}
            onClose={onClose}
            onGoToReservations={handleGoToReservations}
          />
        ) : (
          <BookingConfirmContent
            room={room}
            dateRange={dateRange}
            totalPrice={totalPrice}
            nights={nights}
            estimating={estimating}
            estimateError={estimateError}
            confirming={confirming}
            confirmError={confirmError}
            onConfirm={handleConfirm}
            canConfirm={canConfirm}
            roomTypeLabelMap={roomTypeLabelMap}
          />
        )}
      </DialogContent>
    </DialogRoot>
  );
}