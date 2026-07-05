/**
 * HealthPolicy (/health-policy)
 * ─────────────────────────────────────────────────────────────────────
 * A dedicated page stating plainly what MindMate AI is and isn't, how
 * data is handled in this demo build, and where to get real help. This
 * is the canonical, most complete version of the disclaimer shown
 * (in shorter form) on the Demo result, assessment Result, and
 * Dashboard footer.
 */
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import CrisisResources from "../components/CrisisResources";

export default function HealthPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/40 to-white">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 py-14">
        <h1 className="text-3xl font-extrabold text-slate-900">Health Policy &amp; Disclaimer</h1>
        <p className="mt-3 text-base leading-relaxed text-slate-600">
          Please read this before using MindMate AI. It applies to every screening
          you take — the free demo, the full assessment, and everything shown on
          your dashboard.
        </p>

        <section className="mt-10 space-y-4">
          <PolicyItem title="This is not a diagnostic tool.">
            MindMate AI does not diagnose depression, anxiety, or any other mental
            health condition. It cannot and does not replace clinical judgment.
          </PolicyItem>
          <PolicyItem title="This is not medical advice.">
            The score, risk band, and suggestions are educational prompts for
            self-reflection — not medical or clinical recommendations.
          </PolicyItem>
          <PolicyItem title="For educational wellbeing awareness only.">
            This tool exists to help you notice patterns and build the habit of
            checking in with yourself, as part of a Media &amp; Information
            Literacy / Health &amp; Society style hackathon project.
          </PolicyItem>
          <PolicyItem title="If you feel unsafe, reach out to a real person.">
            Contact a trusted friend, family member, school counselor, or
            emergency service right away. See the support options below — they
            are always available, no matter what your score says.
          </PolicyItem>
          <PolicyItem title="Your data stays in your browser (demo version).">
            This build has no external server or database. Everything — your
            account, your answers, your history — is stored only in your
            browser's localStorage. Nothing is sent to us or to any third party.
          </PolicyItem>
          <PolicyItem title="No sensitive data is sent to external servers.">
            Because there is no backend at all in this demo, there is nothing to
            intercept in transit. The trade-off: this also means your data isn't
            backed up anywhere — clearing your browser data deletes it
            permanently, and it does not follow you to another device or browser.
          </PolicyItem>
        </section>

        <section className="mt-10">
          <CrisisResources />
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/demo" className="btn-primary">Try the free demo</Link>
          <Link to="/about" className="btn-secondary">Learn how the AI works</Link>
        </div>
      </div>
    </div>
  );
}

function PolicyItem({ title, children }) {
  return (
    <div className="card p-5">
      <h2 className="text-sm font-bold text-slate-800">{title}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{children}</p>
    </div>
  );
}
