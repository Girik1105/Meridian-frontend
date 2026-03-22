const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("meridian_access");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("meridian_refresh");
}

export function storeTokens(access: string, refresh: string) {
  localStorage.setItem("meridian_access", access);
  localStorage.setItem("meridian_refresh", refresh);
}

export function clearTokens() {
  localStorage.removeItem("meridian_access");
  localStorage.removeItem("meridian_refresh");
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...options,
    headers,
  });

  // If access token expired, try refreshing
  if (res.status === 401) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      const refreshRes = await fetch(`${API_BASE}/auth/refresh/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        storeTokens(data.access, data.refresh);

        // Retry original request with new token
        const retryHeaders: Record<string, string> = {
          "Content-Type": "application/json",
          ...(options.headers as Record<string, string>),
          Authorization: `Bearer ${data.access}`,
        };
        return fetch(`${API_BASE}${path}`, {
          credentials: "include",
          ...options,
          headers: retryHeaders,
        });
      } else {
        clearTokens();
      }
    }
  }

  return res;
}

export async function register(data: {
  username: string;
  email: string;
  password: string;
}) {
  const res = await apiFetch("/auth/register/", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    try {
      const err = await res.json();
      throw new Error(
        Object.values(err).flat().join(" ") || "Registration failed"
      );
    } catch (e) {
      if (e instanceof Error && e.message !== "Registration failed") throw e;
      throw new Error("Registration failed");
    }
  }
  const result = await res.json();
  if (result.access && result.refresh) {
    storeTokens(result.access, result.refresh);
  }
  return result;
}

export async function login(data: { username: string; password: string }) {
  const res = await apiFetch("/auth/login/", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Login failed");
  }
  const result = await res.json();
  if (result.access && result.refresh) {
    storeTokens(result.access, result.refresh);
  }
  return result;
}

export async function forgotPassword(data: { email: string }) {
  const res = await apiFetch("/auth/forgot-password/", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    try {
      const err = JSON.parse(text);
      throw new Error(err.detail || "Request failed");
    } catch (e) {
      if (e instanceof SyntaxError) throw new Error("Request failed. Please try again.");
      throw e;
    }
  }
  return res.json();
}

export async function resetPassword(data: {
  uid: string;
  token: string;
  new_password: string;
}) {
  const res = await apiFetch("/auth/reset-password/", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    try {
      const err = JSON.parse(text);
      throw new Error(err.detail || "Password reset failed");
    } catch (e) {
      if (e instanceof SyntaxError) throw new Error("Password reset failed. Please try again.");
      throw e;
    }
  }
  return res.json();
}

export async function logout() {
  await apiFetch("/auth/logout/", { method: "POST" });
  clearTokens();
}

export async function getMe() {
  const res = await apiFetch("/auth/me/");
  if (!res.ok) return null;
  return res.json();
}

// --- SSE Streaming ---

export interface SSECallbacks {
  onToken: (text: string) => void;
  onDone: (data: Record<string, unknown>) => void;
  onError: (error: string) => void;
}

export async function streamChat(
  conversationId: string,
  callbacks: SSECallbacks
): Promise<void> {
  const res = await apiFetch(`/chat/stream/${conversationId}/`, {
    method: "GET",
    headers: { Accept: "text/event-stream" },
  });

  if (!res.ok || !res.body) {
    callbacks.onError(`Stream failed: ${res.status}`);
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line === "" || line.startsWith(":")) continue;

        if (line.startsWith("data: ")) {
          try {
            const event = JSON.parse(line.slice(6));
            switch (event.type) {
              case "token":
                callbacks.onToken(event.data);
                break;
              case "done":
                callbacks.onDone(event.data);
                break;
              case "error":
                callbacks.onError(event.data);
                break;
            }
          } catch {
            // Malformed JSON line, skip
          }
        }
      }
    }
  } catch (err) {
    callbacks.onError(
      err instanceof Error ? err.message : "Stream connection lost"
    );
  } finally {
    reader.releaseLock();
  }
}

// --- Career Paths ---

export async function generateCareerPaths() {
  const res = await apiFetch("/career-paths/generate/", {
    method: "POST",
  });

  if (res.status === 202) {
    // Background generation — poll until paths appear
    return pollCareerPathsReady();
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to generate career paths");
  }
  return res.json();
}

async function pollCareerPathsReady(maxAttempts = 30): Promise<unknown> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const paths = await getCareerPaths();
    if (Array.isArray(paths) && paths.length > 0) return paths;
  }
  throw new Error("Career path generation timed out. Please try again.");
}

export async function getCareerPaths(sortBy?: string) {
  const query = sortBy ? `?sort_by=${sortBy}` : "";
  const res = await apiFetch(`/career-paths/${query}`);
  if (!res.ok) throw new Error("Failed to fetch career paths");
  return res.json();
}

export async function selectCareerPath(pathId: string) {
  const res = await apiFetch(`/career-paths/${pathId}/select/`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to select career path");
  return res.json();
}

// --- Skill Tasters ---

export async function getTasters(careerPathId?: string) {
  const query = careerPathId ? `?career_path_id=${careerPathId}` : "";
  const res = await apiFetch(`/tasters/${query}`);
  if (!res.ok) throw new Error("Failed to fetch tasters");
  return res.json();
}

export async function getTasterDetail(id: string) {
  const res = await apiFetch(`/tasters/${id}/`);
  if (!res.ok) throw new Error("Failed to fetch taster detail");
  return res.json();
}

export async function generateTaster(careerPathId: string, skillName: string) {
  const res = await apiFetch("/tasters/generate/", {
    method: "POST",
    body: JSON.stringify({ career_path_id: careerPathId, skill_name: skillName }),
  });

  const data = await res.json();

  if (res.status === 202 && data.status === "generating") {
    // Background generation — poll until ready
    return pollTasterReady(data.id);
  }

  if (!res.ok) {
    throw new Error(data.detail || "Failed to generate taster");
  }
  return data;
}

async function pollTasterReady(id: string, maxAttempts = 30): Promise<unknown> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const taster = await getTasterDetail(id);
    if (taster.status === "generation_failed") {
      throw new Error("Taster generation failed. Please try again.");
    }
    if (taster.status !== "generating") return taster;
  }
  throw new Error("Taster generation timed out. Please try again.");
}

export async function startTaster(id: string) {
  const res = await apiFetch(`/tasters/${id}/start/`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to start taster");
  return res.json();
}

export async function respondToModule(
  tasterId: string,
  moduleId: string,
  userResponse: string,
  timeSpentSeconds: number
) {
  const res = await apiFetch(`/tasters/${tasterId}/respond/`, {
    method: "POST",
    body: JSON.stringify({
      module_id: moduleId,
      user_response: userResponse,
      time_spent_seconds: timeSpentSeconds,
    }),
  });
  if (!res.ok) throw new Error("Failed to submit response");
  return res.json();
}

export async function completeTaster(id: string) {
  const res = await apiFetch(`/tasters/${id}/complete/`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to complete taster");
  return res.json();
}

export async function getTasterAssessment(id: string) {
  const res = await apiFetch(`/tasters/${id}/assessment/`);
  if (!res.ok) throw new Error("Failed to fetch assessment");
  return res.json();
}
