import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function ResetPassword() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const sent = params.get("sent");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [code, setCode] = useState("");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) return setError("Enter the code you received");
    if (pw1.length < 6) return setError("Password must be at least 6 characters");
    if (pw1 !== pw2) return setError("Passwords do not match");

    // MOCK success: clear temp and go to login
    sessionStorage.removeItem("reset-id");
    nav("/login?reset=1", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold">
            L
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-textmain">Reset your password</h1>
          {sent && (
            <p className="text-xs px-3 py-2 rounded border border-success/40 bg-success/10 text-success inline-block mt-2">
              We’ve sent a reset link/code if the account exists.
            </p>
          )}
        </div>

        <form onSubmit={onSubmit} className="bg-surface border border-bordercol rounded-lg p-5 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-textmain mb-1">Reset code</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
              placeholder="Enter the 6-digit code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-textmain mb-1">New password</label>
            <div className="relative">
              <input
                type={show1 ? "text" : "password"}
                value={pw1}
                onChange={(e) => setPw1(e.target.value)}
                className="w-full rounded border border-bordercol bg-background px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-accent"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShow1((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-surface"
                aria-label="Toggle password"
              >
                {show1 ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-textmain mb-1">Confirm new password</label>
            <div className="relative">
              <input
                type={show2 ? "text" : "password"}
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                className="w-full rounded border border-bordercol bg-background px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-accent"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShow2((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-surface"
                aria-label="Toggle password"
              >
                {show2 ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-error">{error}</p>}

          <button type="submit" className="w-full px-4 py-2 rounded bg-accent text-white hover:opacity-90">
            Set new password
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
