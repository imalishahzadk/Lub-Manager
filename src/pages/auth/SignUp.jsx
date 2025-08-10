import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function SignUp() {
  const nav = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "admin", // default for MVP
    password: "",
    confirm: "",
    accept: false,
  });
  const [errors, setErrors] = useState({});

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Valid email is required";
    if (!/^[0-9+\-\s]{7,20}$/.test(form.phone || "")) e.phone = "Valid phone is required";
    if (!form.password || form.password.length < 6) e.password = "Min 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    if (!form.accept) e.accept = "Please accept the terms";
    return e;
    // NOTE: in real app, backend will enforce & return precise errors.
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eObj = validate();
    setErrors(eObj);
    if (Object.keys(eObj).length) return;

    // MVP: mock success and go to login
    // (Later: call POST /auth/signup and handle token/redirect)
    sessionStorage.setItem(
      "signup-preview",
      JSON.stringify({ name: form.name, email: form.email, role: form.role })
    );
    nav("/login?justSignedUp=1", { replace: true });
  };

  const strength = passwordStrength(form.password);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold">
            L
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-textmain">Create your account</h1>
          <p className="text-sm text-textmain/70">Sign up to start managing lube sales & inventory</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-bordercol rounded-lg p-5 shadow-sm space-y-4"
        >
          {/* Name */}
          <Field label="Full name" error={errors.name}>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
              placeholder="Ali Shahzad"
            />
          </Field>

          {/* Email */}
          <Field label="Email" error={errors.email}>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
              placeholder="you@example.com"
            />
          </Field>

          {/* Phone */}
          <Field label="Phone" error={errors.phone}>
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
              placeholder="+92 300 1234567"
            />
          </Field>

          {/* Role (note: superadmin is usually invite-only; shown here for preview) */}
          <Field label="Role">
            <select
              name="role"
              value={form.role}
              onChange={onChange}
              className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="admin">Admin (station operator)</option>
              <option value="superadmin">Super Admin (owner/manager)</option>
            </select>
            <p className="mt-1 text-xs text-textmain/60">
              For production, we’ll restrict “Super Admin” signup to invites or the first account only.
            </p>
          </Field>

          {/* Password */}
          <Field label="Password" error={errors.password}>
            <div className="relative">
              <input
                name="password"
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={onChange}
                className="w-full rounded border border-bordercol bg-background px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-accent"
                placeholder="••••••••"
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

            {/* strength bar */}
            <div className="mt-2">
              <div className="h-2 w-full bg-bordercol rounded">
                <div
                  className="h-2 rounded transition-all"
                  style={{
                    width: `${strength.pct}%`,
                    backgroundColor: strength.color,
                  }}
                />
              </div>
              <div className="mt-1 text-xs text-textmain/70">{strength.label}</div>
            </div>
          </Field>

          {/* Confirm */}
          <Field label="Confirm password" error={errors.confirm}>
            <div className="relative">
              <input
                name="confirm"
                type={showPw2 ? "text" : "password"}
                value={form.confirm}
                onChange={onChange}
                className="w-full rounded border border-bordercol bg-background px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-accent"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw2((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-surface"
                aria-label="Toggle password visibility"
              >
                {showPw2 ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </div>
          </Field>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input
              id="accept"
              name="accept"
              type="checkbox"
              checked={form.accept}
              onChange={onChange}
              className="mt-1"
            />
            <label htmlFor="accept" className="text-sm text-textmain/80">
              I agree to the <span className="underline">Terms</span> and <span className="underline">Privacy Policy</span>.
            </label>
          </div>
          {errors.accept && <p className="text-xs text-error mt-1">{errors.accept}</p>}

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 px-4 py-2 rounded bg-accent text-white hover:opacity-90"
          >
            Create account
          </button>

          <div className="text-sm text-textmain/80 text-center mt-3">
            Already have an account?{" "}
            <Link className="text-accent underline" to="/login">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

/* small building blocks */
function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-textmain mb-1">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}

function passwordStrength(pw) {
  if (!pw) return { pct: 0, label: "Enter a password", color: "#E0E0E0" };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const pct = Math.min(100, (score / 5) * 100);
  const label =
    score <= 2 ? "Weak" : score === 3 ? "Medium" : score === 4 ? "Strong" : "Very strong";
  const color =
    score <= 2 ? "rgba(208, 52, 44, 0.7)" : score === 3 ? "rgba(242, 157, 53, 0.9)" : "rgba(60, 169, 120, 0.9)";
  return { pct, label, color };
}
