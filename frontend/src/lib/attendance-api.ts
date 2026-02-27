const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

export interface AuthSession {
  token: string;
  username: string;
  role: string;
  expires_at: string;
}

export interface QrIssueResponse {
  token: string;
  payload: {
    class_code: string;
    issued_at: string;
    expires_at: string;
    nonce: string;
  };
}

export interface AttendanceLog {
  student_name: string;
  student_id: string;
  status: "Present" | "Late";
  class_code: string;
  scanned_at: string;
  qr_expires_at: string;
}

export async function login(username: string, password: string): Promise<AuthSession> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
}

export async function fetchQr(token: string): Promise<QrIssueResponse> {
  const response = await fetch(`${API_BASE}/attendance/qr`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to issue QR token");
  }

  return response.json();
}

export async function scanAttendance(input: {
  student_name: string;
  student_id: string;
  qr_token: string;
}): Promise<AttendanceLog> {
  const response = await fetch(`${API_BASE}/attendance/scan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? "Failed to mark attendance");
  }

  const body = (await response.json()) as { data: AttendanceLog };
  return body.data;
}

export async function fetchLogs(token: string): Promise<AttendanceLog[]> {
  const response = await fetch(`${API_BASE}/attendance/logs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load audit logs");
  }

  const body = (await response.json()) as { data: AttendanceLog[] };
  return body.data;
}
