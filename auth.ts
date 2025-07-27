// auth.ts
import { createAuth } from '@keystone-6/auth';
import { statelessSessions } from '@keystone-6/core/session';

const sessionSecret = process.env.SESSION_SECRET || '3b2a0c0e91f14584a890d7b81f2d3a56df9c7eeb12ab4c03d93c40e4f98a7301';
const sessionMaxAge = 60 * 60 * 24 * 30; // 30 days

// Keystone will use this to create the session JWT + set cookie
export const session = statelessSessions({
  maxAge: sessionMaxAge,
  secret: sessionSecret,
});

// Export withAuth to wrap your Keystone config
export const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  sessionData: 'name email',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
  },
});

