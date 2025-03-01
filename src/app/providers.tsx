'use client';

import { usePathname, useSearchParams } from 'next/navigation';

import { useEffect, Suspense, type PropsWithChildren } from 'react';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { usePostHog } from 'posthog-js/react';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'react-hot-toast';
import { dark } from '@clerk/themes';
import posthog from 'posthog-js';

import { ThemeProvider } from '@/context/ThemeProvider';

export function PostHogProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: false,
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  );
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const posthog = usePostHog();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + '?' + searchParams.toString();
      }

      console.log(url);

      posthog.capture('$pageview', { $current_url: url });
    }
  }, [pathname, searchParams, posthog]);

  return null;
}

function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <PostHogProvider>
          {children}
          <Toaster />
        </PostHogProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
