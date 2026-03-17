import {
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  Box,
  Text,
  Button,
} from "@chakra-ui/react";

import type { DateRange } from "react-day-picker";
import { formatDate } from "@/utils/date";

type BookingUnavailableContentProps = {
  chosenRoomTypeLabel: string;
  dateRange?: DateRange;
  onClose: () => void;
};

export function BookingUnavailableContent({
  chosenRoomTypeLabel,
  dateRange,
  onClose,
}: BookingUnavailableContentProps) {
  return (
    <>
      <Box bg="red.600" px={6} pt={6} pb={5}>
        <DialogHeader p={0}>
          <DialogTitle color="white" fontSize="xl" fontWeight="bold">
            Sem Disponibilidade
          </DialogTitle>
        </DialogHeader>
        <Text color="whiteAlpha.800" fontSize="sm" mt={1}>
          {chosenRoomTypeLabel}
        </Text>
      </Box>

      <DialogBody pt={6} pb={2} px={6}>
        <Box
          bg="red.50"
          borderRadius="xl"
          p={4}
          border="1px solid"
          borderColor="red.200"
        >
          <Text fontSize="sm" color="red.700" fontWeight="semibold" mb={1}>
            Nenhum quarto disponível
          </Text>
          <Text fontSize="sm" color="red.600">
            Não encontramos quartos do tipo{" "}
            <strong>{chosenRoomTypeLabel}</strong> para{" "}
            {formatDate(dateRange?.from)} → {formatDate(dateRange?.to)}.
          </Text>
          <Text fontSize="xs" color="red.500" mt={2}>
            Tente outras datas ou escolha um tipo diferente.
          </Text>
        </Box>
      </DialogBody>

      <DialogFooter px={6} pb={6} pt={4}>
        <DialogCloseTrigger asChild>
          <Button
            bg="sage.600"
            color="white"
            borderRadius="xl"
            w="full"
            fontWeight="semibold"
            _hover={{ bg: "sage.500" }}
            onClick={onClose}
          >
            Alterar Busca
          </Button>
        </DialogCloseTrigger>
      </DialogFooter>
    </>
  );
}