import { Flex, Box, Link, HStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const NAV_LINKS = [
  { name: "Home", href: "#home" },
  { name: "Quartos", href: "#rooms" },
  { name: "Localizacao", href: "#location" },
  { name: "Eventos", href: "#events" },
  { name: "Ajuda", to: "/profile" },
];

const NavBar = () => {
  return (
    <Flex
      position="absolute"
      justify="space-between"
      align="center"
      w="full"
      zIndex="10"
      px={16}
      mt={8}
    >
      <HStack>
        <Box></Box>
      </HStack>
      <HStack gap={20}>
        {NAV_LINKS.map((link) =>
          link.to ? (
            <RouterLink
              key={link.name}
              to={link.to}
            >
              <Box textStyle="navBarItems">{link.name}</Box>
            </RouterLink>
          ) : (
            <Link key={link.name} href={link.href} textStyle="navBarItems">
              {link.name}
            </Link>
          ),
        )}
      </HStack>
    </Flex>
  );
};

export default NavBar;
