import { Box, Heading } from "@chakra-ui/react";
import HeroVideo from "./backgroundVid";

const HeroSection = () => {
  return (
    <Box position="relative" w="full">
      <HeroVideo />
      <Box
        position="absolute"
        zIndex="1"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="start"
        w="40vh"
        h="100vh"
        marginLeft="20"
      >
        <Heading textStyle="logo"> HOTEL DISC PROG WEB</Heading>
      </Box>
    </Box>
  );
};

export default HeroSection;
