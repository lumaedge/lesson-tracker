"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ROLE_ROUTES: Record<string, string> = {
  TEACHER: "/teacher",
  HOD: "/hod",
  PRINCIPAL: "/principal",
};

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const role = session.user.role;
  const target = ROLE_ROUTES[role] || "/login";
  router.replace(target);
  return null;
}
