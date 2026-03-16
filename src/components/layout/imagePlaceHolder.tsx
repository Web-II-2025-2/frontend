import { Flex, Text, type FlexProps } from "@chakra-ui/react";

interface ImagePlaceholderProps extends FlexProps {
  h?: string;
  children?: React.ReactNode;
}

const ImagePlaceholder = ({ h = "280px", children }: ImagePlaceholderProps) => {
  return (
    <Flex
      bg="sage.200"
      borderRadius="xl"
      align="center"
      justify="center"
      w="100%"
      h={h}
      overflow="hidden"
    >
      <Text
        fontFamily="Montserrat, sans-serif"
        color="sage.600"
        fontSize="xs"
        letterSpacing="0.14em"
        textTransform="uppercase"
        opacity={0.65}
      >
        {children}
      </Text>
    </Flex>
  );
};

export default ImagePlaceholder;