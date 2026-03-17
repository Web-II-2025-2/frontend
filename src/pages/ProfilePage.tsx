import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/services/AuthContext";
import type { TabId } from "@/types/profile";
import { ProfileTab } from "@/components/layout/ProfileTab";
import { ReservationsTab } from "@/components/layout/ReservationsTab";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "profile",      label: "Meu Perfil", icon: "👤" },
  { id: "reservations", label: "Reservas",   icon: "🛎" },
];

export function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const activeTab: TabId = location.pathname.includes("reservations")
    ? "reservations"
    : "profile";

  const handleTabChange = (tab: TabId) => {
    navigate(tab === "reservations" ? "/profile/reservations" : "/profile");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Flex
        px={{ base: 4, md: 10 }} py={4}
        bg="white" borderBottom="1px solid" borderColor="gray.100"
        align="center" justify="space-between"
        boxShadow="0 1px 3px rgba(0,0,0,0.05)"
      >
        <HStack gap={3} cursor="pointer" onClick={() => navigate("/home")}>
          <Box w="8px" h="8px" borderRadius="full" bg="sage.600" />
          <Text fontWeight="bold" fontSize="lg" color="gray.800" letterSpacing="tight">
            Hotel UFCG
          </Text>
        </HStack>

        <HStack gap={4}>
          {user && (
            <Text fontSize="sm" color="gray.500">
              Olá, <strong>{user.name.split(" ")[0]}</strong>
            </Text>
          )}
          <Button
            size="sm" variant="outline" borderRadius="lg"
            fontWeight="semibold" color="gray.600" borderColor="gray.200"
            _hover={{ bg: "red.50", borderColor: "red.200", color: "red.600" }}
            transition="all 0.2s"
            onClick={handleLogout}
          >
            Sair
          </Button>
        </HStack>
      </Flex>

      <Box maxW="800px" mx="auto" px={{ base: 4, md: 6 }} py={8}>
        <HStack
          gap={0} bg="white" borderRadius="xl" p={1}
          border="1px solid" borderColor="gray.100"
          boxShadow="0 1px 3px rgba(0,0,0,0.05)"
          mb={6}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Button
                key={tab.id}
                flex={1} variant="ghost" borderRadius="lg"
                fontWeight={isActive ? "bold" : "semibold"} fontSize="sm"
                color={isActive ? "white" : "gray.500"}
                bg={isActive ? "sage.600" : "transparent"}
                _hover={{ bg: isActive ? "sage.500" : "gray.50", color: isActive ? "white" : "gray.700" }}
                transition="all 0.2s"
                onClick={() => handleTabChange(tab.id)}
              >
                <HStack gap={2}>
                  <Text>{tab.icon}</Text>
                  <Text>{tab.label}</Text>
                </HStack>
              </Button>
            );
          })}
        </HStack>

        {activeTab === "profile" ? <ProfileTab /> : <ReservationsTab />}
      </Box>
    </Box>
  );
}