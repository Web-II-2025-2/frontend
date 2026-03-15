import { Box } from "@chakra-ui/react";
import hotelVideo from "@/assets/videos/hotel.mp4";

interface HeroVideoProps {
  zoom: number;
}

const HeroVideo = ({ zoom }: HeroVideoProps) => {
  return (
    <Box position="absolute" height="100vh" overflow="hidden" zIndex="0" width="100%">
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom})`,
          transition: "transform 0.5s ease-out",
        }}
      >
        <source src={hotelVideo} type="video/mp4" />
      </video>
    </Box>
  );
};

export default HeroVideo;