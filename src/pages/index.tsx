import { Button, Flex, Stack, Text } from '@chakra-ui/core';

import Layout from '../components/Layout';
import { usePostsQuery } from '../generated/graphql';
import PostCard from '../components/PostCard';
import { withApollo } from '../utils/withApollo';

const Index = () => {
  const { data, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 10,
      cursor: null as null | string,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (!data) {
    if (loading) {
      return (
        <Layout variant="regular">
          <Flex justifyContent="center">
            <Text>loading...</Text>
          </Flex>
        </Layout>
      );
    } else {
      return (
        <Layout variant="regular">
          <Flex justifyContent="center" textAlign="center">
            <Text fontSize="xl" my="auto">
              Nothing to see here... Think there may be a problem.
              <br />
              Refresh your page or try again in a few minutes
            </Text>
          </Flex>
        </Layout>
      );
    }
  }

  if (data.posts.posts.length === 0) {
    return (
      <Layout variant="regular">
        <Flex justifyContent="center" textAlign="center">
          <Text fontSize="xl" my="auto">
            Nothing to see here... Think there may be a problem.
            <br />
            Refresh your page or try again in a few minutes
          </Text>
        </Flex>
      </Layout>
    );
  }

  return (
    <Layout variant="regular">
      <Stack spacing={8} mt={8}>
        {data.posts.posts.map((p) => p && <PostCard key={p.id} post={p} />)}
      </Stack>
      {data.posts.hasMore && (
        <Flex justifyContent="center">
          <Button
            onClick={async () => {
              return fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
              });
            }}
            isLoading={loading}
            my={8}
          >
            load more
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Index);
