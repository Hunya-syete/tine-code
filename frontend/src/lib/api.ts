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

export async function fetchResume(): Promise<Resume> {
  const response = await fetch(`${API_BASE}/resume`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error("Unable to load resume data");
  }

  const body = await response.json();
  return body.data;
}
