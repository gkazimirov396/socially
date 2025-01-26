import { getProfileByUsername, getUserPosts } from '@/actions/profile.action';

export type User = Awaited<ReturnType<typeof getProfileByUsername>>;
export type Posts = Awaited<ReturnType<typeof getUserPosts>>;
