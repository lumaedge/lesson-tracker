"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-sm text-center">
        <div className="w-12 h-12 bg-[#1F3864] rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-lg">LR</span>
        </div>
        <h1 className="text-xl font-bold text-[#1F3864] mb-1">
          Lesson Tracker
        </h1>
        <p className="text-sm text-slate-500 mb-6">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="text-left space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-[#1F3864] outline-none text-sm transition-colors"
              placeholder="teacher@school.com"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-[#1F3864] outline-none text-sm transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#1F3864] text-white font-medium hover:bg-[#2a4a7a] disabled:opacity-50 transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
