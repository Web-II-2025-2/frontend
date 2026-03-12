import { Box } from "@chakra-ui/react"
import hotelVideo from "@/assets/videos/hotel.mp4"
import { useEffect, useState } from "react"

const HeroVideo = () => {
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    const handleWheel = (e: any) => {
      if (e.ctrlKey) {
        e.preventDefault()

        setZoom((prev) => {
          const next = prev - e.deltaY * 0.001
          return Math.min(Math.max(next, 1), 3)
        })
      }
    }
    window.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      window.removeEventListener("wheel", handleWheel)
    }
  }, [])

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
          objectFit: "cover",
          transform: `scale(${zoom})`,
          transition: "transform 0.1s linear"
        }}
      >
        <source src={hotelVideo} type="video/mp4" />
      </video>
    </Box>
  )
}

export default HeroVideo