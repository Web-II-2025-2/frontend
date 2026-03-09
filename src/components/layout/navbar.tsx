import { Flex, Box, Text, Link, HStack } from "@chakra-ui/react";

const NAV_LINKS = [
  { name: "Home", href: "#home" },
  { name: "Quartos", href: "#rooms" },
  { name: "Localizacao", href: "#location" },
  { name: "Eventos", href: "#events" },
  { name: "Ajuda", href: "#help" },
];

const NavBar = () => {
  return (
    <Flex justify="space-between" align="center" w="full" px={16} mt={8}>
      <HStack>
        <Box></Box>
        <Text textStyle="logo">Hotel</Text>
      </HStack>
      <HStack gap={20}>
        {NAV_LINKS.map((link) => (
          <Link key={link.name} href={link.href} textStyle="navBarItems">
            {link.name}
          </Link>
        ))}
      </HStack>
    </Flex>
  );
};

export default NavBar;
