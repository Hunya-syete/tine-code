"use client";

import { useEffect, useMemo, useState } from "react";

const ROTATION_MS = 10 * 60 * 1000;

function getWindowIndex(now: number): number {
  return Math.floor(now / ROTATION_MS);
}

function getTimeLeft(now: number): number {
  return ROTATION_MS - (now % ROTATION_MS);
}

function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function AttendanceQr() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const windowIndex = getWindowIndex(now);
  const validUntil = new Date((windowIndex + 1) * ROTATION_MS);

  const qrPayload = useMemo(
    () =>
      JSON.stringify({
        type: "attendance",
        classCode: "CS-101",
        windowIndex,
        issuedAt: new Date(windowIndex * ROTATION_MS).toISOString(),
        validUntil: validUntil.toISOString(),
      }),
    [validUntil, windowIndex],
  );

  const qrImageUrl = useMemo(() => {
    const encoded = encodeURIComponent(qrPayload);
    return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encoded}`;
  }, [qrPayload]);

  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-wide text-indigo-600">Attendance Check-In</p>
        <h2 className="text-2xl font-bold text-slate-900">Scan QR to mark attendance</h2>
        <p className="mt-2 text-sm text-slate-600">
          This QR refreshes automatically every 10 minutes.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <img
          src={qrImageUrl}
          alt="Dynamic attendance QR code"
          className="mx-auto h-72 w-72 rounded-lg border border-white bg-white p-2 shadow"
        />
      </div>

      <div className="mt-6 grid gap-2 rounded-lg bg-indigo-50 p-4 text-sm text-indigo-900">
        <p>
          <span className="font-semibold">Class:</span> CS-101
        </p>
        <p>
          <span className="font-semibold">Valid until:</span> {validUntil.toLocaleTimeString()}
        </p>
        <p>
          <span className="font-semibold">Next QR in:</span> {formatTime(getTimeLeft(now))}
        </p>
      </div>
    </section>
  );
}
