import React from 'react';
import { Box, Flex, Heading, Link, Text } from '@chakra-ui/core';
import NextLink from 'next/link';

import { PostSnippetFragment } from '../generated/graphql';
import UpdootSection from './UpdootSection';
import EditDeletePostButtons from './EditDeletePostButtons';

interface PostCardProps {
  post: PostSnippetFragment;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Flex p={4} shadow="md" borderWidth="1px" flex="1" rounded="md">
      <UpdootSection post={post} />
      <Box p={4}>
        <NextLink href="/post/[id]" as={`/post/${post.id}`}>
          <Link>
            <Heading fontSize="xl">{post.title}</Heading>
          </Link>
        </NextLink>
        <Text fontSize="sm">posted by {post.creator.username}</Text>
        <Text mt={4}>{post.textSnippet}</Text>
      </Box>

      <EditDeletePostButtons
        ml="auto"
        postId={post.id}
        creatorId={post.creator.id}
      />
    </Flex>
  );
};

export default PostCard;
