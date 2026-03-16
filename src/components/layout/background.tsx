import { Box, Image } from "@chakra-ui/react";
import hotelImage from "@/assets/images/hotel3.jpg";

interface HeroImageProps {
  zoom: number;
}

const HeroImage = ({ zoom }: HeroImageProps) => {
  return (
    <Box position="absolute" height="100vh" overflow="hidden" zIndex="0" width="100%">
      <Image
        src={hotelImage}
        alt="Hotel"
        width="100%"
        height="100%"
        objectFit="cover"
        transform={`scale(${zoom})`}
        transition="transform 0.5s ease-out"
      />
    </Box>
  );
};

export default HeroImage;