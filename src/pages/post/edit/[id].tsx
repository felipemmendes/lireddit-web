import React from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Flex } from '@chakra-ui/core';
import { Form, Formik } from 'formik';

import { withApollo } from '../../../utils/withApollo';
import { useIsAuth } from '../../../utils/useIsAuth';
import { useGetPostFromUrl } from '../../../utils/useGetPostFromUrl';
import { useUpdatePostMutation } from '../../../generated/graphql';
import InputField from '../../../components/InputField';
import Layout from '../../../components/Layout';

const editPost: React.FC = () => {
  useIsAuth();
  const router = useRouter();
  const [{ data, error, loading }, routeId] = useGetPostFromUrl();
  const [updatePost] = useUpdatePostMutation();

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
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          await updatePost({ variables: { id: routeId, ...values } });

          router.back();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Flex direction="column" alignItems="center" w="100%">
              <Box mt={4} w="100%">
                <InputField name="title" placeholder="title" label="Title" />
              </Box>
              <Box mt={4} w="100%">
                <InputField
                  name="text"
                  placeholder="text..."
                  label="Body"
                  inputVariant="textarea"
                  h={100}
                  minH="50vh"
                />
              </Box>
              <Button
                mt={4}
                minW="50%"
                type="submit"
                variantColor="teal"
                isLoading={isSubmitting}
              >
                Edit post
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(editPost);
