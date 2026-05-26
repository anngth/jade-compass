import Link from "next/link";

const conceptPillars = [
  "Decode star maps from vanished sky temples",
  "Choose between scholar, navigator, and relic-bonded paths",
  "Uncover how the Jade Compass reacts to celestial artifacts",
] as const;

export default function AstralCodexPage() {
  return (
    <main className="theme-astral-codex min-h-dvh bg-[radial-gradient(circle_at_top_right,var(--page-glow-primary),transparent_30rem),radial-gradient(circle_at_bottom_left,var(--page-glow-secondary),transparent_28rem),linear-gradient(180deg,var(--background),var(--muted))] px-4 py-8 text-[var(--foreground)] sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Link
          href="/"
          className="font-pixel w-fit text-sm text-[var(--primary)] underline-offset-4 hover:text-[var(--accent)] hover:underline focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--ring)]"
        >
          Back to Jade Compass
        </Link>

        <div className="pixel-border-lg pixel-shadow bg-[var(--card)] p-5 sm:p-8">
          <p className="font-pixel text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
            Concept Codex
          </p>
          <h1 className="mt-5 font-pixel text-3xl leading-tight sm:text-5xl">
            Jade Compass: Astral Codex
          </h1>
          <p className="mt-5 text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">
            This second game is still in the idea phase. For now, this page
            marks the destination and gives the concept a home before the game
            loop, story rules, and UI are designed.
          </p>
        </div>

        <div className="pixel-border pixel-shadow bg-[var(--card)] p-5 sm:p-6">
          <h2 className="font-pixel text-xl">Early direction</h2>
          <ul className="mt-5 grid gap-4 text-base leading-7 text-[var(--muted-foreground)]">
            {conceptPillars.map((pillar) => (
              <li key={pillar} className="flex gap-3">
                <span
                  className="mt-2 h-3 w-3 shrink-0 bg-[var(--primary)]"
                  aria-hidden="true"
                />
                <span>{pillar}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/relic-expedition"
            className="font-pixel pixel-border-sm pixel-shadow inline-flex min-h-12 items-center justify-center bg-[var(--primary)] px-5 py-3 text-sm text-[var(--primary-foreground)] transition duration-200 hover:bg-[var(--primary)]/90 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--ring)] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            Play Relic Expedition
          </Link>
          <Link
            href="/"
            className="font-pixel pixel-border-sm inline-flex min-h-12 items-center justify-center px-5 py-3 text-sm transition duration-200 hover:bg-[var(--accent)]/20 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--ring)]"
          >
            Return to Jade Compass
          </Link>
        </div>
      </section>
    </main>
  );
}
