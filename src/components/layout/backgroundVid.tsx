import { Box } from "@chakra-ui/react"
import hotelVideo from "@/assets/videos/hotel.mp4"

const HeroVideo = () => {
  return (
    <Box position="absolute" height="100vh" overflow="hidden" zIndex="0">
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }}
      >
        <source src={hotelVideo} type="video/mp4" />
      </video>
    </Box>
  )
}

export default HeroVideo