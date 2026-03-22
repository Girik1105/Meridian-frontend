"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/api";
import { Compass, LogOut, ArrowLeft } from "lucide-react";
import { TasterHub } from "@/components/taster";

export default function TastersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-snow">
        <div className="flex flex-col items-center gap-3">
          <Compass className="h-8 w-8 text-secondary animate-spin" />
          <span className="text-slate font-body text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="h-screen bg-snow flex flex-col overflow-hidden">
      <header className="bg-white border-b border-silver/50 flex-shrink-0">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center gap-1 text-sm text-slate hover:text-ink font-heading font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </button>
            <div className="flex items-center gap-2 font-heading font-bold text-lg text-primary">
              <Compass className="h-6 w-6 text-secondary" />
              Meridian
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-charcoal font-body">
              {user.username}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-ink font-heading font-medium transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <TasterHub />
    </div>
  );
}
