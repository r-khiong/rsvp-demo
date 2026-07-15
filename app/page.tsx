import Link from "next/link";
import { DM_Sans } from "next/font/google";

// Interim root holding page (Version A Mono Dark). Supersedes the unfinished
// RSVP-7 story landing on the recruiter-facing root until the redesign lands;
// the redesign branch overwrites this file on merge (conflict → take redesign).
// Product routes (/register, /admin/*, /status/*) stay live and untouched.
//
// The redesign's display face (DM Sans) is pulled in per-page via next/font so
// this stays a single-file change — layout.tsx / globals.css keep their Geist
// setup and every other route is unaffected.
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["500"] });

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-10 bg-[#0A0A0A] px-6 text-center text-[#FAFAF8]">
      <h1
        className={`${dmSans.className} max-w-[16ch] text-balance text-[2rem] font-medium leading-[1.1] tracking-tight sm:text-5xl md:text-6xl`}
      >
        Manage event RSVPs without the spreadsheet chaos.
      </h1>

      <Link
        href="/register"
        className="group inline-flex items-center gap-1.5 rounded-sm text-sm tracking-wide text-[#FAFAF8]/55 underline-offset-4 transition-colors hover:text-[#FAFAF8] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAFAF8]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
      >
        View the live demo
        <span
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-0.5"
        >
          &rarr;
        </span>
      </Link>
    </main>
  );
}
