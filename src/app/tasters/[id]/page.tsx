"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Compass, Loader2 } from "lucide-react";
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
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Poll while taster is still generating
  useEffect(() => {
    if (!taster || taster.status !== "generating") {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      return;
    }

    pollRef.current = setInterval(async () => {
      try {
        const updated = await getTasterDetail(id);
        setTaster(updated);
        if (updated.status !== "generating" && pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      } catch {
        // Keep polling on transient errors
      }
    }, 3000);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [taster?.status, id]);

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

  // Show generating state with polling
  if (taster.status === "generating") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-snow">
        <div className="text-center max-w-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary-light mb-5">
            <Loader2 className="h-8 w-8 text-secondary animate-spin" />
          </div>
          <h2 className="font-heading text-xl font-bold text-ink mb-2">
            Generating Your Taster
          </h2>
          <p className="font-body text-sm text-charcoal mb-4">
            Our AI mentor is crafting a personalized 30-minute experience for{" "}
            <strong className="font-heading font-semibold">{taster.skill_name}</strong>.
          </p>
          <div className="w-full h-2 bg-cloud rounded-full overflow-hidden mb-3">
            <div className="h-full bg-secondary rounded-full animate-pulse-glow" style={{ width: "80%", transition: "width 10s ease-out" }} />
          </div>
          <p className="font-body text-xs text-slate">
            This usually takes 15&ndash;30 seconds...
          </p>
        </div>
      </div>
    );
  }

  // Show failure state
  if (taster.status === "generation_failed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-snow">
        <div className="text-center max-w-sm">
          <p className="font-body text-sm text-charcoal mb-4">
            Taster generation failed. Please go back and retry.
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
