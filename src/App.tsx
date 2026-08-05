import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BriefcaseBusiness,
  BrainCircuit,
} from "lucide-react";

export default function ComingSoon() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0ea5e920,transparent_45%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Glow */}
      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-[140px]" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-lime-400/10 blur-[160px]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6">

        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <img
            src="/logo.png"
            alt="KLS Tech Solutions"
            className="h-20 object-contain"
          />
        </div>

        {/* Badge */}
        <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-2 backdrop-blur">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-medium text-cyan-300">
            KLS Academy • Launching Soon
          </span>
        </div>

        {/* Heading */}
        <div className="mx-auto max-w-4xl text-center">

          <h1 className="text-5xl font-black leading-tight md:text-7xl">
            Learn.
            <br />

            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Build.
            </span>

            <span className="text-white"> Get Hired.</span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
            KLS Academy is building a modern learning ecosystem focused on
            <span className="font-semibold text-cyan-400">
              {" "}Verified Virtual Internships
            </span>,
            real-world projects, AI-powered learning experiences,
            and career-focused programs that prepare students for industry.
          </p>

        </div>

        {/* Features */}

        <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-3">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur transition hover:-translate-y-2 hover:border-cyan-400/40">

            <GraduationCap className="mb-5 h-10 w-10 text-cyan-400" />

            <h3 className="mb-3 text-xl font-bold">
              Verified Virtual Internships
            </h3>

            <p className="text-slate-400">
              Industry-recognized internship programs designed to build
              practical experience and strengthen your portfolio.
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur transition hover:-translate-y-2 hover:border-cyan-400/40">

            <BrainCircuit className="mb-5 h-10 w-10 text-cyan-400" />

            <h3 className="mb-3 text-xl font-bold">
              AI-Powered Learning
            </h3>

            <p className="text-slate-400">
              Learn using modern AI tools, guided projects,
              coding assistance, and interactive learning experiences.
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur transition hover:-translate-y-2 hover:border-cyan-400/40">

            <BriefcaseBusiness className="mb-5 h-10 w-10 text-cyan-400" />

            <h3 className="mb-3 text-xl font-bold">
              Career Readiness
            </h3>

            <p className="text-slate-400">
              Prepare for internships and full-time roles through
              projects, mentorship, assessments, and interview preparation.
            </p>

          </div>

        </div>

        {/* CTA */}

        <div className="mt-20 flex flex-col items-center gap-5 sm:flex-row sm:justify-center">

          <a
            href="https://klstechsolutions.in"
            className="group inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-8 py-4 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Visit KLS Tech Solutions

            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />

          </a>

          <a
            href="mailto:contact@klstechsolutions.in"
            className="rounded-2xl border border-white/10 px-8 py-4 font-medium transition hover:border-cyan-400 hover:bg-white/5"
          >
            Contact Us
          </a>

        </div>

        {/* Bottom */}

        <div className="mt-24 border-t border-white/10 pt-8 text-center">

          <div className="flex items-center justify-center gap-2 text-slate-400">

            <ShieldCheck className="h-4 w-4 text-lime-400" />

            <span>
              Powered by KLS Tech Solutions • Bengaluru, India
            </span>

          </div>

          <p className="mt-3 text-sm text-slate-500">
            © {new Date().getFullYear()} KLS Tech Solutions. All Rights Reserved.
          </p>

        </div>

      </div>
    </main>
  );
}