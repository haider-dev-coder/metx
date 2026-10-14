import type { AuthConfig } from 'convex/server';

export default {
  providers: [
    {
      domain: 'https://dominant-marmoset-3586.clerk.accounts.dev',
      applicationID: 'convex',
    },
  ],
} satisfies AuthConfig;