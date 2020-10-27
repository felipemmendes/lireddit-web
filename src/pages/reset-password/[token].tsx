import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Flex } from '@chakra-ui/core';
import { Form, Formik } from 'formik';

import { withApollo } from '../../utils/withApollo';
import { toErrorMap } from '../../utils/toErrorMap';
import {
  MeDocument,
  MeQuery,
  useChangePasswordMutation,
} from '../../generated/graphql';
import InputField from '../../components/InputField';
import Wrapper from '../../components/Wrapper';

const ResetPassword: React.FC = () => {
  const router = useRouter();
  const [changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState('');

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            variables: {
              newPassword: values.newPassword,
              token:
                typeof router.query.token === 'string'
                  ? router.query.token
                  : '',
            },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: 'Query',
                  me: data?.changePassword.user,
                },
              });
            },
          });

          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors, {
              fromField: 'token',
              toField: 'newPassword',
            });

            if ('token' in errorMap) {
              setTokenError(errorMap.token);
            }

            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Flex direction="column" alignItems="center" w="100%">
              <Box mt={4} w="100%">
                <InputField
                  name="newPassword"
                  placeholder="new password"
                  label="New Password"
                  type="password"
                />
              </Box>
              {tokenError ? (
                <Button
                  mt={4}
                  minW="50%"
                  onClick={() => router.push('/forgot-password')}
                  variantColor="red"
                  variant="outline"
                  isLoading={isSubmitting}
                >
                  Request new token
                </Button>
              ) : (
                <Button
                  mt={4}
                  minW="50%"
                  type="submit"
                  variantColor="teal"
                  isLoading={isSubmitting}
                >
                  Change Password
                </Button>
              )}
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ResetPassword);
