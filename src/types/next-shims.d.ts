/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Shims and declarations to allow the Vite/React sandbox to compile Next.js 16/Auth.js v5 templates of NextAuth
declare module "next-auth" {
  export interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: any;
    username?: string;
    aiProfileScore?: number;
  }

  export interface Session {
    user?: User;
  }

  export interface NextAuthResult {
    handlers: {
      GET: any;
      POST: any;
    };
    auth: any;
    signIn: any;
    signOut: any;
  }

  export default function NextAuth(config: any): NextAuthResult;
}

declare module "next-auth/providers/credentials" {
  export default function Credentials(config: any): any;
}

declare module "@auth/prisma-adapter" {
  export function PrismaAdapter(prismaClient: any): any;
}

declare module "@prisma/client" {
  export class PrismaClient {
    user: {
      findFirst(args: any): Promise<any>;
      findUnique(args: any): Promise<any>;
    };
    milestone: {
      findUnique(args: any): Promise<any>;
      update(args: any): Promise<any>;
    };
    clientProfile: {
      update(args: any): Promise<any>;
    };
    transactionLedger: {
      create(args: any): Promise<any>;
    };
    $transaction(fn: (tx: any) => Promise<any>): Promise<any>;
  }
}

declare module "bcryptjs" {
  export function compare(s: string, hash: string): Promise<boolean>;
  export function hash(s: string, salt: number | string): Promise<string>;
}

declare module "next/navigation" {
  export function useRouter(): {
    push(url: string): void;
    refresh(): void;
  };
  export function redirect(url: string): never;
}

declare module "next-auth/react" {
  export function signIn(provider: string, options?: any): Promise<any>;
  export function signOut(options?: any): Promise<any>;
  export function useSession(): {
    data: any;
    status: "loading" | "authenticated" | "unauthenticated";
    update(data?: any): Promise<any>;
  };
  export const SessionProvider: any;
}
