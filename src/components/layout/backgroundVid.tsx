import { Box, HStack } from "@chakra-ui/react"
import hotelVideo from "@/assets/videos/hotel.mp4"

const HeroVideo = () => {
  return (
    <Box position="relative" height="100vh" overflow="hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }}
      >
        <source src={hotelVideo} type="video/mp4" />
      </video>

      <HStack>
        LOUCURAS
      </HStack>
    </Box>
  )
}

export default HeroVideo