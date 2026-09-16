import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { signIn } from "../libs/auth-client";

export const Route = createFileRoute("/signin")({
  /* beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: "/",
      });
    }
  }, */
  component: RouteComponent,
});

function RouteComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  // const navigate = useNavigate();

  const loginHandler = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await signIn.email({ email, password });
      setSubmitting(false);

      if (error) {
        console.error(error.message);
      }
    }
    catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-(--app-bg) px-4">
      <div>
        <form onSubmit={loginHandler}>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" onChange={e => setEmail(e.target.value)} value={email} />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" onChange={e => setPassword(e.target.value)} value={password} />
          </div>
          <button disabled={submitting}>Submit</button>
        </form>
      </div>
    </div>
  );
}
