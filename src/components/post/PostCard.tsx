'use client';

import Link from 'next/link';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { HeartIcon, MessageCircleIcon } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

import { deletePost, toggleLike } from '@/actions/post.action';

import Comments from './Comments';
import { DeleteAlertDialog } from '../DeleteAlertDialog';

import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarImage } from '../ui/avatar';

import type { Post } from '@/types/post';

interface PostCardProps {
  post: Post;
  dbUserId: string | null;
}

export default function PostCard({ post, dbUserId }: PostCardProps) {
  const [optimisticLikes, setOptmisticLikes] = useState(post._count.likes);
  const [hasLiked, setHasLiked] = useState(
    post.likes.some(like => like.userId === dbUserId)
  );

  const [showComments, setShowComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;

    try {
      setIsLiking(true);
      setHasLiked(prev => !prev);
      setOptmisticLikes(prev => prev + (hasLiked ? -1 : 1));

      await toggleLike(post.id);
    } catch {
      setOptmisticLikes(post._count.likes);
      setHasLiked(post.likes.some(like => like.userId === dbUserId));
    } finally {
      setIsLiking(false);
    }
  };

  const handleDeletePost = async () => {
    if (isDeleting) return;

    setIsDeleting(true);

    try {
      const result = await deletePost(post.id);

      if (result.success) toast.success('Post deleted successfully');
      else throw new Error(result.error);
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast.error('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex space-x-3 sm:space-x-4">
            <Link href={`/profile/${post.author.username}`}>
              <Avatar className="size-8 sm:w-10 sm:h-10">
                <AvatarImage src={post.author.image ?? '/avatar.png'} />
              </Avatar>
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
                  <Link
                    href={`/profile/${post.author.username}`}
                    className="font-semibold truncate"
                  >
                    {post.author.name}
                  </Link>

                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Link href={`/profile/${post.author.username}`}>
                      @{post.author.username}
                    </Link>
                    <span>•</span>

                    <span>
                      {formatDistanceToNow(new Date(post.createdAt))} ago
                    </span>
                  </div>
                </div>

                {dbUserId === post.author.id && (
                  <DeleteAlertDialog
                    isDeleting={isDeleting}
                    onDelete={handleDeletePost}
                  />
                )}
              </div>

              <p className="mt-2 text-sm text-foreground break-words">
                {post.content}
              </p>
            </div>
          </div>

          {post.image && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={post.image}
                alt="Post content"
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          <div className="flex items-center pt-2 space-x-4">
            <SignedIn>
              <Button
                variant="ghost"
                size="sm"
                className={`text-muted-foreground gap-2 ${
                  hasLiked
                    ? 'text-red-500 hover:text-red-600'
                    : 'hover:text-red-500'
                }`}
                onClick={handleLike}
              >
                {hasLiked ? (
                  <HeartIcon className="size-5 fill-current" />
                ) : (
                  <HeartIcon className="size-5" />
                )}

                <span>{optimisticLikes}</span>
              </Button>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground gap-2"
                >
                  <HeartIcon className="size-5" />
                  <span>{optimisticLikes}</span>
                </Button>
              </SignInButton>
            </SignedOut>

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground gap-2 hover:text-blue-500"
              onClick={() => setShowComments(prev => !prev)}
            >
              <MessageCircleIcon
                className={`size-5 ${
                  showComments ? 'fill-blue-500 text-blue-500' : ''
                }`}
              />

              <span>{post.comments.length}</span>
            </Button>
          </div>

          <Comments
            post={post}
            dbUserId={dbUserId}
            showComments={showComments}
          />
        </div>
      </CardContent>
    </Card>
  );
}
