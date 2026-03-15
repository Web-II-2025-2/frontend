import { Box } from "@chakra-ui/react";

interface SectionProps {
  bg: string;
  children: React.ReactNode;
}

const Section = ({ bg, children }: SectionProps) => {
  return (
    <Box
      bg={bg}
      py={{ base: "10", md: "16" }}
      px="6"
      borderTop="1px solid"
      borderColor="sage.200"
    >
      <Box maxW="900px" mx="auto">
        {children}
      </Box>
    </Box>
  );
};

export default Section;