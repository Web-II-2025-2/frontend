import { useState } from "react";
import { Box, Flex, VStack, HStack, Text, IconButton } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DefaultButton from "./defaultButton";
import Section from "./section";
import ImagePlaceholder from "./imagePlaceHolder";


function SuiteMasterSection() {
  const [slide, setSlide] = useState(0);
  const total = 3;

  return (
    <Section bg="sage.50">
      <Flex direction={{ base: "column", md: "row" }} gap="10" align="center">
        <VStack gap="3" flex="1">
          <ImagePlaceholder>
            {`Suite — foto ${slide + 1}`}
          </ImagePlaceholder>

          <HStack gap="3">
            <IconButton
              aria-label="anterior"
              onClick={() => setSlide((s) => (s - 1 + total) % total)}
              size="sm"
              borderRadius="full"
              borderColor="sage.500"
              color="sage.600"
              background="sage.100"
            >
              <ChevronLeft size={18} />
            </IconButton>

            <IconButton
              aria-label="próximo"
              onClick={() => setSlide((s) => (s + 1) % total)}
              size="sm"
              borderRadius="full"
              borderColor="sage.500"
              color="sage.600"
              background="sage.100"
              
            >
              <ChevronRight size={18} />
            </IconButton>
          </HStack>

          <HStack gap="2">
            {Array.from({ length: total }).map((_, i) => (
              <Box
                key={i}
                onClick={() => setSlide(i)}
                w={i === slide ? "22px" : "8px"}
                h="8px"
                borderRadius="full"
                bg={i === slide ? "sage.500" : "sage.300"}
                cursor="pointer"
                transition="all 0.3s"
              />
            ))}
          </HStack>
        </VStack>

        <VStack align="start" gap="4" flex="1">
          <Text
            fontStyle="italic"
            fontWeight="600"
            fontSize={{ base: "3xl", md: "4xl" }}
            color="sage.800"
          >
            Suíte Master
          </Text>

          <Text fontSize="sm" color="gray.600" lineHeight="1.8">
            Lorem ipsum dolor sit amet consectetur. Tortor sed iaculis nulla
            eget orci nulla. Vel faucibus commodo tellus magna morbi massa orci.
          </Text>
        </VStack>
      </Flex>
    </Section>
  );
}

function ExperienciasSection() {
  return (
    <Section bg="sage.100">
      <Flex direction={{ base: "column", md: "row" }} gap="10" align="center">
        <VStack align="start" gap="5" flex="1">
          <Text
            fontStyle="italic"
            fontWeight="600"
            fontSize={{ base: "3xl", md: "4xl" }}
            color="sage.800"
          >
            Experiências e Eventos
          </Text>

          <Text fontSize="sm" color="gray.600" lineHeight="1.8">
            Lorem ipsum dolor sit amet consectetur. Consectetur dictum nisl et
            non.
          </Text>

          <DefaultButton>Saiba mais</DefaultButton>
        </VStack>

        <Box flex="1.3">
          <ImagePlaceholder>
            Cachoeira / Natureza
        </ImagePlaceholder> 
        </Box>
      </Flex>
    </Section>
  );
}

function RestaurantesSection() {
  return (
    <Section bg="sage.50">
      <Flex direction={{ base: "column", md: "row" }} gap="10" align="center">
        <Box flex="1.3">
          <ImagePlaceholder h="300px">
            Restaurantes
            </ImagePlaceholder> 
        </Box>

        <VStack align="end" gap="5" flex="1" textAlign="right">
          <Text
            fontStyle="italic"
            fontWeight="600"
            fontSize={{ base: "3xl", md: "4xl" }}
            color="sage.800"
          >
            Restaurantes temáticos
          </Text>

          <Text fontSize="sm" color="gray.600" lineHeight="1.8">
            Lorem ipsum dolor sit amet consectetur. Nec imperdiet hendrerit
            pellentesque.
          </Text>

          <DefaultButton>Saiba mais</DefaultButton>
        </VStack>
      </Flex>
    </Section>
  );
}

export default function HotelPage() {
  return (
    <Box minH="100vh">
      <SuiteMasterSection />
      <ExperienciasSection />
      <RestaurantesSection />
    </Box>
  );
}
