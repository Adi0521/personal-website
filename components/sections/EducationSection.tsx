import { education } from "@/data/education";

// Server Component — no interactive dependencies
export function EducationSection() {
  return (
    <section id="education" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-accent-orange font-mono text-sm tracking-widest uppercase mb-4">
            Academic Background
          </p>
          <h2 className="heading-block text-5xl md:text-6xl">
            EDUCATION
          </h2>
        </div>

        <div className="p-8 md:p-12 rounded-3xl border-2 border-sand-300 bg-sand-200">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
            <div>
              <h3
                className="text-3xl font-bold text-sand-900 mb-2"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {education.institution}
              </h3>
              <div className="flex flex-wrap gap-3 mb-3">
                {education.degrees.map((deg) => (
                  <span
                    key={deg}
                    className="px-5 py-2 rounded-full text-base font-medium border-2"
                    style={{
                      borderColor: "rgba(232, 114, 12, 0.5)",
                      color: "#E8720C",
                      background: "rgba(232, 114, 12, 0.1)",
                    }}
                  >
                    {deg}
                  </span>
                ))}
              </div>
              <p className="text-sand-500 text-sm">
                {education.location} · {education.period}
              </p>
            </div>

            <div className="text-right shrink-0">
              <p
                className="text-5xl font-bold text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(135deg, #E8720C, #3B9ED9)",
                  fontFamily: "'Clash Display', sans-serif",
                }}
              >
                {education.gpa}
              </p>
              <p className="text-sand-500 text-sm mt-1">GPA</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-sand-400 text-xs uppercase tracking-widest mb-4">
                Relevant Coursework
              </p>
              <ul className="space-y-2">
                {education.coursework.map((course) => (
                  <li key={course} className="flex items-center gap-2 text-sand-700 text-sm">
                    <span className="text-accent-blue">▸</span> {course}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sand-400 text-xs uppercase tracking-widest mb-4">
                Student Organizations
              </p>
              <div className="space-y-3">
                {education.activities.map((org) => (
                  <div key={org} className="flex items-center gap-3 text-sand-700 text-sm">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: "linear-gradient(135deg, #E8720C, #3B9ED9)" }}
                    />
                    {org}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
