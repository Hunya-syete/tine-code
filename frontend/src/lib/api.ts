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

export interface ContactInfo {
  email: string;
  phone: string;
  linkedin: string;
  linkedin_label: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  date_range: string;
  highlights: string[];
}

export interface EducationItem {
  school: string;
  degree: string;
  date_range: string;
  notes?: string[];
}

export interface Resume {
  name: string;
  title: string;
  summary: string;
  location: string;
  contacts: ContactInfo;
  skills: string[];
  education: EducationItem[];
  certificates: string[];
  experience: ExperienceItem[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

async function parseResponse<T>(response: Response): Promise<T> {
  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message ?? "Request failed");
  }

  return body;
}

export async function fetchResume(): Promise<Resume> {
  const response = await fetch(`${API_BASE}/resume`, {
    next: { revalidate: 3600 },
  });

  const body = await parseResponse<{ data: Resume }>(response);
  return body.data;
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
