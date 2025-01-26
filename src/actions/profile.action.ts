'use server';

import { revalidatePath } from 'next/cache';

import { auth } from '@clerk/nextjs/server';

import prisma from '@/lib/prisma';

import { getDbUserId } from './user.action';
import {
  UpdateProfileInput,
  UpdateProfileSchema,
} from '@/schema/profile.schema';

export async function getProfileByUsername(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        image: true,
        location: true,
        website: true,
        createdAt: true,

        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw new Error('Failed to fetch profile');
  }
}

export async function getUserPosts(userId: string) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },

      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },

        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },

          orderBy: {
            createdAt: 'asc',
          },
        },

        likes: {
          select: {
            userId: true,
          },
        },

        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw new Error('Failed to fetch user posts');
  }
}

export async function getUserLikedPosts(userId: string) {
  try {
    const likedPosts = await prisma.post.findMany({
      where: {
        likes: {
          some: {
            userId,
          },
        },
      },

      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },

        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },

          orderBy: {
            createdAt: 'asc',
          },
        },

        likes: {
          select: {
            userId: true,
          },
        },

        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return likedPosts;
  } catch (error) {
    console.error('Error fetching liked posts:', error);
    throw new Error('Failed to fetch liked posts');
  }
}

export async function updateProfile(formValues: UpdateProfileInput) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error('Unauthorized');

    const updatedProfile = UpdateProfileSchema.parse(formValues);

    const user = await prisma.user.update({
      where: { clerkId },
      data: updatedProfile,
    });

    revalidatePath('/profile');
    return { success: true, user };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

export async function isFollowing(userId: string) {
  try {
    const currentUserId = await getDbUserId();
    if (!currentUserId) return false;

    const follow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userId,
        },
      },
    });

    return !!follow;
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
}