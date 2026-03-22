"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Compass } from "lucide-react";
import { getTasterDetail } from "@/lib/api";
import type { SkillTasterDetail } from "@/types/taster";
import { TasterPlayer, TasterAssessment } from "@/components/taster";

export default function TasterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [taster, setTaster] = useState<SkillTasterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = params.id as string;

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!id || authLoading || !user) return;
    let cancelled = false;

    async function load() {
      try {
        const data = await getTasterDetail(id);
        if (!cancelled) setTaster(data);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load taster");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id, authLoading, user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-snow">
        <div className="flex flex-col items-center gap-3">
          <Compass className="h-8 w-8 text-secondary animate-spin" />
          <span className="text-slate font-body text-sm">Loading taster...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (error || !taster) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-snow">
        <div className="text-center">
          <p className="font-body text-sm text-charcoal mb-4">
            {error || "Taster not found"}
          </p>
          <button
            onClick={() => router.push("/tasters")}
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-heading font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            Back to Tasters
          </button>
        </div>
      </div>
    );
  }

  // Show assessment if completed
  if (taster.status === "completed" && taster.assessment) {
    return (
      <TasterAssessment
        assessment={taster.assessment}
        skillName={taster.skill_name}
        modules={taster.taster_content.modules}
        responses={taster.responses}
      />
    );
  }

  // Show course player
  return (
    <TasterPlayer
      taster={taster}
      onComplete={(updated) => setTaster(updated)}
    />
  );
}
