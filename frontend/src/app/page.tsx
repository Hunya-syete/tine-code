import { fetchResume } from "@/lib/api";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-bold uppercase tracking-wider text-sky-700">{children}</h2>;
}

export default async function Home() {
  let error = "";
  let resume = null;

  try {
    resume = await fetchResume();
  } catch {
    error = "Could not connect to the Laravel API. Make sure backend is running and NEXT_PUBLIC_API_URL is set correctly.";
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10">
      {error ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-700">{error}</p>
      ) : (
        resume && (
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <header className="border-b border-slate-200 bg-slate-50 p-8 text-center">
              <h1 className="text-4xl font-black tracking-tight">{resume.name}</h1>
              <p className="mt-2 text-lg font-semibold text-slate-700">{resume.title}</p>
              <p className="mx-auto mt-4 max-w-3xl text-slate-600">{resume.summary}</p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-700">
                <a className="font-semibold text-sky-700 hover:underline" href={`mailto:${resume.contacts.email}`}>
                  {resume.contacts.email}
                </a>
                <a className="font-semibold text-sky-700 hover:underline" href={`tel:${resume.contacts.phone}`}>
                  {resume.contacts.phone}
                </a>
                <span>{resume.location}</span>
                <a className="font-semibold text-sky-700 hover:underline" href={resume.contacts.linkedin} target="_blank" rel="noreferrer">
                  {resume.contacts.linkedin_label}
                </a>
              </div>
            </header>

            <div className="space-y-10 p-8">
              <section className="space-y-4">
                <SectionTitle>Work Experience</SectionTitle>
                {resume.experience.map((job) => (
                  <div key={`${job.company}-${job.date_range}`} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold">{job.company}</h3>
                        <p className="font-medium text-slate-700">{job.role}</p>
                      </div>
                      <p className="font-semibold text-slate-600">{job.date_range}</p>
                    </div>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
                      {job.highlights.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>

              <div className="grid gap-10 md:grid-cols-2">
                <section className="space-y-4">
                  <SectionTitle>Education</SectionTitle>
                  <div className="space-y-3">
                    {resume.education.map((item) => (
                      <div key={`${item.school}-${item.date_range}`} className="rounded-lg border border-slate-200 p-4">
                        <h3 className="font-bold uppercase">{item.school}</h3>
                        <p className="text-slate-700">{item.degree}</p>
                        <p className="font-semibold text-slate-600">{item.date_range}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <SectionTitle>Skills</SectionTitle>
                  <ul className="list-disc space-y-2 pl-5 text-slate-700">
                    {resume.skills.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </section>
              </div>

              <section className="space-y-4">
                <SectionTitle>Certificates</SectionTitle>
                <ul className="grid list-disc gap-2 pl-5 text-slate-700 md:grid-cols-2">
                  {resume.certificates.map((certificate) => (
                    <li key={certificate}>{certificate}</li>
                  ))}
                </ul>
              </section>
            </div>
          </article>
        )
      )}
    </main>
  );
}
