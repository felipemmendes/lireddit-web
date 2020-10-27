import React from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Flex } from '@chakra-ui/core';
import { Form, Formik } from 'formik';

import { withApollo } from '../utils/withApollo';
import { useIsAuth } from '../utils/useIsAuth';
import { useCreatePostMutation } from '../generated/graphql';
import InputField from '../components/InputField';
import Layout from '../components/Layout';

const createPost: React.FC = () => {
  const router = useRouter();
  useIsAuth();
  const [createPost] = useCreatePostMutation();

  return (
    <Layout variant="regular">
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values) => {
          const { errors } = await createPost({
            variables: { input: values },
            update: (cache) => {
              cache.evict({ fieldName: 'posts:{}' });
            },
          });
          if (!errors) {
            router.push('/');
          }
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
                />
              </Box>
              <Button
                mt={4}
                minW="50%"
                type="submit"
                variantColor="teal"
                isLoading={isSubmitting}
              >
                Create post
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(createPost);
