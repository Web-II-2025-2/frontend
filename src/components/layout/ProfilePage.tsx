import {
  Box,
  Button,
  Flex,
  HStack,
  Spinner,
  Text,
  VStack,
  Grid,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import api from "@/services/api";
import { useAuth } from "@/services/AuthContext";
import { ReservationDetailDialog, type Reservation } from "./ReservationDetailDialog";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GuestProfile {
  id: number;
  name: string;
  cpf: string;
  phoneNumber: string;
  credentialId: number;
}

type TabId = "profile" | "reservations";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  Reservation["status"],
  { label: string; color: string; bg: string; border: string }
> = {
  CONFIRMED:   { label: "Confirmada",  color: "#2d7a4f", bg: "#f0fdf4", border: "#bbf7d0" },
  CHECKED_IN:  { label: "Hospedado",   color: "#1e40af", bg: "#eff6ff", border: "#bfdbfe" },
  CHECKED_OUT: { label: "Finalizada",  color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb" },
  CANCELED:    { label: "Cancelada",   color: "#b91c1c", bg: "#fef2f2", border: "#fecaca" },
};

const ROOM_TYPE_LABEL: Record<string, string> = {
  SINGLE: "Single",
  STANDARD_CASAL: "Standard Casal",
  SUITE: "Suíte",
  DELUXE: "Deluxe",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(new Date(dateStr));
}

function nightsBetween(checkIn: string, checkOut: string): number {
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function formatCPF(cpf: string) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatPhone(phone: string) {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab() {
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<GuestProfile>("/guests/profile")
      .then(({ data }) => setProfile(data))
      .catch((err) => {
        setError(
          axios.isAxiosError(err)
            ? (err.response?.data?.message ?? err.message)
            : "Erro ao carregar perfil."
        );
      })
      .finally(() => setLoading(false));
  }, []);

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
        <InfoCard icon="🔑" label="ID da conta" value={`#${profile.credentialId}`} />
      </Grid>
    </VStack>
  );
}

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

// ─── Reservations Tab ─────────────────────────────────────────────────────────

function ReservationsTab() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchReservations = () => {
    setLoading(true);
    api.get<Reservation[]>("/reservations/my-reservations")
      .then(({ data }) => setReservations(data))
      .catch((err) => {
        setError(
          axios.isAxiosError(err)
            ? (err.response?.data?.message ?? err.message)
            : "Erro ao carregar reservas."
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReservations(); }, []);

  const handleCardClick = (r: Reservation) => {
    setSelected(r);
    setDialogOpen(true);
  };

  // Após uma ação (checkin, checkout, cancel, room service), recarrega lista
  // e atualiza o `selected` com o status mais recente
  const handleUpdated = () => {
    api.get<Reservation[]>("/reservations/my-reservations")
      .then(({ data }) => {
        setReservations(data);
        if (selected) {
          const updated = data.find((r) => r.id === selected.id);
          if (updated) setSelected(updated);
        }
      })
      .catch(() => {});
  };

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

  if (reservations.length === 0) {
    return (
      <Flex direction="column" align="center" justify="center" py={16} gap={3}>
        <Text fontSize="4xl">🛎</Text>
        <Text fontWeight="bold" color="gray.600" fontSize="lg">Nenhuma reserva encontrada</Text>
        <Text fontSize="sm" color="gray.400">Suas futuras reservas aparecerão aqui.</Text>
      </Flex>
    );
  }

  return (
    <>
      <VStack align="stretch" gap={4}>
        {reservations.map((r) => {
          const cfg = STATUS_CONFIG[r.status];
          const nights = nightsBetween(r.checkIn, r.checkOut);
          return (
            <Box
              key={r.id}
              bg="white" borderRadius="xl" overflow="hidden"
              border="1px solid" borderColor="gray.100"
              boxShadow="0 1px 3px rgba(0,0,0,0.06)"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ boxShadow: "0 4px 16px rgba(0,0,0,0.12)", transform: "translateY(-1px)" }}
              _active={{ transform: "translateY(0)" }}
              onClick={() => handleCardClick(r)}
            >
              {/* Barra de status */}
              <Box h="3px" bg={cfg.border} />

              <Flex p={5} justify="space-between" align="start" gap={4} flexWrap="wrap">
                <VStack align="start" gap={2}>
                  <HStack gap={2}>
                    <Box
                      px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="bold"
                      color={cfg.color} bg={cfg.bg} border="1px solid" borderColor={cfg.border}
                    >
                      {cfg.label}
                    </Box>
                    <Text fontSize="xs" color="gray.400">#{r.id}</Text>
                  </HStack>

                  {r.room && (
                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                      Quarto {r.room.number} · {ROOM_TYPE_LABEL[r.room.type] ?? r.room.type}
                    </Text>
                  )}

                  <HStack gap={4}>
                    <VStack align="start" gap={0}>
                      <Text fontSize="xs" color="gray.400" fontWeight="semibold" letterSpacing="wider">CHECK-IN</Text>
                      <Text fontSize="sm" fontWeight="bold" color="gray.700">{formatDate(r.checkIn)}</Text>
                    </VStack>
                    <Text color="gray.300">→</Text>
                    <VStack align="start" gap={0}>
                      <Text fontSize="xs" color="gray.400" fontWeight="semibold" letterSpacing="wider">CHECK-OUT</Text>
                      <Text fontSize="sm" fontWeight="bold" color="gray.700">{formatDate(r.checkOut)}</Text>
                    </VStack>
                  </HStack>

                  <Text fontSize="xs" color="gray.400">
                    {nights} {nights === 1 ? "noite" : "noites"}
                  </Text>
                </VStack>

                <VStack align="end" gap={0}>
                  <Text fontSize="xs" color="gray.400" fontWeight="semibold" letterSpacing="wider">TOTAL</Text>
                  <Text fontSize="xl" fontWeight="extrabold" color="sage.700">
                    {formatCurrency(r.totalPrice)}
                  </Text>
                  <Text fontSize="xs" color="gray.400" mt={2}>Clique para detalhes →</Text>
                </VStack>
              </Flex>
            </Box>
          );
        })}
      </VStack>

      <ReservationDetailDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        reservation={selected}
        onUpdated={handleUpdated}
      />
    </>
  );
}

// ─── ProfilePage ──────────────────────────────────────────────────────────────

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
      {/* Top bar */}
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

      {/* Conteúdo */}
      <Box maxW="800px" mx="auto" px={{ base: 4, md: 6 }} py={8}>
        {/* Tabs */}
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