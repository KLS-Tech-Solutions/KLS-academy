import { GraduationCap, Clock, Sparkles } from "lucide-react";

export const metadata = { title: "Launching soon" };

export default function ComingSoonPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 text-white">
      <div className="max-w-3xl text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span className="text-sm text-cyan-300">Launching Soon</span>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-cyan-500/30 bg-cyan-500/10">
            <GraduationCap className="h-12 w-12 text-cyan-400" />
          </div>
        </div>

        <h1 className="text-5xl font-bold leading-tight text-white md:text-6xl">
          KLS Academy
        </h1>

        <p className="mt-6 text-xl leading-relaxed text-slate-300">
          Learn industry-ready skills through
          <span className="font-semibold text-cyan-400">
            {" "}
            Verified Virtual Internships
          </span>
          , hands-on projects, AI-powered learning, and career-focused training.
        </p>

        <div className="mt-8 inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-5 py-3">
          <Clock className="h-5 w-5 text-cyan-400" />
          <span>
            We&apos;re preparing something exciting for students and professionals.
          </span>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="https://klstechsolutions.in"
            className="rounded-xl bg-cyan-500 px-8 py-4 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Visit KLS Tech Solutions
          </a>
          <a
            href="mailto:klstechsolutions2025@gmail.com"
            className="rounded-xl border border-slate-700 px-8 py-4 transition hover:border-cyan-400"
          >
            Contact Us
          </a>
        </div>

        <div className="mt-16 border-t border-slate-800 pt-8 text-sm text-slate-400">
          © {new Date().getFullYear()} KLS Tech Solutions
          <br />
          academy.klstechsolutions.in
        </div>
      </div>
    </div>
  );
}
