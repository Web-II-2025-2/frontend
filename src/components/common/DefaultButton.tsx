import { Button } from "@chakra-ui/react";

interface ButtonProps {
  children: React.ReactNode;
}

const DefaultButton = ({ children }: ButtonProps) => {
  return (
    <Button
      bg="sage.500"
      color="white"
      borderRadius="full"
      px="4"
      py="2"
      fontFamily="Montserrat"
      fontSize="sm"
      letterSpacing="0.08em"
      _hover={{
        bg: "sage.600",
      }}
      transition="all 0.2s"
    >
      {children}
    </Button>
  );
};

export default DefaultButton;