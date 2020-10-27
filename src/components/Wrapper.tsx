import { Box, BoxProps } from '@chakra-ui/core';

export type WrapperVariant = 'small' | 'regular';

interface WrapperProps extends BoxProps {
  variant?: WrapperVariant;
}

const Wrapper: React.FC<WrapperProps> = ({ variant, children, ...rest }) => {
  return (
    <Box
      maxWidth={variant === 'regular' ? '800px' : '400px'}
      w="100%"
      mt={8}
      mx="auto"
      {...rest}
    >
      {children}
    </Box>
  );
};

export default Wrapper;
