export interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  category: string;
  updated_at: string;
}

export interface InventoryPayload {
  name: string;
  sku: string;
  quantity: number;
  price: number;
  category: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

async function parseResponse<T>(response: Response): Promise<T> {
  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message ?? "Request failed");
  }

  return body;
}

export async function fetchInventory(): Promise<InventoryItem[]> {
  const response = await fetch(`${API_BASE}/items`, { cache: "no-store" });
  const body = await parseResponse<{ data: InventoryItem[] }>(response);

  return body.data;
}

export async function createItem(payload: InventoryPayload): Promise<InventoryItem> {
  const response = await fetch(`${API_BASE}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await parseResponse<{ data: InventoryItem }>(response);
  return body.data;
}

export async function updateItem(id: number, payload: InventoryPayload): Promise<InventoryItem> {
  const response = await fetch(`${API_BASE}/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await parseResponse<{ data: InventoryItem }>(response);
  return body.data;
}

export async function deleteItem(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/items/${id}`, { method: "DELETE" });
  await parseResponse<{ message: string }>(response);
}
