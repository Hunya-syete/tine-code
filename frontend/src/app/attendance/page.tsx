import Link from "next/link";

import { AttendanceQr } from "@/components/attendance-qr";

export default function AttendancePage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10">
      <header className="mb-8">
        <p className="text-sm uppercase tracking-wide text-indigo-600">Classroom Portal</p>
        <h1 className="text-3xl font-bold">QR Attendance Web App</h1>
        <p className="mt-2 text-slate-600">
          Students scan a rotating QR code to check in. Each QR expires every 10 minutes.
        </p>
        <Link href="/" className="mt-4 inline-flex text-sm font-medium text-indigo-700 hover:underline">
          ← Back to Quiz App
        </Link>
      </header>

      <AttendanceQr />
    </main>
  );
}
