"use client";

import AuthLayout from "./AuthLayout";

export default function SignupPage() {
  return (
    <AuthLayout
      title="Join"
      bottomText="Already have an account?"
      bottomLinkText="Login"
      bottomLinkHref="/auth/login"
    >
      <form className="mt-6 space-y-3">
        <input
          type="text"
          placeholder="Full name"
          className="h-11 w-full rounded-xl border border-transparent bg-[#F1EFEB] px-4 text-sm outline-none transition focus:border-black"
        />
        <input
          type="email"
          placeholder="Enter email"
          className="h-11 w-full rounded-xl border border-transparent bg-[#F1EFEB] px-4 text-sm outline-none transition focus:border-black"
        />
        <input
          type="password"
          placeholder="Create password"
          className="h-11 w-full rounded-xl border border-transparent bg-[#F1EFEB] px-4 text-sm outline-none transition focus:border-black"
        />
        <button className="mt-1 w-full rounded-xl bg-black py-2.5 text-white transition hover:bg-zinc-800">
          Sign up
        </button>
      </form>
    </AuthLayout>
  );
}