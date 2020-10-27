import { useState } from 'react';
import { Flex, Box, Button } from '@chakra-ui/core';
import { Formik, Form } from 'formik';

import { withApollo } from '../utils/withApollo';
import { useForgotPasswordMutation } from '../generated/graphql';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';

const forgotPassword: React.FC = () => {
  const [forgotPassword] = useForgotPasswordMutation();
  const [complete, setComplete] = useState(false);

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: '' }}
        onSubmit={async (values) => {
          await forgotPassword({ variables: values });

          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>We have sent you an email with instructions.</Box>
          ) : (
            <Form>
              <Flex direction="column" alignItems="center" w="100%">
                <Box mt={4} w="100%">
                  <InputField
                    name="email"
                    placeholder="email"
                    label="Email"
                    type="email"
                  />
                </Box>
                <Button
                  mt={4}
                  minW="50%"
                  type="submit"
                  variantColor="teal"
                  isLoading={isSubmitting}
                >
                  Submit
                </Button>
              </Flex>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(forgotPassword);
