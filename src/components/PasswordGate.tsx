"use client";

import { useState } from "react";

const PIN = "333222";

export default function PasswordGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [entered, setEntered] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  if (entered) return <>{children}</>;

  return (
    <div className="flex flex-1 items-center justify-center min-h-screen bg-slate-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
        <h1 className="text-xl font-bold text-[#1F3864] mb-2">
          Lesson Tracker
        </h1>
        <p className="text-sm text-slate-500 mb-6">Enter PIN to continue</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input === PIN) {
              setEntered(true);
            } else {
              setError(true);
              setInput("");
            }
          }}
        >
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={input}
            onChange={(e) => {
              setInput(e.target.value.replace(/\D/g, ""));
              setError(false);
            }}
            className={`w-full text-center text-2xl tracking-[0.5em] px-4 py-3 rounded-lg border-2 outline-none transition-colors ${
              error
                ? "border-red-400 bg-red-50"
                : "border-slate-200 focus:border-[#1F3864]"
            }`}
            placeholder="------"
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-sm mt-2">Incorrect PIN</p>
          )}
          <button
            type="submit"
            className="mt-4 w-full py-3 rounded-lg bg-[#1F3864] text-white font-medium hover:bg-[#2a4a7a] transition-colors"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
