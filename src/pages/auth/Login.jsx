import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function Login() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({
    id: "", // email OR phone
    password: "",
    remember: true,
    // TEMP: let you preview role in the app until backend auth is ready
    role: localStorage.getItem("role") || "admin",
  });
  const [errors, setErrors] = useState({});
  const justSignedUp = params.get("justSignedUp");

  const onChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    const e = {};
    if (!isValidId(form.id)) e.id = "Enter a valid email or phone";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eObj = validate();
    setErrors(eObj);
    if (Object.keys(eObj).length) return;

    // MOCK login success
    if (form.remember) localStorage.setItem("role", form.role);
    sessionStorage.setItem("auth", JSON.stringify({ id: form.id, role: form.role }));
    nav("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold">
            L
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-textmain">Welcome back</h1>
          <p className="text-sm text-textmain/70">Sign in to your LubeManager account</p>
          {justSignedUp && (
            <div className="mt-3 text-xs px-3 py-2 rounded border border-success/40 bg-success/10 text-success">
              Account created. Please log in.
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-bordercol rounded-lg p-5 shadow-sm space-y-4">
          <Field label="Email or Phone" error={errors.id}>
            <input
              name="id"
              value={form.id}
              onChange={onChange}
              className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
              placeholder="you@example.com or +92 300 1234567"
              autoComplete="username"
            />
          </Field>

          <Field label="Password" error={errors.password}>
            <div className="relative">
              <input
                name="password"
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={onChange}
                className="w-full rounded border border-bordercol bg-background px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-accent"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-surface"
                aria-label="Toggle password visibility"
              >
                {showPw ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </div>
          </Field>

          {/* TEMP role switch (remove after backend auth) */}
          <Field label="Role (demo only)">
            <select
              name="role"
              value={form.role}
              onChange={onChange}
              className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </Field>

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-textmain/80">
              <input type="checkbox" name="remember" checked={form.remember} onChange={onChange} />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-sm text-accent underline">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="w-full mt-2 px-4 py-2 rounded bg-accent text-white hover:opacity-90">
            Log in
          </button>

          <div className="text-sm text-textmain/80 text-center mt-3">
            Don’t have an account?{" "}
            <Link className="text-accent underline" to="/signup">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-textmain mb-1">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}

function isValidId(v) {
  const email = /^\S+@\S+\.\S+$/;
  const phone = /^[+]?[\d\s\-()]{7,20}$/;
  return email.test(v) || phone.test(v);
}
