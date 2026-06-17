export const API_BASE = "/api";

async function asJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body?.detail || detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  return asJson<T>(res);
}

export async function postJson<TResp, TBody = unknown>(
  path: string,
  body: TBody
): Promise<TResp> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return asJson<TResp>(res);
}

export async function putJson<TResp, TBody = unknown>(
  path: string,
  body: TBody
): Promise<TResp> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return asJson<TResp>(res);
}

export async function postFormData<TResp>(
  path: string,
  form: FormData
): Promise<TResp> {
  const res = await fetch(`${API_BASE}${path}`, { method: "POST", body: form });
  return asJson<TResp>(res);
}

export async function pingBackend(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}
