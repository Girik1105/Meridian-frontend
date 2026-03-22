const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  // If access token expired, try refreshing
  if (res.status === 401) {
    const refreshRes = await fetch(`${API_BASE}/auth/refresh/`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      // Retry original request with new cookies
      return fetch(`${API_BASE}${path}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });
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
  return res.json();
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
  return res.json();
}

export async function logout() {
  await apiFetch("/auth/logout/", { method: "POST" });
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
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to generate career paths");
  }
  return res.json();
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
