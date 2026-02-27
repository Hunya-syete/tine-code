"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { fetchLogs, fetchQr, login, scanAttendance, type AttendanceLog } from "@/lib/attendance-api";

function formatCountdown(targetDate: string): string {
  const distanceMs = new Date(targetDate).getTime() - Date.now();
  if (distanceMs <= 0) {
    return "00:00";
  }

  const totalSeconds = Math.floor(distanceMs / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export function AttendanceQr() {
  const [username, setUsername] = useState("teacher");
  const [password, setPassword] = useState("teacher123");
  const [teacherToken, setTeacherToken] = useState<string | null>(null);
  const [qrToken, setQrToken] = useState("");
  const [qrExpiresAt, setQrExpiresAt] = useState("");
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [scanMessage, setScanMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!teacherToken) {
      return;
    }

    let mounted = true;

    const refreshData = async () => {
      try {
        const [qr, liveLogs] = await Promise.all([fetchQr(teacherToken), fetchLogs(teacherToken)]);

        if (!mounted) {
          return;
        }

        setQrToken(qr.token);
        setQrExpiresAt(qr.payload.expires_at);
        setLogs(liveLogs);
      } catch (error) {
        if (mounted) {
          setErrorMessage(error instanceof Error ? error.message : "Unable to refresh live attendance data.");
        }
      }
    };

    refreshData();
    const interval = setInterval(refreshData, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [teacherToken]);

  const qrImageUrl = useMemo(() => {
    if (!qrToken) {
      return "";
    }

    const encoded = encodeURIComponent(qrToken);
    return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encoded}`;
  }, [qrToken]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    try {
      const session = await login(username, password);
      setTeacherToken(session.token);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to login");
    }
  }

  async function handleScan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!qrToken) {
      setErrorMessage("No active QR token yet. Teacher must login first.");
      return;
    }

    setErrorMessage("");
    setScanMessage("");

    try {
      const result = await scanAttendance({
        student_name: studentName,
        student_id: studentId,
        qr_token: qrToken,
      });

      setScanMessage(`Attendance saved: ${result.student_name} is ${result.status}.`);
      setStudentName("");
      setStudentId("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Scan failed.");
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Teacher Console</h2>
        <p className="mt-2 text-sm text-slate-600">Secure token login + rotating tokenized QR generation.</p>

        {!teacherToken ? (
          <form onSubmit={handleLogin} className="mt-4 grid gap-3">
            <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Username" />
            <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" />
            <button type="submit" className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500">Login & Start Session</button>
          </form>
        ) : (
          <div className="mt-4 space-y-3">
            {qrImageUrl ? <img src={qrImageUrl} alt="Tokenized attendance QR" className="mx-auto h-64 w-64 rounded-xl border border-slate-200 bg-slate-50 p-3" /> : null}
            <div className="rounded-lg bg-indigo-50 p-3 text-xs text-indigo-900">
              <p><span className="font-semibold">Token expires:</span> {qrExpiresAt ? new Date(qrExpiresAt).toLocaleTimeString() : "..."}</p>
              <p><span className="font-semibold">Countdown:</span> {qrExpiresAt ? formatCountdown(qrExpiresAt) : "00:00"}</p>
              <p><span className="font-semibold">Live tick:</span> {tick}</p>
            </div>
          </div>
        )}
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Student Check-In</h2>
        <p className="mt-2 text-sm text-slate-600">Server-side validation applies Present/Late status automatically.</p>

        <form onSubmit={handleScan} className="mt-4 grid gap-3">
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={studentName} onChange={(event) => setStudentName(event.target.value)} placeholder="Student name" required />
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={studentId} onChange={(event) => setStudentId(event.target.value)} placeholder="Student ID" required />
          <button type="submit" className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500">Submit Attendance</button>
        </form>

        {scanMessage ? <p className="mt-3 rounded-lg bg-emerald-50 p-2 text-sm text-emerald-800">{scanMessage}</p> : null}
        {errorMessage ? <p className="mt-3 rounded-lg bg-rose-50 p-2 text-sm text-rose-800">{errorMessage}</p> : null}
      </article>

      <article className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Real-Time Audit Logs</h2>
        <p className="mt-2 text-sm text-slate-600">Polling every 5 seconds simulates real-time listeners from your dashboard.</p>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-3 py-2">Student</th>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Scanned</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-center text-slate-500">No attendance records yet.</td>
                </tr>
              ) : (
                logs.map((item) => (
                  <tr key={`${item.student_id}-${item.scanned_at}`} className="border-b border-slate-100">
                    <td className="px-3 py-2">{item.student_name}</td>
                    <td className="px-3 py-2">{item.student_id}</td>
                    <td className="px-3 py-2 font-semibold text-indigo-700">{item.status}</td>
                    <td className="px-3 py-2">{new Date(item.scanned_at).toLocaleTimeString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
