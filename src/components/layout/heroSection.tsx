"use client";

import { Box, Heading } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import HeroImage from "./background";
import { BookingBar } from "./bookingBar";

const ZOOM_START = 1.3;
const ZOOM_END = 1.0;
const ZOOM_SCROLL_DISTANCE = 400;

const HeroSection = () => {

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const [zoom, setZoom] = useState(ZOOM_START);
  const virtualScroll = useRef(0);
  const isLocked = useRef(true);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isLocked.current) return;
      e.preventDefault();
      virtualScroll.current = Math.min(
        virtualScroll.current + e.deltaY,
        ZOOM_SCROLL_DISTANCE,
      );
      virtualScroll.current = Math.max(virtualScroll.current, 0);
      const progress = virtualScroll.current / ZOOM_SCROLL_DISTANCE;
      setZoom(ZOOM_START - progress * (ZOOM_START - ZOOM_END));
      if (virtualScroll.current >= ZOOM_SCROLL_DISTANCE)
        isLocked.current = false;
    };
    const handlePageScroll = () => {
      if (window.scrollY === 0) {
        isLocked.current = true;
        virtualScroll.current = 0;
        setZoom(ZOOM_START);
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handlePageScroll);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handlePageScroll);
    };
  }, []);

  return (
    <Box position="relative" w="full" h="100vh">
      <HeroImage zoom={zoom} />

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
        bgGradient="linear(to-b, rgba(0,0,0,0.25), rgba(0,0,0,0.55))"
      >
        <Heading textStyle="logo" textShadow="0 2px 8px rgba(0,0,0,0.45)">HOTEL DISC PROG WEB</Heading>
      </Box>

      <BookingBar />
    </Box>
  );
};

export default HeroSection;
