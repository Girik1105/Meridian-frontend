"use client";

import { useState, useEffect, useCallback } from "react";
import { getMe } from "@/lib/api";

export interface UserProfile {
  id: string;
  profile_data: Record<string, unknown>;
  onboarding_completed: boolean;
  profile_version: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
  profile: UserProfile;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMe();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, refetch: fetchUser };
}
