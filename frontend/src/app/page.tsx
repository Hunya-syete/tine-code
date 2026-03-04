import { fetchResume } from "@/lib/api";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="border-b border-slate-300 pb-1 text-lg font-extrabold uppercase text-sky-600">{children}</h2>;
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
    <main className="mx-auto min-h-screen max-w-5xl bg-white px-5 py-8 text-slate-900">
      {error ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-700">{error}</p>
      ) : (
        resume && (
          <article className="space-y-5">
            <header className="text-center">
              <h1 className="text-5xl font-black tracking-tight">{resume.name}</h1>
              <p className="mt-2 text-xl font-semibold">{resume.title}</p>
              <p className="mx-auto mt-2 max-w-4xl text-base">{resume.summary}</p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm">
                <a className="text-sky-700 hover:underline" href={`mailto:${resume.contacts.email}`}>
                  {resume.contacts.email}
                </a>
                <a className="text-sky-700 hover:underline" href={`tel:${resume.contacts.phone}`}>
                  {resume.contacts.phone}
                </a>
                <span>{resume.location}</span>
                <a className="text-sky-700 hover:underline" href={resume.contacts.linkedin} target="_blank" rel="noreferrer">
                  {resume.contacts.linkedin_label}
                </a>
              </div>
            </header>

            <section className="space-y-3">
              <SectionTitle>Work Experience</SectionTitle>
              {resume.experience.map((job) => (
                <div key={`${job.company}-${job.date_range}`}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-extrabold uppercase">{job.company}</h3>
                      <p className="text-lg font-semibold">{job.role}</p>
                    </div>
                    <p className="text-lg font-semibold">{job.date_range}</p>
                  </div>
                  {job.highlights.length > 0 ? (
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-base">
                      {job.highlights.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </section>

            <section className="space-y-2">
              <SectionTitle>Education</SectionTitle>
              {resume.education.map((item) => (
                <div key={`${item.school}-${item.date_range}`}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-extrabold uppercase">{item.school}</h3>
                      {item.degree ? <p className="text-lg">{item.degree}</p> : null}
                    </div>
                    <p className="text-lg font-semibold">{item.date_range}</p>
                  </div>
                  {item.notes?.length ? (
                    <ul className="list-disc pl-5 text-base">
                      {item.notes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </section>

            <section className="space-y-2">
              <SectionTitle>Skills</SectionTitle>
              <ul className="list-disc space-y-1 pl-5 text-base">
                {resume.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </section>

            <section className="space-y-2">
              <SectionTitle>Certificate</SectionTitle>
              <ul className="list-disc space-y-1 pl-5 text-base">
                {resume.certificates.map((certificate) => (
                  <li key={certificate}>{certificate}</li>
                ))}
              </ul>
            </section>
          </article>
        )
      )}
    </main>
  );
}
