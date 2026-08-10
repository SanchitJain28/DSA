# TraceDSA — Tailwind theme & markup

Design tokens and copy-paste layout for the React Router v7 site. Fonts: **Geist** (UI/body) + **Geist Mono** (labels, code, metadata).

## 1. Fonts

`app/root.tsx` `<head>`:

```tsx
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
<link
  href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap"
  rel="stylesheet"
/>
```

## 2. Theme — Tailwind v4 (`app/tailwind.css`)

```css
@import "tailwindcss";

@theme {
  /* neutral zinc surfaces */
  --color-ink: #18181b;        /* primary text */
  --color-muted: #71717a;      /* secondary text */
  --color-subtle: #a1a1aa;     /* meta / mono labels */
  --color-panel: #f4f4f5;      /* filled chips, table head */
  --color-surface: #ffffff;
  --color-canvas: #fafafa;     /* app / diagram backgrounds */
  --color-line: #e4e4e7;       /* 1px borders */
  --color-line-strong: #d4d4d8;

  /* single signal color */
  --color-accent: #11766E;
  --color-accent-hover: #0e5f59;

  /* difficulty (muted, readable) */
  --color-easy: #0f766e;    --color-easy-bg: #ecfdf5;    --color-easy-line: #a7f3d0;
  --color-medium: #b45309;  --color-medium-bg: #fffbeb;  --color-medium-line: #fde68a;
  --color-hard: #b91c1c;    --color-hard-bg: #fef2f2;    --color-hard-line: #fecaca;

  --font-sans: "Geist", system-ui, sans-serif;
  --font-mono: "Geist Mono", monospace;

  --radius-sm: 0px;
  --radius: 0px;
  --radius-lg: 0px;

  /* crisp, low-blur shadows only */
  --shadow-crisp: 0 1px 2px rgb(24 24 27 / 0.05);
  --shadow-raised: 0 1px 3px rgb(24 24 27 / 0.06);
  --shadow-btn: 0 1px 2px rgb(24 24 27 / 0.16);
}

body { @apply bg-canvas text-ink font-sans antialiased; }
a { @apply text-accent hover:text-accent-hover no-underline; }
```

> Tailwind v3 equivalent: put the same values under `theme.extend.colors` / `fontFamily` / `borderRadius` / `boxShadow` in `tailwind.config.ts` (drop the `--color-` prefix, e.g. `colors: { ink: "#18181b", ... }`).

Design rules baked in: **1px solid borders** (`border border-line`), **square corners (radius 0)** — sharp, brutalist-lite, **shadows are crisp/low-blur only** — never large blurred glows.

## 3. Core layout component (`app/components/Shell.tsx`)

```tsx
import { Link, Outlet } from "react-router";

export function Shell() {
  const nav = ["Algorithms", "Guides", "Complexity", "Docs"];
  return (
    <div className="min-h-screen bg-surface">
      <header className="flex h-16 items-center justify-between border-b border-line px-7">
        <div className="flex items-center gap-9">
          <Link to="/" className="flex items-center gap-2.5 text-ink">
            <span className="grid h-[22px] w-[22px] place-items-center rounded-[5px] bg-ink">
              <span className="h-2 w-2 rounded-[2px] bg-accent" />
            </span>
            <span className="text-base font-semibold tracking-[-0.02em]">TraceDSA</span>
          </Link>
          <nav className="flex gap-6.5">
            {nav.map((n, i) => (
              <Link key={n} to="#" className={i === 0 ? "text-sm font-medium text-ink" : "text-sm font-medium text-muted hover:text-ink"}>
                {n}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 items-center gap-2 rounded border border-line px-3 font-mono text-[13px] text-muted">★ 12.4k</span>
          <Link to="/app" className="inline-flex h-9 items-center rounded border border-accent bg-accent px-4 text-[13px] font-semibold text-white shadow-btn hover:bg-accent-hover">
            Launch App
          </Link>
        </div>
      </header>
      <main><Outlet /></main>
    </div>
  );
}
```

## 4. Reusable difficulty badge

```tsx
const DIFF = {
  easy:   "text-easy bg-easy-bg border-easy-line",
  medium: "text-medium bg-medium-bg border-medium-line",
  hard:   "text-hard bg-hard-bg border-hard-line",
} as const;

export function Difficulty({ level }: { level: keyof typeof DIFF }) {
  return (
    <span className={`rounded-[5px] border px-2.5 py-1 font-mono text-[11px] font-semibold uppercase ${DIFF[level]}`}>
      {level}
    </span>
  );
}

// topic tag
export const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-[5px] border border-line bg-panel px-2.5 py-1 font-mono text-[11px] font-medium text-muted">{children}</span>
);
```

## 5. Dynamic SEO article page (`app/routes/algorithms.$slug.tsx`)

```tsx
import type { Route } from "./+types/algorithms.$slug";
import { Difficulty, Tag } from "~/components/Difficulty";

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: `${data.title} — TraceDSA` },
    { name: "description", content: data.summary },
    { tagName: "link", rel: "canonical", href: `https://tracedsa.com/algorithms/${data.slug}` },
    // JSON-LD (TechArticle) for rich results
    { "script:ld+json": {
        "@context": "https://schema.org", "@type": "TechArticle",
        headline: data.title, description: data.summary, dateModified: data.updated,
    }},
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  return getAlgorithm(params.slug); // { slug, title, summary, level, tags, updated, ... }
}

export default function Article({ loaderData: a }: Route.ComponentProps) {
  return (
    <div className="grid grid-cols-[1fr_280px]">
      <article className="min-w-0 border-r border-line px-14 py-12">
        <nav className="mb-6 font-mono text-xs text-subtle">Algorithms / Graphs / <span className="text-muted">{a.title}</span></nav>

        <div className="mb-5 flex flex-wrap items-center gap-2">
          <Difficulty level={a.level} />
          {a.tags.map((t) => <Tag key={t}>{t}</Tag>)}
        </div>

        <h1 className="mb-4 text-[44px] font-semibold leading-[1.08] tracking-[-0.03em] text-ink">{a.title}</h1>
        <p className="mb-6 text-[19px] leading-relaxed text-muted">{a.summary}</p>

        {/* meta + prominent CTA */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line py-4">
          <div className="flex gap-5 font-mono text-xs text-subtle">
            <span>{a.readMin} MIN READ</span><span>UPDATED {a.updated}</span><span>{a.complexity}</span>
          </div>
          <a href={`/app?algo=${a.slug}`}
             className="inline-flex h-11 items-center gap-2 rounded border border-accent bg-accent px-5 text-sm font-semibold text-white shadow-btn hover:bg-accent-hover">
            ▶ Launch Visualizer
          </a>
        </div>

        {/* body: render your MDX / prose here */}
        <div className="prose-tracedsa max-w-[64ch]">{/* ... */}</div>
      </article>

      <aside className="bg-canvas px-6 py-12">
        <div className="sticky top-6 flex flex-col gap-7">{/* TOC + related */}</div>
      </aside>
    </div>
  );
}
```

Everything above matches the rendered `TraceDSA.dc.html` artboards 1:1 — same tokens, same spacing, same components.
