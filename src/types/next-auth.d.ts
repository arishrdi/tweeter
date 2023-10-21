import { type DefaultUser } from 'next-auth';
declare module 'next-auth' {
    interface Session {
        user?: DefaultUser & { id: string; username: string };
    }
    interface User extends DefaultUser {
        username?: string | null;
    }
}
