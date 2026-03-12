import { Box, Flex, Heading, Button, VStack, Text } from "@chakra-ui/react";
import HeroVideo from "./backgroundVid";
import { getDefaultDates, formatDate } from "@/utils/date";
import { useEffect, useRef, useState } from "react";

const ZOOM_START = 1.5;
const ZOOM_END = 1.0;
const ZOOM_SCROLL_DISTANCE = 300;

const HeroSection = () => {
  const { checkIn, checkOut } = getDefaultDates();
  const [zoom, setZoom] = useState(ZOOM_START);
  const virtualScroll = useRef(0); 
  const isLocked = useRef(true);   

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isLocked.current) return;
      e.preventDefault();

      virtualScroll.current = Math.min(
        virtualScroll.current + e.deltaY,
        ZOOM_SCROLL_DISTANCE
      );

      virtualScroll.current = Math.max(virtualScroll.current, 0);

      const progress = virtualScroll.current / ZOOM_SCROLL_DISTANCE;
      const newZoom = ZOOM_START - progress * (ZOOM_START - ZOOM_END);
      setZoom(newZoom);

      if (virtualScroll.current >= ZOOM_SCROLL_DISTANCE) {
        isLocked.current = false;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <Box position="relative" w="full" h="100vh">
      <HeroVideo zoom={zoom} />

      <Box
        position="absolute"
        zIndex="1"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="start"
        w="40vh"
        h="100vh"
        marginLeft="60px"
      >
        <Heading textStyle="logo">HOTEL DISC PROG WEB</Heading>
      </Box>

      <Flex position="absolute" top="75%" right="100px" gap={10} zIndex={2}>
        <VStack align="center">
          <Text fontSize="xs" fontWeight="bold"> CHECK-IN - CHECK-OUT </Text>
          <Button size="xl" bg="transparent" color="white" border="1px solid" borderColor="whiteAlpha.700">
            {formatDate(checkIn)} → {formatDate(checkOut)}
          </Button>
        </VStack>

        <VStack align="center">
          <Text fontSize="xs" fontWeight="bold"> CONVIDADOS E QUARTO </Text>
          <Button size="xl" bg="transparent" color="white" border="1px solid" borderColor="whiteAlpha.700">
            2 adultos, suíte master
          </Button>
        </VStack>

        <VStack align="center">
          <Text fontSize="xs" fontWeight="bold">PREÇO ESTIMADO</Text>
          <Button size="xl" bg="transparent" color="white" border="1px solid" borderColor="whiteAlpha.700">
            Verificar preço
          </Button>
        </VStack>
      </Flex>
    </Box>
  );
};

export default HeroSection;