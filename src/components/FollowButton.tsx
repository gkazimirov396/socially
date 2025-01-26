'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2Icon } from 'lucide-react';

import { toggleFollow } from '@/actions/user.action';

import { Button } from './ui/button';

export default function FollowButton({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    setIsLoading(true);

    try {
      await toggleFollow(userId);

      toast.success('User followed successfully');
    } catch {
      toast.error('Error following user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      className="w-20"
      variant="secondary"
      disabled={isLoading}
      onClick={handleFollow}
    >
      {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : 'Follow'}
    </Button>
  );
}
