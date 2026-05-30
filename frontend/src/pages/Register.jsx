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
            {/* <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
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
            </div> */}
            <div>
              <img src="/Task.png" alt="Task Manager" className="w-15 h-15" />
            </div>
            <span className="font-semibold text-lg tracking-tight">
              Task Manager - Stay On Track
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-white">Create account</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Start organizing your work
          </p>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-md font-medium text-[#ffffff] mb-1.5">
              Full name
            </label>
            <input
              name="name"
              required
              value={form.name}
              onChange={handle}
              placeholder="Enter Your name"
              className="w-full bg-[#000000] border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#aaaaaa] transition-colors"
            />
          </div>
          <div>
            <label className="block text-md font-medium text-[#ffffff] mb-1.5">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handle}
              placeholder="Enter your email"
              className="w-full bg-[#000000] border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#aaaaaa] transition-colors"
            />
          </div>
          <div>
            <label className="block text-md font-medium text-[#ffffff] mb-1.5">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handle}
              placeholder="Minimum 6 characters"
              className="w-full bg-[#000000] border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#aaaaaa] transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ffffff] hover:bg-[#aaaaaa] disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium py-3 rounded-xl text-sm transition-colors mt-2"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-white hover:text-[#aaaaaa] transition-colors"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
