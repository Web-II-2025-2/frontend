import { Box, Flex, Heading, Button, VStack, Text } from "@chakra-ui/react";
import HeroVideo from "./backgroundVid";
import { getDefaultDates, formatDate } from "@/utils/date";

const HeroSection = () => {
  const { checkIn, checkOut } = getDefaultDates();

  return (
    <Box position="relative" w="full" h="100vh">
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
        marginLeft="60px"
      >
        <Heading textStyle="logo">HOTEL DISC PROG WEB</Heading>
      </Box>

      <Flex position="absolute" top="75%" right="100px" gap={10} zIndex={2}>
        <VStack align="center">
          <Text fontSize="xs" fontWeight="bold">
            {" "}
            CHECK-IN - CHECK-OUT{" "}
          </Text>
          <Button
            size="xl"
            bg="transparent"
            color="white"
            border="1px solid"
            borderColor="whiteAlpha.700"
          >
            {formatDate(checkIn)} → {formatDate(checkOut)}
          </Button>
        </VStack>

        <VStack align="center">
          <Text fontSize="xs" fontWeight="bold">
            {" "}
            CONVIDADOS E QUARTO{" "}
          </Text>
          <Button
            size="xl"
            bg="transparent"
            color="white"
            border="1px solid"
            borderColor="whiteAlpha.700"
          >
            2 adultos, suíte master{" "}
          </Button>
        </VStack>

        <VStack align="center">
          <Text fontSize="xs" fontWeight="bold">
            PREÇO ESTIMADO
          </Text>
          <Button
            size="xl"
            bg="transparent"
            color="white"
            border="1px solid"
            borderColor="whiteAlpha.700"
          >
            {" "}
            Verificar preço{" "}
          </Button>
        </VStack>
      </Flex>
    </Box>
  );
};

export default HeroSection;
