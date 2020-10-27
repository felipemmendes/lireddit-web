import React from 'react';
import NextLink from 'next/link';
import { Flex, FlexProps, IconButton, Link } from '@chakra-ui/core';

import { useDeletePostMutation, useMeQuery } from '../generated/graphql';

interface EditDeletePostButtonsProps extends FlexProps {
  postId: string;
  creatorId: string;
}

const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  postId,
  creatorId,
  children,
  ...rest
}) => {
  const { data } = useMeQuery();
  const [deletePost] = useDeletePostMutation();
  return data?.me?.id === creatorId ? (
    <Flex {...rest}>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${postId}`}>
        <IconButton as={Link} icon="edit" aria-label="Edit post" mr={2} />
      </NextLink>
      <IconButton
        onClick={() => {
          deletePost({
            variables: { id: postId },
            update: (cache) => {
              cache.evict({
                id: 'Post:' + postId,
              });
            },
          });
        }}
        icon="delete"
        aria-label="Delete post"
        variantColor="red"
      />
    </Flex>
  ) : null;
};

export default EditDeletePostButtons;
