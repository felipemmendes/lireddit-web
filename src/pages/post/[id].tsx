import { Box, Flex, Heading, Text } from '@chakra-ui/core';

import { withApollo } from '../../utils/withApollo';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import Layout from '../../components/Layout';
import EditDeletePostButtons from '../../components/EditDeletePostButtons';

const Post = ({}) => {
  const [{ data, loading, error }] = useGetPostFromUrl();

  if (loading) {
    return (
      <Layout variant="regular">
        <Box>Loading...</Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout variant="regular">
        <Box>{error.message}</Box>
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout variant="regular">
        <Box>Could not find post</Box>
      </Layout>
    );
  }

  return (
    <Layout variant="regular">
      <Flex>
        <Heading mb={4}>{data.post.title}</Heading>
        <EditDeletePostButtons
          ml="auto"
          postId={data.post.id}
          creatorId={data.post.creator.id}
        />
      </Flex>
      <Text>{data.post.text}</Text>
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post);
