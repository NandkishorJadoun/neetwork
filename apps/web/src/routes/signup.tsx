import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { signUp } from "../libs/auth-client";

export const Route = createFileRoute("/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const signUpHandler = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await signUp.email({ name, email, password });
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
        <form onSubmit={signUpHandler}>
          <div>
            <label htmlFor="name">Name</label>
            <input name="name" id="name" onChange={e => setName(e.target.value)} value={name} />
          </div>
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
