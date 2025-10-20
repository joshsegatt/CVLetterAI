// Global type declarations for CVLetterAI
declare module 'next/server' {
  export class NextRequest {
    headers: Headers;
    nextUrl: URL;
    url: string;
    method: string;
    json(): Promise<any>;
    formData(): Promise<FormData>;
    clone(): NextRequest;
    cookies: {
      get(name: string): { value: string } | undefined;
    };
    // Add other methods as needed
  }
  
  export class NextResponse extends Response {
    static json(body: any, init?: ResponseInit): NextResponse;
    static next(): NextResponse;
    static redirect(url: string | URL): NextResponse;
    headers: Headers;
    constructor(body?: BodyInit | null, init?: ResponseInit);
    // Add other methods as needed
  }
}

declare module 'next-auth/react' {
  export function signIn(provider?: string, options?: any): Promise<any>;
  export function getSession(): Promise<any>;
  // Add other exports as needed
}

declare module 'next-auth/jwt' {
  export function getToken(options: any): Promise<any>;
}

declare module 'zod' {
  namespace z {
    interface ZodString {
      min(value: number, message?: string): ZodString;
      max(value: number, message?: string): ZodString;
      email(message?: string): ZodString;
      regex(pattern: RegExp, message?: string): ZodString;
      toLowerCase(): ZodString;
    }
    interface ZodBoolean {
      refine(fn: (val: boolean) => boolean, message: string): ZodBoolean;
    }
    interface ZodObject<T> {
      refine(fn: (data: any) => boolean, options: { message: string; path: string[] }): ZodObject<T>;
      parse(data: any): any;
    }
    function string(): ZodString;
    function boolean(): ZodBoolean;
    function object<T>(shape: T): ZodObject<T>;
    function infer<T>(schema: T): any;
  }
  export const z: typeof z;
  export class ZodError extends Error {
    errors: Array<{
      path: string[];
      message: string;
    }>;
  }
}

declare module 'lucide-react' {
  export const CheckCircle: any;
  export const ArrowRight: any;
  export const Eye: any;
  export const EyeOff: any;
  export const User: any;
  export const Mail: any;
  export const Lock: any;
  export const Shield: any;
  export const AlertCircle: any;
  // Add other icons as needed
}

declare module '@hookform/resolvers/zod' {
  export function zodResolver(schema: any): any;
}

declare module 'react-hook-form' {
  export function useForm(options?: any): any;
}

declare module 'next/link' {
  import { ComponentType, AnchorHTMLAttributes } from 'react';
  
  interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
  }
  
  const Link: ComponentType<LinkProps>;
  export default Link;
}

declare module 'next/navigation' {
  export function useRouter(): {
    push: (url: string) => void;
    replace: (url: string) => void;
    back: () => void;
    forward: () => void;
    refresh: () => void;
  };
  
  export function useSearchParams(): {
    get: (name: string) => string | null;
    // Add other methods as needed
  };
}

// Global declarations
declare global {
  interface Window {
    location: Location;
    history: History;
  }
  
  const process: {
    env: Record<string, string | undefined>;
  };
  
  const global: {
    rateLimitStore?: Map<string, { count: number; resetTime: number }>;
    securityLogs?: any[];
    ipBlockList?: Set<string>;
  };

  const Buffer: {
    from(data: any, encoding?: string): Buffer;
  };

  const crypto: {
    getRandomValues(array: Uint8Array): Uint8Array;
  };
}

export {};