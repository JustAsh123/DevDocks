import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-2">
        <span className="text-xs uppercase tracking-widest text-[#555] font-medium">
          Project Collaboration
        </span>
      </div>

      <h1 className="text-5xl font-bold text-white mt-3 mb-4 tracking-tight">
        DevDocks
      </h1>

      <p className="text-[#666] text-base max-w-sm leading-relaxed mb-10">
        A clean workspace for teams to manage projects, track progress, and
        collaborate — without the noise.
      </p>

      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="px-5 py-2.5 border border-[#2a2a2a] text-sm text-[#ccc] rounded-lg hover:border-[#444] hover:text-white transition-colors"
        >
          Log In
        </Link>
        <Link
          to="/signup"
          className="px-5 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-[#e0e0e0] transition-colors"
        >
          Sign Up
        </Link>
      </div>

      <p className="text-xs text-[#333] mt-16">Built for developers, by developers.</p>
    </div>
  );
}
