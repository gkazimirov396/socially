import Link from 'next/link';

import { getRandomUsers } from '@/actions/user.action';

import FollowButton from './FollowButton';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarImage } from './ui/avatar';

export default async function WhoToFollow() {
  const users = await getRandomUsers();

  if (users.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Who to Follow</CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="space-y-4">
          {users.map(user => (
            <li
              key={user.id}
              className="flex gap-2 items-center justify-between "
            >
              <div className="flex items-center gap-1">
                <Link href={`/profile/${user.username}`}>
                  <Avatar>
                    <AvatarImage src={user.image ?? '/avatar.png'} />
                  </Avatar>
                </Link>

                <div className="text-xs">
                  <Link
                    href={`/profile/${user.username}`}
                    className="font-medium cursor-pointer"
                  >
                    {user.name}
                  </Link>

                  <p className="text-muted-foreground">@{user.username}</p>
                  <p className="text-muted-foreground">
                    {user._count.followers} followers
                  </p>
                </div>
              </div>

              <FollowButton userId={user.id} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
