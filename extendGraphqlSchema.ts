import { graphql } from '@keystone-6/core';
import { Context } from '.keystone/types';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export const extendGraphqlSchema = graphql.extend(() => ({
  mutation: {
    sendMagicLinkWithGoogle: graphql.field({
      type: graphql.Boolean,
      args: { idToken: graphql.arg({ type: graphql.nonNull(graphql.String) }) },
      async resolve(source, { idToken }, context: Context) {
        try {
          const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          });
          const payload = ticket.getPayload();
          const email = payload?.email;
          if (!email) throw new Error('Google token did not return email');

          const user = await context.db.User.findOne({ where: { email } });
          if (!user) throw new Error('User not found');

          const token = crypto.randomBytes(32).toString('hex');
          const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

          await context.db.User.updateOne({
            where: { id: user.id },
            data: {
              magicLinkToken: token,
              magicLinkTokenExpiry: expiry.toISOString(),
            },
          });

          const magicLink = `http://localhost:3000/magicLogin?token=${token}`;

          const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
              user: 'muhammadluqmang@gmail.com',
              pass: 'prtepyxpvmvmgpes',
            },
          });

          await transporter.sendMail({
            to: email,
            subject: 'Your magic login link',
            html: `<p>Click to login: <a href="${magicLink}">Login</a></p>`,
          });

          console.log('Magic link sent to:', email);
          return true;
        } catch (error) {
          console.error('Error in sendMagicLinkWithGoogle:', error);
          return false;
        }
      },
    }),

    magicLogin: graphql.field({
      type: graphql.Boolean,
      args: { token: graphql.arg({ type: graphql.nonNull(graphql.String) }) },
      async resolve(source, { token }, context: Context) {
        try {
          const user = await context.db.User.findOne({ where: { magicLinkToken: token } });
          if (!user) {
            console.error('User not found for token');
            return false;
          }

          if (!user.magicLinkTokenExpiry || new Date(user.magicLinkTokenExpiry) < new Date()) {
            console.error('Magic link expired');
            return false;
          }

          // Clear the magic link fields so token can't be reused
          await context.db.User.updateOne({
            where: { id: user.id },
            data: { magicLinkToken: null, magicLinkTokenExpiry: null },
          });

          // ✅ Set Keystone session (works with statelessSessions):
          await context.session?.start({
            itemId: user.id,
            listKey: 'User',
            data: {
              name: user.name,
              email: user.email,
            },
          });

          console.log('Magic login successful, session started for user:', user.id);
          return true;
        } catch (error) {
          console.error('Error in magicLogin:', error);
          return false;
        }
      },
    }),
  },
}));
