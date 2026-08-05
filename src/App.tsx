import { GraduationCap, Clock, Sparkles } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white flex items-center justify-center px-6">
      <div className="max-w-3xl text-center">

        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 mb-8">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-cyan-300">
            Launching Soon
          </span>
        </div>

        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-3xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
            <GraduationCap className="w-12 h-12 text-cyan-400" />
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          KLS Academy
        </h1>

        <p className="mt-6 text-xl text-slate-300 leading-relaxed">
          Learn industry-ready skills through
          <span className="text-cyan-400 font-semibold">
            {" "}Verified Virtual Internships
          </span>,
          hands-on projects, AI-powered learning,
          and career-focused training.
        </p>

        <div className="mt-8 inline-flex items-center gap-2 rounded-lg bg-slate-800 px-5 py-3 border border-slate-700">
          <Clock className="w-5 h-5 text-cyan-400" />
          <span>
            We're preparing something exciting for students and professionals.
          </span>
        </div>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <a
            href="https://klstechsolutions.in"
            className="rounded-xl bg-cyan-500 hover:bg-cyan-400 transition px-8 py-4 font-semibold text-slate-950"
          >
            Visit KLS Tech Solutions
          </a>

          <a
            href="mailto:contact@klstechsolutions.in"
            className="rounded-xl border border-slate-700 hover:border-cyan-400 transition px-8 py-4"
          >
            Contact Us
          </a>
        </div>

        <div className="mt-16 border-t border-slate-800 pt-8 text-slate-400 text-sm">
          © {new Date().getFullYear()} KLS Tech Solutions Pvt. Ltd.
          <br />
          academy.klstechsolutions.in
        </div>

      </div>
    </div>
  );
}