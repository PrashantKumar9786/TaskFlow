import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      login(data.user, data.token);
      toast.success(`Welcome, ${data.user.name}!`);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white" />
                <rect
                  x="9"
                  y="1"
                  width="6"
                  height="6"
                  rx="1.5"
                  fill="white"
                  opacity="0.5"
                />
                <rect
                  x="1"
                  y="9"
                  width="6"
                  height="6"
                  rx="1.5"
                  fill="white"
                  opacity="0.5"
                />
                <rect
                  x="9"
                  y="9"
                  width="6"
                  height="6"
                  rx="1.5"
                  fill="white"
                  opacity="0.25"
                />
              </svg>
            </div>
            <span className="font-semibold text-lg tracking-tight">
              TaskFlow
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-white">Create account</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Start organizing your work
          </p>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Full name
            </label>
            <input
              name="name"
              required
              value={form.name}
              onChange={handle}
              placeholder="Your name"
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handle}
              placeholder="you@example.com"
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handle}
              placeholder="Min. 6 characters"
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl text-sm transition-colors mt-2"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Already have one?{" "}
          <Link
            to="/login"
            className="text-accent hover:text-white transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
