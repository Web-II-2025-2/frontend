import { Box } from "@chakra-ui/react";

interface SectionProps {
  bg: string;
  children: React.ReactNode;
  id?: string;
}

const Section = ({ bg, children, id}: SectionProps) => {
  return (
    <Box
      id={id}
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
