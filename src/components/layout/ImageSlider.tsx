import { VStack, HStack, IconButton, Box } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";


interface SliderControlsProps {
  slide: number;
  setSlide: React.Dispatch<React.SetStateAction<number>>;
  total: number;
}

const ImageSlider = ({ slide, setSlide, total }: SliderControlsProps) => {
  return (
    <VStack gap="3">
      <HStack gap="3">
        <IconButton
          aria-label="anterior"
          onClick={() => setSlide((s) => (s - 1 + total) % total)}
          size="sm"
          borderRadius="full"
          borderColor="sage.500"
          color="sage.600"
          background="sage.100"
        >
          <ChevronLeft size={18} />
        </IconButton>

        <IconButton
          aria-label="próximo"
          onClick={() => setSlide((s) => (s + 1) % total)}
          size="sm"
          borderRadius="full"
          borderColor="sage.500"
          color="sage.600"
          background="sage.100"
        >
          <ChevronRight size={18} />
        </IconButton>
      </HStack>

      <HStack gap="2">
        {Array.from({ length: total }).map((_, i) => (
          <Box
            key={i}
            onClick={() => setSlide(i)}
            w={i === slide ? "22px" : "8px"}
            h="8px"
            borderRadius="full"
            bg={i === slide ? "sage.500" : "sage.300"}
            cursor="pointer"
            transition="all 0.3s"
          />
        ))}
      </HStack>
    </VStack>
  );
};

export default ImageSlider;
