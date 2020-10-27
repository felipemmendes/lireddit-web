import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { ApolloCache } from '@apollo/client';
import { Flex, IconButton, Text } from '@chakra-ui/core';
import gql from 'graphql-tag';

import {
  PostSnippetFragment,
  useMeQuery,
  useVoteMutation,
  VoteMutation,
} from '../generated/graphql';

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

const updateAfterVote = (
  value: number,
  postId: string,
  cache: ApolloCache<VoteMutation>,
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: 'Post:' + postId,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });
  if (data) {
    let newPoints = data.points as number;
    let newVoteStatus: number | null = value;
    if (data.voteStatus === value) {
      newPoints += -1 * value;
      newVoteStatus = null;
    } else {
      newPoints += (!data.voteStatus ? 1 : 2) * value;
    }

    cache.writeFragment({
      id: 'Post:' + postId,
      fragment: gql`
        fragment __ on Post {
          points
          voteStatus
        }
      `,
      data: {
        id: postId,
        points: newPoints,
        voteStatus: newVoteStatus,
      },
    });
  }
};

const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loading, setLoading] = useState<'updoot' | 'downdoot' | false>(false);
  const router = useRouter();
  const { data } = useMeQuery();
  const [vote] = useVoteMutation();

  const updoot = useCallback(async () => {
    if (!data?.me) {
      await router.replace('/login?next=' + router.pathname);
      return;
    }

    setLoading('updoot');
    await vote({
      variables: {
        postId: post.id,
        value: 1,
      },
      update: (cache) => updateAfterVote(1, post.id, cache),
    });
    setLoading(false);
  }, []);

  const downdoot = useCallback(async () => {
    if (!data?.me) {
      await router.replace('/login?next=' + router.pathname);
      return;
    }

    setLoading('downdoot');
    await vote({
      variables: {
        postId: post.id,
        value: -1,
      },
      update: (cache) => updateAfterVote(-1, post.id, cache),
    });
    setLoading(false);
  }, []);

  return (
    <Flex direction="column" mr={4} alignItems="center" justifyContent="center">
      <IconButton
        onClick={updoot}
        isLoading={loading === 'updoot'}
        icon="chevron-up"
        aria-label="updoot post"
        variantColor={post.voteStatus === 1 ? 'green' : undefined}
      />
      <Text my={2}>{post.points}</Text>
      <IconButton
        onClick={downdoot}
        isLoading={loading === 'downdoot'}
        icon="chevron-down"
        aria-label="downdoot post"
        variantColor={post.voteStatus === -1 ? 'red' : undefined}
      />
    </Flex>
  );
};

export default UpdootSection;
