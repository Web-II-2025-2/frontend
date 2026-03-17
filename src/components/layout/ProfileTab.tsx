import { Box, Flex, Grid, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import { useGuestProfile } from "@/hooks/useGuestProfile";
import { formatCPF, formatPhone } from "@/utils/formatters";

function InfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <Box
      bg="white" borderRadius="xl" p={4}
      border="1px solid" borderColor="gray.100"
      boxShadow="0 1px 3px rgba(0,0,0,0.06)"
    >
      <HStack gap={3} align="start">
        <Text fontSize="lg">{icon}</Text>
        <VStack align="start" gap={0}>
          <Text fontSize="xs" color="gray.400" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase">
            {label}
          </Text>
          <Text fontSize="md" fontWeight="semibold" color="gray.700">{value}</Text>
        </VStack>
      </HStack>
    </Box>
  );
}

export function ProfileTab() {
  const { profile, loading, error } = useGuestProfile();

  if (loading) {
    return (
      <Flex justify="center" align="center" py={16}>
        <Spinner size="lg" color="sage.600" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box bg="red.50" borderRadius="xl" p={6} border="1px solid" borderColor="red.200">
        <Text color="red.600" fontWeight="semibold">⚠ {error}</Text>
      </Box>
    );
  }

  if (!profile) return null;

  return (
    <VStack align="stretch" gap={6}>
      <Flex
        align="center" gap={5}
        bg="linear-gradient(135deg, #4a7c59 0%, #2d5a3d 100%)"
        borderRadius="2xl" p={6}
      >
        <Flex
          w="72px" h="72px" borderRadius="full"
          bg="whiteAlpha.200" border="2px solid" borderColor="whiteAlpha.400"
          align="center" justify="center" flexShrink={0}
        >
          <Text fontSize="2xl">👤</Text>
        </Flex>
        <VStack align="start" gap={0}>
          <Text color="white" fontSize="xl" fontWeight="bold" letterSpacing="tight">
            {profile.name}
          </Text>
          <Text color="whiteAlpha.700" fontSize="sm">Hóspede</Text>
        </VStack>
      </Flex>

      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
        <InfoCard icon="👤" label="Nome completo" value={profile.name} />
        <InfoCard icon="📄" label="CPF" value={formatCPF(profile.cpf)} />
        <InfoCard icon="📱" label="Telefone" value={formatPhone(profile.phoneNumber)} />
      </Grid>
    </VStack>
  );
}