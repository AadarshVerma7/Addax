"use client";

import { useState } from "react";
import AuthLayout from "./AuthLayout";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token, data.user);
        router.push("/");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Login to"
      bottomText="Don't have an account?"
      bottomLinkText="Sign up"
      bottomLinkHref="/auth/signup"
    >
      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-11 w-full rounded-xl border border-transparent bg-[#F1EFEB] px-4 text-sm outline-none transition focus:border-black"
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="h-11 w-full rounded-xl border border-transparent bg-[#F1EFEB] px-4 text-sm outline-none transition focus:border-black"
        />
        <button 
          disabled={loading}
          className="mt-1 w-full rounded-xl bg-black py-2.5 text-white transition hover:bg-zinc-800 disabled:bg-zinc-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </AuthLayout>
  );
}