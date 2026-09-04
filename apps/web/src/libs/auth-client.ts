import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({});

await authClient.signIn.email({
  email: "test@user.com",
  password: "password1234",
});

type AuthUser = typeof authClient.$Infer.Session.user;

export interface AuthState {
  user: AuthUser | null;
}
