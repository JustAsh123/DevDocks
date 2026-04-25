import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-6 text-center">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <span className="animate-slideDown delay-0 text-[11px] uppercase tracking-[0.2em] text-[#444] font-medium mb-5 border border-[#222] px-3 py-1 rounded-full">
          Project Collaboration
        </span>

        <h1 className="animate-slideUp delay-100 text-6xl font-bold tracking-tight mb-5 shimmer-text">
          DevDocks
        </h1>

        <p className="animate-slideUp delay-200 text-[#555] text-base max-w-xs leading-relaxed mb-10">
          A clean workspace for teams to manage projects, track progress, and
          collaborate — without the noise.
        </p>

        <div className="animate-slideUp delay-300 flex items-center gap-3">
          <Link
            to="/login"
            className="btn-hover px-5 py-2.5 border border-[#2a2a2a] text-sm text-[#999] rounded-lg hover:border-[#444] hover:text-white transition-colors duration-200"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="btn-hover px-5 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-[#e8e8e8] transition-colors duration-200"
          >
            Get Started →
          </Link>
        </div>

        <p className="animate-fadeIn delay-400 text-xs text-[#2a2a2a] mt-16">
          Built for developers, by developers.
        </p>
      </div>
    </div>
  );
}
