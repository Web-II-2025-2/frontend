import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Popover,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";

export interface GuestsState {
  adults: number;
  children: number;
  rooms: number;
  roomType: string;
}

interface GuestsPopoverProps {
  value: GuestsState;
  onChange: (next: GuestsState) => void;
}

// decidir depois se isso vai ser mockado ou vem do back
export const ROOM_TYPES = [
  "Suíte Master",
  "Quarto Standard",
  "Quarto Deluxe",
  "Suíte Presidencial",
];

export const DEFAULT_GUESTS: GuestsState = {
  adults: 2,
  children: 0,
  rooms: 1,
  roomType: ROOM_TYPES[0],
};

interface GuestCounterProps {
  label: string;
  sublabel?: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}

function GuestCounter({
  label,
  sublabel,
  value,
  onChange,
  min = 0,
  max = 10,
}: GuestCounterProps) {
  return (
    <Flex justify="space-between" align="center" py={3} px={1}>
      <Box>
        <Text color="white" fontWeight="semibold" fontSize="sm">
          {label}
        </Text>
        {sublabel && (
          <Text color="whiteAlpha.500" fontSize="xs">
            {sublabel}
          </Text>
        )}
      </Box>
      <HStack gap={3}>
        <Button
          size="sm"
          variant="outline"
          color="white"
          borderColor="whiteAlpha.400"
          borderRadius="full"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          _hover={{ bg: "whiteAlpha.200" }}
          minW="32px"
          h="32px"
          p={0}
        >
          −
        </Button>
        <Text
          color="white"
          fontWeight="bold"
          fontSize="md"
          w="20px"
          textAlign="center"
        >
          {value}
        </Text>
        <Button
          size="sm"
          variant="outline"
          color="white"
          borderColor="whiteAlpha.400"
          borderRadius="full"
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          _hover={{ bg: "whiteAlpha.200" }}
          minW="32px"
          h="32px"
          p={0}
        >
          +
        </Button>
      </HStack>
    </Flex>
  );
}

export function GuestsPopover({ value, onChange }: GuestsPopoverProps) {
  const set = (patch: Partial<GuestsState>) => onChange({ ...value, ...patch });

  const label = `${value.adults} adulto${value.adults !== 1 ? "s" : ""}${
    value.children > 0
      ? `, ${value.children} criança${value.children !== 1 ? "s" : ""}`
      : ""
  }, ${value.rooms} quarto${value.rooms !== 1 ? "s" : ""}`;

  return (
    <VStack align="center">
      <Text fontSize="xs" fontWeight="bold" letterSpacing="widest">
        CONVIDADO/QUARTO
      </Text>
      <Popover.Root positioning={{ placement: "top" }}>
        <Popover.Trigger asChild>
          <Button
            bg="sage.600"
            color="white"
            border="1px solid"
            borderColor="whiteAlpha.700"
            _hover={{
              bg: "sage.500",
              borderColor: "whiteAlpha.800",
            }}
            transition="all 0.2s"
            px={6}
            py={4}
            h="auto"
          >
            {label}
          </Button>
        </Popover.Trigger>
        <Portal>
          <Popover.Positioner>
            <Popover.Content
              bg="blackAlpha.900"
              backdropFilter="blur(20px)"
              border="1px solid"
              borderColor="whiteAlpha.200"
              borderRadius="xl"
              boxShadow="0 25px 50px rgba(0,0,0,0.6)"
              p={2}
              zIndex={100}
              w="320px"
            >
              <GuestCounter
                label="Adultos"
                value={value.adults}
                onChange={(v) => set({ adults: v })}
                min={1}
                max={10}
              />
              <Box borderTop="1px solid" borderColor="whiteAlpha.200" />
              <GuestCounter
                label="Crianças"
                value={value.children}
                onChange={(v) => set({ children: v })}
                min={0}
                max={8}
              />
              <Box borderTop="1px solid" borderColor="whiteAlpha.200" />
              <GuestCounter
                label="Quartos"
                value={value.rooms}
                onChange={(v) => set({ rooms: v })}
                min={1}
                max={5}
              />
              <Box borderTop="1px solid" borderColor="whiteAlpha.200" my={2} />

              <Box pt={1} pb={2}>
                <Text
                  color="whiteAlpha.600"
                  fontSize="xs"
                  mb={2}
                  fontWeight="semibold"
                  textAlign="center"
                >
                  TIPO DE QUARTO
                </Text>
                <Grid gap={2} templateColumns="repeat(2, 1fr)" w="100%">
                  {ROOM_TYPES.map((type) => (
                    <Button
                      key={type}
                      size="sm"
                      variant="outline"
                      onClick={() => set({ roomType: type })}
                      color={value.roomType === type ? "black" : "white"}
                      bg={value.roomType === type ? "white" : "transparent"}
                      borderColor={
                        value.roomType === type ? "white" : "whiteAlpha.400"
                      }
                      _hover={{
                        bg:
                          value.roomType === type ? "white" : "whiteAlpha.100",
                      }}
                      fontSize="xs"
                      fontWeight={value.roomType === type ? "bold" : "normal"}
                      transition="all 0.15s"
                    >
                      {type}
                    </Button>
                  ))}
                </Grid>
              </Box>
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
    </VStack>
  );
}
