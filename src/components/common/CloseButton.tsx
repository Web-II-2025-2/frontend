import { Button, DialogCloseTrigger } from "@chakra-ui/react";
import { X } from "lucide-react";

type DialogCloseButtonProps = {
  top?: string;
  right?: string;
};

export function DialogCloseButton({
  top = "12px",
  right = "12px",
}: DialogCloseButtonProps) {
  return (
    <DialogCloseTrigger asChild>
      <Button
        position="absolute"
        top={top}
        right={right}
        variant="ghost"
        size="xs"
        color="whiteAlpha.700"
        _hover={{ color: "white", bg: "red.500" }}
        borderRadius="full"
        minW="auto"
        p={1}
      >
        <X size={20} />
      </Button>
    </DialogCloseTrigger>
  );
}