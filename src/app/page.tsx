import Link from "next/link";

const games = [
  {
    title: "Jade Compass: Relic Expedition",
    slug: "relic-expedition",
    href: "/relic-expedition",
    status: "Playable now",
    kicker: "Treasure Hunt",
    description:
      "Enter a pixel-art jungle expedition, tune the AI storyteller, and survive branching choices to claim the Jade Compass.",
    accent: "bg-[var(--primary)]",
    cta: "Start expedition",
  },
  {
    title: "Jade Compass: Astral Codex",
    slug: "astral-codex",
    href: "/astral-codex",
    status: "Concept stage",
    kicker: "Starlit Mystery",
    description:
      "A planned companion adventure about lost star charts, celestial relics, and choices written between ancient constellations.",
    accent: "bg-[var(--accent)]",
    cta: "View concept",
  },
] as const;

export default function Home() {
  return (
    <main className="theme-jade-home min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_top_left,var(--page-glow-primary),transparent_34rem),radial-gradient(circle_at_bottom_right,var(--page-glow-secondary),transparent_30rem),linear-gradient(135deg,var(--background),var(--muted))] px-4 py-8 text-[var(--foreground)] sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="pixel-border-lg pixel-shadow bg-[var(--card)] p-5 sm:p-8">
          <p className="font-pixel text-xs uppercase tracking-[0.24em] text-[var(--primary)]">
            Jade Compass
          </p>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <h1 className="font-pixel text-3xl leading-tight sm:text-5xl">
                Choose your relic path.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">
                Choose a Jade Compass adventure: jump into the current treasure
                hunt or peek at the next cosmic chapter while it is still
                forming.
              </p>
            </div>
            <div className="pixel-border-sm bg-[var(--background)] p-4 text-sm leading-6">
              <p className="font-pixel text-xs text-[var(--accent)]">
                Current map
              </p>
              <p className="mt-3">
                2 destinations, 1 playable expedition, 1 early concept in the
                codex.
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-2">
          {games.map((game) => (
            <Link
              key={game.slug}
              href={game.href}
              aria-label={`${game.cta}: ${game.title}`}
              className="group pixel-border pixel-shadow flex min-h-80 flex-col justify-between bg-[var(--card)] p-5 text-[var(--card-foreground)] transition duration-200 hover:-translate-y-1 hover:bg-[var(--card)]/95 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--ring)] active:translate-x-1 active:translate-y-1 active:shadow-none sm:p-6"
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`h-5 w-5 pixel-border-sm ${game.accent}`}
                    aria-hidden="true"
                  />
                  <span className="font-pixel text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    {game.kicker}
                  </span>
                </div>
                <h2 className="mt-6 font-pixel text-2xl leading-tight sm:text-3xl">
                  {game.title}
                </h2>
                <p className="mt-4 text-base leading-7 text-[var(--muted-foreground)]">
                  {game.description}
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="pixel-border-sm bg-[var(--background)] px-3 py-2 text-sm">
                  {game.status}
                </span>
                <span className="font-pixel text-sm text-[var(--primary)] transition group-hover:text-[var(--accent)]">
                  {game.cta}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
