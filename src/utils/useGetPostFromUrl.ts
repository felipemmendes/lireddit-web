import { QueryResult } from '@apollo/client';
import { useRouter } from 'next/router';
import { validate } from 'uuid';

import { Exact, PostQuery, usePostQuery } from '../generated/graphql';

export const useGetPostFromUrl = (): [
  QueryResult<PostQuery, Exact<{ id: string }>>,
  string,
] => {
  const router = useRouter();
  const routeId = typeof router.query.id === 'string' ? router.query.id : '';
  return [
    usePostQuery({
      skip: !validate(routeId),
      variables: { id: routeId },
    }),
    routeId,
  ];
};
