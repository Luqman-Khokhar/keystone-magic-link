// types/keystone.d.ts
import { IncomingMessage } from 'http';

declare module 'http' {
  interface IncomingMessage {
    session?: {
      userId?: string;
    };
  }
}
