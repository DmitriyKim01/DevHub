// auth.d.ts
declare module '#auth-utils' {
  interface User {
    id: number
    email: string
  }

  interface UserSession {
    lastLoggedIn: Date
  }

  interface SecureSessionData {
    // Add your own fields
    role: string
  }
}

export {};