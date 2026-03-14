"use client";

import { Box, Heading } from "@chakra-ui/react";
import { BookingBar } from "./bookingBar";
import HeroVideo from "./backgroundVid";

const HeroSection = () => {
  return (
    <Box position="relative" w="full" h="100vh">
      <HeroVideo zoom={1} />

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

      <BookingBar />
    </Box>
  );
};

export default HeroSection;
