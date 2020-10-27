import NextLink from 'next/link';
import { Box, Button, Flex, Heading, Link } from '@chakra-ui/core';
import { useApolloClient } from '@apollo/client';

import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient();

  return (
    <Flex pos="sticky" top={0} zIndex={1} bg="tan" justify="center">
      <Flex flex={1} maxW={800} p={4} align="center" justify="space-between">
        <Heading>
          <NextLink href="/">
            <Link fontSize="2xl">LiReddit</Link>
          </NextLink>
        </Heading>
        <Box ml="auto">
          {!loading &&
            (!data?.me ? (
              <>
                <NextLink href="/login">
                  <Link mr={2}>login</Link>
                </NextLink>
                <NextLink href="/register">
                  <Link mr={2}>register</Link>
                </NextLink>
              </>
            ) : (
              <Flex align="center">
                <NextLink href="/create-post">
                  <Button as={Link} _hover={{ textDecor: 'none' }}>
                    create post
                  </Button>
                </NextLink>
                <Box mx={4}>{data.me.username}</Box>
                <Button
                  onClick={async () => {
                    await logout();
                    await apolloClient.resetStore();
                  }}
                  isLoading={logoutFetching}
                  variant="ghost"
                >
                  logout
                </Button>
              </Flex>
            ))}
        </Box>
      </Flex>
    </Flex>
  );
};

export default NavBar;
