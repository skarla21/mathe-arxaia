import { Auth } from "@auth/core";
import type { AuthConfig, Session, User } from "@auth/core/types";
import CredentialsProvider from "@auth/core/providers/credentials";
import { serverSupabaseService } from "../../utils/supabaseServer";

type MatheUser = User & {
  id: string;
  role: "admin" | "student";
};

export function getAuthOptions(): AuthConfig {
  const config = useRuntimeConfig()
  return {
  secret: config.authSecret as string,
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const supabase = serverSupabaseService();

        const { data: userRow } = await supabase
          .from("users")
          .select("id, email, role")
          .eq("email", String(credentials.email).toLowerCase())
          .single();

        if (!userRow) {
          return null;
        }

        // TODO: Add password verification once auth.users is wired
        const user: MatheUser = {
          id: userRow.id,
          email: userRow.email ?? undefined,
          role: (userRow.role as MatheUser["role"]) ?? "student",
        };

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as MatheUser).id;
        token.role = (user as MatheUser).role;
      }
      return token;
    },
    async session({ session, token }) {
      const s: Session = {
        ...session,
        user: session.user ?? {},
      };

      if (s.user) {
        (s.user as MatheUser).id = (token.id as string) ?? "";
        (s.user as MatheUser).role =
          (token.role as MatheUser["role"]) ?? "student";
      }

      return s;
    },
  },
};
}

export default defineEventHandler(async (event) => {
  const authOptions = getAuthOptions();
  const request = event.node.req;
  const url = new URL(
    request.url ?? "",
    `https://${event.node.req.headers.host}`,
  );

  const authRequest = new Request(url.toString(), {
    method: request.method,
    headers: request.headers as unknown as HeadersInit,
    body: ["GET", "HEAD"].includes(request.method || "")
      ? undefined
      : (request as any),
  });

  const response = await Auth(authRequest, authOptions);

  const setCookieHeader = response.headers.get("set-cookie");
  if (setCookieHeader) {
    event.node.res.setHeader("Set-Cookie", setCookieHeader);
  }

  return response;
});
