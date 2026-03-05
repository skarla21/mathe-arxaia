import { Auth } from "@auth/core";
import type { AuthConfig, Session, User } from "@auth/core/types";
import CredentialsProvider from "@auth/core/providers/credentials";
import GoogleProvider from "@auth/core/providers/google";
import { serverSupabaseService } from "../../utils/supabaseServer";
import { verifyPassword } from "../../utils/password";

type MatheUser = User & {
  id: string;
  isAdmin: boolean;
};

export function getAuthOptions(): AuthConfig {
  const config = useRuntimeConfig();

  return {
    basePath: "/api/auth",
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
            .select('id, email, "isAdmin", password_hash')
            .eq("email", String(credentials.email).toLowerCase())
            .maybeSingle();

          if (
            !userRow ||
            !(await verifyPassword(String(credentials.password), userRow.password_hash))
          ) {
            return null;
          }

          const user: MatheUser = {
            id: userRow.id,
            email: userRow.email ?? undefined,
            isAdmin: !!userRow.isAdmin,
          };

          return user;
        },
      }),
      GoogleProvider({
        clientId: config.googleClientId as string,
        clientSecret: config.googleClientSecret as string,
      }),
    ],
    callbacks: {
      async jwt({ token, user, account }) {
        if (user) {
          // Credentials login: MatheUser already has id + isAdmin
          if ((user as MatheUser).id) {
            token.id = (user as MatheUser).id;
            token.isAdmin = (user as MatheUser).isAdmin;
            return token;
          }

          // OAuth login: ensure user row exists in Supabase
          if (account && account.provider !== "credentials" && user.email) {
            const supabase = serverSupabaseService();
            const email = String(user.email).toLowerCase();

            const { data: existing } = await supabase
              .from("users")
              .select('id, "isAdmin"')
              .eq("email", email)
              .maybeSingle();

            let dbUser = existing;

            if (!dbUser) {
              const { data: inserted } = await supabase
                .from("users")
                .insert({ email })
                .select('id, "isAdmin"')
                .single();

              dbUser = inserted ?? null;
            }

            if (dbUser) {
              token.id = dbUser.id;
              token.isAdmin = !!dbUser.isAdmin;
            }
          }
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
          (s.user as MatheUser).isAdmin = Boolean(token.isAdmin);
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
