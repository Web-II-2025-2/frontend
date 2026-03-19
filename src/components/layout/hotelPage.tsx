import { useState } from "react";
import { Box, Flex, VStack, Text } from "@chakra-ui/react";
import ImageSlider from "../common/ImageSlider";
import Section from "../common/Section";
import ImagePlaceholder from "./ImagePlaceHolder";
import DefaultButton from "../common/DefaultButton";

function SuiteMasterSection() {
  const [slide, setSlide] = useState(0);
  const total = 3;

  return (
    <Section id="rooms" bg="sage.50">
      <Flex direction={{ base: "column", md: "row" }} gap="10" align="center">
        <VStack gap="3" flex="1">
          <ImagePlaceholder>{`Suite — foto ${slide + 1}`}</ImagePlaceholder>

          <ImageSlider slide={slide} setSlide={setSlide} total={total} />
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
  const [slide, setSlide] = useState(0);
  const total = 3;

  return (
    <Section id="events" bg="sage.100">
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
        </VStack>

        <Box flex="1.3">
          <VStack>
            <ImagePlaceholder paddingTop={20}>
              Cachoeira / Natureza
            </ImagePlaceholder>
            <ImageSlider slide={slide} setSlide={setSlide} total={total} />
          </VStack>
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
          <ImagePlaceholder h="300px">Restaurantes</ImagePlaceholder>
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
