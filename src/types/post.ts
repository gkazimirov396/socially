import { getPosts } from '@/actions/post.action';

type Posts = Awaited<ReturnType<typeof getPosts>>;

export type Post = Posts[number];
