// auth.d.ts
declare module '#auth-utils' {
  interface User {
    id: number;
    email: string;
  }

  interface UserSession {
    user: User;
    lastLoggedIn: Date;
  }

  interface SecureSessionData {
    // Add your own fields
    role: string;
  }
}

export {};
