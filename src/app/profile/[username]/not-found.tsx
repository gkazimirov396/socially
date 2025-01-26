import Link from 'next/link';

import { ArrowLeftIcon, HomeIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <section className="min-h-[80vh] grid place-items-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <p className="text-8xl font-bold text-primary font-mono">404</p>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">
                User not found
              </h1>

              <p className="text-muted-foreground">
                The user you&apos;re looking for doesn&apos;t exist.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="default" asChild>
                <Link href="/">
                  <HomeIcon className="mr-2 size-4" />
                  Back to Home
                </Link>
              </Button>

              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeftIcon className="mr-2 size-4" />
                  Home
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}