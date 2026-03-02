"use client";

import { useMemo, useState } from "react";
import { createItem, deleteItem, InventoryItem, InventoryPayload, updateItem } from "@/lib/api";

interface Props {
  initialItems: InventoryItem[];
}

const EMPTY_FORM: InventoryPayload = {
  name: "",
  sku: "",
  quantity: 0,
  price: 0,
  category: "General",
};

export function InventoryManager({ initialItems }: Props) {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [form, setForm] = useState<InventoryPayload>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [pending, setPending] = useState(false);

  const totalValue = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  function onChange<K extends keyof InventoryPayload>(key: K, value: InventoryPayload[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function startEdit(item: InventoryItem) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      price: item.price,
      category: item.category,
    });
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      if (editingId === null) {
        const created = await createItem(form);
        setItems((current) => [created, ...current]);
      } else {
        const updated = await updateItem(editingId, form);
        setItems((current) => current.map((item) => (item.id === editingId ? updated : item)));
      }

      resetForm();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save item.");
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(id: number) {
    setPending(true);
    setError("");

    try {
      await deleteItem(id);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete item.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-500">Total SKUs</p>
          <p className="text-3xl font-black text-slate-900">{items.length}</p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-500">Inventory value</p>
          <p className="text-3xl font-black text-emerald-700">${totalValue.toFixed(2)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-5">
        <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Item name" value={form.name} onChange={(e) => onChange("name", e.target.value)} />
        <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="SKU" value={form.sku} onChange={(e) => onChange("sku", e.target.value)} />
        <input className="rounded-lg border border-slate-300 px-3 py-2" type="number" min={0} placeholder="Qty" value={form.quantity} onChange={(e) => onChange("quantity", Number(e.target.value))} />
        <input className="rounded-lg border border-slate-300 px-3 py-2" type="number" min={0} step="0.01" placeholder="Price" value={form.price} onChange={(e) => onChange("price", Number(e.target.value))} />
        <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Category" value={form.category} onChange={(e) => onChange("category", e.target.value)} />

        <div className="md:col-span-5 flex flex-wrap gap-2">
          <button disabled={pending} className="rounded-lg bg-sky-700 px-4 py-2 font-semibold text-white disabled:opacity-60" type="submit">
            {editingId === null ? "Add item" : "Update item"}
          </button>
          {editingId !== null && (
            <button type="button" className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700" onClick={resetForm}>
              Cancel edit
            </button>
          )}
        </div>

        {error ? <p className="md:col-span-5 text-sm font-medium text-rose-700">{error}</p> : null}
      </form>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 font-semibold text-slate-900">{item.name}</td>
                <td className="px-4 py-3 text-slate-700">{item.sku}</td>
                <td className="px-4 py-3 text-slate-700">{item.category}</td>
                <td className="px-4 py-3 text-slate-700">{item.quantity}</td>
                <td className="px-4 py-3 text-slate-700">${item.price.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(item)} className="rounded bg-amber-100 px-2 py-1 text-amber-800">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="rounded bg-rose-100 px-2 py-1 text-rose-700">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
