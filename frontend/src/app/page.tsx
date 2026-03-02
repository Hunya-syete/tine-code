import { InventoryManager } from "@/components/inventory-manager";
import { fetchInventory } from "@/lib/api";

export default async function Home() {
  let error = "";
  let items = [];

  try {
    items = await fetchInventory();
  } catch {
    error = "Could not load inventory API. Ensure Laravel backend is running and NEXT_PUBLIC_API_URL is configured.";
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10">
      <header className="mb-8 rounded-2xl bg-slate-900 p-8 text-white">
        <p className="text-sm uppercase tracking-[0.25em] text-sky-200">Next.js + Tailwind + Laravel</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Inventory Management System</h1>
        <p className="mt-3 max-w-3xl text-slate-200">
          Manage products, stock quantities, and pricing with a Laravel API backend deployed separately from this Next.js frontend.
        </p>
      </header>

      {error ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-700">{error}</p>
      ) : (
        <InventoryManager initialItems={items} />
      )}
    </main>
  );
}
