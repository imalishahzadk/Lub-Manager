import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const nav = useNavigate();
  const [id, setId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidId(id)) return setError("Enter a valid email or phone");

    // MOCK: pretend we sent a code/link
    sessionStorage.setItem("reset-id", id);
    nav("/reset-password?sent=1", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold">
            L
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-textmain">Forgot password</h1>
          <p className="text-sm text-textmain/70">Enter your email or phone. We’ll send a reset link or code.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-bordercol rounded-lg p-5 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-textmain mb-1">Email or Phone</label>
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
              placeholder="you@example.com or +92 300 1234567"
            />
            {error && <p className="mt-1 text-xs text-error">{error}</p>}
          </div>

          <button type="submit" className="w-full px-4 py-2 rounded bg-accent text-white hover:opacity-90">
            Send reset link / code
          </button>

          <div className="text-sm text-textmain/80 text-center mt-3">
            <Link className="text-accent underline" to="/login">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

function isValidId(v) {
  const email = /^\S+@\S+\.\S+$/;
  const phone = /^[+]?[\d\s\-()]{7,20}$/;
  return email.test(v) || phone.test(v);
}
