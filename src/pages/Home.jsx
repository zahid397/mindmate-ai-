/**
 * Home (/) — marketing landing page.
 * Hero with the "Your wellbeing matters" message from the mockup, value
 * props, a how-it-works strip, and the global disclaimer footer.
 */

import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { DISCLAIMER } from "../ai/suggestions";

function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-start gap-3 rounded-2xl bg-rose-50/60 p-4 text-sm text-slate-600">
          <span className="text-lg">💛</span>
          <p><span className="font-semibold text-slate-700">Disclaimer:</span> {DISCLAIMER}{" "}
            <Link to="/health-policy" className="font-semibold underline">Read our full health policy</Link>.</p>
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} MindMate AI · A student wellbeing screening tool · Not a diagnostic service
        </p>
      </div>
    </footer>
  );
}

// NOTE: copy here is deliberately careful not to overstate what a
// rule-based, non-clinical tool can claim. "Validated screening
// frameworks" was changed to "Transparent, explainable scoring" — this
// IS accurate (every point can be traced to a rule) without implying
// the kind of clinical validation this MVP does not have.
const VALUE_PROPS = [
  { icon: "🛡️", title: "Transparent scoring", text: "Every point is traceable to a clear, documented rule." },
  { icon: "✨", title: "Personalized suggestions", text: "Advice targeted to your specific weakest areas." },
  { icon: "🔒", title: "Privacy first", text: "Your data is confidential and secure." },
  { icon: "🤝", title: "Student-centric", text: "Designed to support wellbeing and growth." },
];

const STEPS = [
  { n: "1", title: "Answer 10 questions", text: "A quick, confidential check-in on how you've been feeling." },
  { n: "2", title: "Get your insights", text: "A clear wellbeing score and what it means for you." },
  { n: "3", title: "See suggestions", text: "Practical, supportive next steps tailored to you." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/50 to-white">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2">
        <div className="animate-fadeIn">
          <h1 className="text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
            Your wellbeing<br />matters.{" "}
            <span className="gradient-text">We're here for you.</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-slate-500">
            MindMate AI helps students understand their mental wellbeing through quick,
            confidential screenings and personalized support.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/demo" className="btn-primary">Try Free Demo — No Sign-up</Link>
            <Link to="/assessment" className="btn-secondary">Start Full Assessment</Link>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">🔒 100% Confidential</span>
            <span>· Takes 3–5 minutes</span>
            <span>· Rule-based &amp; explainable</span>
          </div>
        </div>

        {/* Hero card */}
        <div className="animate-scaleIn">
          <div className="card relative overflow-hidden p-8">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-100/60 blur-2xl" />
            <div className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-teal-accent/10 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-brand text-2xl">
                🧠
              </div>
              <h3 className="text-lg font-bold text-slate-900">A calmer way to check in</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                "Taking care of your mind is the first step towards a better you."
              </p>
              <div className="mt-6 space-y-3">
                {["Sleep & mood", "Stress & anxiety", "Focus & connection"].map((t) => (
                  <div key={t} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5">
                    <span className="h-2 w-2 rounded-full bg-brand-500" />
                    <span className="text-sm font-medium text-slate-600">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map((v) => (
            <div key={v.title} className="card p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-lg">
                {v.icon}
              </div>
              <h3 className="text-sm font-semibold text-slate-800">{v.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-slate-900">How it works</h2>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-slate-500">
          Three simple steps to a clearer picture of how you're doing.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="card p-6 text-center">
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full gradient-brand text-base font-bold text-white">
                {s.n}
              </div>
              <h3 className="text-base font-semibold text-slate-800">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/assessment" className="btn-primary">Start your check-in</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
