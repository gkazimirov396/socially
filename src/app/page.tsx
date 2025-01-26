import { SignedIn } from '@clerk/nextjs';

import { getPosts } from '@/actions/post.action';
import { getDbUserId } from '@/actions/user.action';

import CreatePost from '@/components/post/CreatePost';
import WhoToFollow from '@/components/WhoToFollow';
import PostCard from '@/components/post/PostCard';

export default async function HomePage() {
  const posts = await getPosts();

  const dbUserId = await getDbUserId();

  return (
    <section className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6">
        <SignedIn>
          <CreatePost />
        </SignedIn>

        <div className="space-y-6">
          {posts.map(post => (
            <PostCard key={post.id} post={post} dbUserId={dbUserId} />
          ))}
        </div>
      </div>

      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <WhoToFollow />
      </div>
    </section>
  );
}
