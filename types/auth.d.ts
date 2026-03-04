import type { Session, User } from "@auth/core/types";

declare module "@auth/core/types" {
  interface Session {
    user?: (User & { id?: string; role?: "admin" | "student" }) | null;
  }

  interface User {
    id?: string;
    role?: "admin" | "student";
  }
}

export type MatheSession = Session;
