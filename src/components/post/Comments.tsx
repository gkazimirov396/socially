'use client';

import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { LogInIcon, SendIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';

import { createComment, deleteComment } from '@/actions/post.action';

import { DeleteAlertDialog } from '../DeleteAlertDialog';

import { Avatar, AvatarImage } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

import type { Post } from '@/types/post';

interface CommentsProps {
  dbUserId: string | null;
  showComments: boolean;
  post: Post;
}

export default function Comments({
  showComments,
  post,
  dbUserId,
}: CommentsProps) {
  const { user } = useUser();

  const [newComment, setNewComment] = useState('');

  const [isDeleting, setIsDeleting] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const handleAddComment = async () => {
    if (!newComment.trim() || isCommenting) return;

    try {
      setIsCommenting(true);

      const result = await createComment(post.id, newComment);

      if (result?.success) {
        toast.success('Comment posted successfully');
        setNewComment('');
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (isDeleting) return;

    setIsDeleting(true);

    try {
      const result = await deleteComment(commentId);

      if (result.success) toast.success('Comment deleted successfully');
      else throw new Error(result.error);
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast.error('Failed to delete comment');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {showComments && (
        <div className="space-y-4 pt-4 border-t">
          <ul className="space-y-4">
            {post.comments.map(comment => (
              <li key={comment.id} className="flex space-x-3">
                <Avatar className="size-8 flex-shrink-0">
                  <AvatarImage src={comment.author.image ?? '/avatar.png'} />
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-medium text-sm">
                      {comment.author.name}
                    </span>

                    <span className="text-sm text-muted-foreground">
                      @{comment.author.username}
                    </span>

                    <span className="text-sm text-muted-foreground">·</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt))} ago
                    </span>
                  </div>

                  <p className="text-sm break-words">{comment.content}</p>
                </div>

                {dbUserId === comment.authorId && (
                  <DeleteAlertDialog
                    isDeleting={isDeleting}
                    onDelete={() => handleDeleteComment(comment.id)}
                  />
                )}
              </li>
            ))}
          </ul>

          <SignedIn>
            <div className="flex space-x-3">
              <Avatar className="size-8 flex-shrink-0">
                <AvatarImage src={user?.imageUrl || '/avatar.png'} />
              </Avatar>

              <div className="flex-1">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  className="min-h-[80px] resize-none"
                />

                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    onClick={handleAddComment}
                    className="flex items-center gap-2"
                    disabled={!newComment.trim() || isCommenting}
                  >
                    {isCommenting ? (
                      'Posting...'
                    ) : (
                      <>
                        <SendIcon className="size-4" />
                        Comment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </SignedIn>

          <SignedOut>
            <div className="flex justify-center p-4 border rounded-lg bg-muted/50">
              <SignInButton mode="modal">
                <Button variant="outline" className="gap-2">
                  <LogInIcon className="size-4" />
                  Sign in to comment
                </Button>
              </SignInButton>
            </div>
          </SignedOut>
        </div>
      )}
    </>
  );
}
