import { config } from '@keystone-6/core';
import { lists } from './schema';
import { readFileSync } from 'fs';
import { join } from 'path';
import { withAuth, session } from './auth';
import { extendGraphqlSchema } from './extendGraphqlSchema';

const db_url = process.env.DATABASE_URL ?? "postgres://postgres:postgrespw@localhost:5432/magicLink-db";

const loginComponentSource = readFileSync(
  join(process.cwd(), 'custom-pages', 'loginPage.tsx'),
  'utf-8'
);

export default withAuth(
  config({
    db: {
      provider: 'postgresql',
      url: db_url,
    },
    lists,
    session, 
    graphql: { extendGraphqlSchema },

    ui: {
      isAccessAllowed: ({ session }) => !!session?.itemId,
      publicPages: ['/login', '/magicLogin', '/testPage'],
      pageMiddleware: async ({ basePath, wasAccessAllowed }) => {
        if (wasAccessAllowed || basePath === '/login') return;
        return { kind: 'redirect', to: '/login' };
      },
      getAdditionalFiles: [
        async () => [
          {
            mode: 'write',
            src: loginComponentSource,
            outputPath: 'pages/login.js',
          },
        ],
      ],
    },
  })
);
