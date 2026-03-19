# Personal Site — Brainstorming Progress

**Date:** 2026-03-19
**Status:** Approaches proposed, awaiting decision before design phase

---

## Scope

Personal site for Ryan McGovern (tekgadgt.com):

- **Aesthetic:** Neobrutalism with whimsy, professional enough for resumes
- **Sections:** Hero/about, projects, community work, blog, contact
- **Projects to highlight:** cssdaily.dev, Conclave Chat, BuildBeat
- **Community:** Late Night Builders (runs it), Builder Programs & Online Community Lead at local AI Collective chapter
- **Contact:** Email + cal.com link (no contact form). Email uses click-to-reveal obfuscation that remains accessible to screen readers
- **Blog:** Git-backed CMS, content as markdown in repo. AI-assisted writing is a **separate future project** — CMS choice should support future extensibility for that
- **Deploy:** Netlify
- **Social:** LinkedIn, Bluesky

## Key Decisions Made

- **No Vercel** — strong preference against it
- **No contact form** — email + cal.com covers all use cases
- **Git-backed CMS required** — no hosted content APIs, no added cost
- **AI CMS plugin is a separate project** — scoped out, will be built later. BYOK model (users bring their own API key)
- **TinaCMS eliminated** — extensibility is mostly field-level, not meaningfully better than alternatives for future AI plugin work
- **Keystatic eliminated as primary option** — if going Svelte ecosystem, Sveltia CMS is more coherent (same language as CMS internals)
- **React not needed** — resume is already padded with React projects. Pick what fits best here
- **Minimal JS interactivity** — site is mostly static. CSS animations/transitions handle the visual flair. JS needs are limited to: mobile nav, click-to-reveal email, possibly theme toggle

## CMS: Sveltia CMS

Chosen for all three approaches below. Reasons:
- Git-backed (Decap CMS compatible config)
- Svelte-based editor UI — coherent if building a future AI plugin for it
- Modern UX, actively developed (1.0 expected early 2026)
- Framework-agnostic on the site side

## Approaches Under Consideration

### Approach A: Astro + Sveltia CMS (minimal JS) — RECOMMENDED

- **Framework:** Astro as static site generator, no component framework
- **Interactivity:** Vanilla JS (`<script>` tags) for the 2-3 small interactions. CSS handles all animation/visual work
- **Blog:** Astro content collections + MDX
- **Why:** Astro is purpose-built for this exact use case — content-heavy static sites with zero JS by default. Content collections and markdown pipeline are mature and batteries-included. No abstraction fighting, no unnecessary framework overhead
- **Trade-off:** Not writing Svelte on the site side, so less Svelte fluency going into the AI plugin project. Minor concern — the plugin is its own codebase anyway
- **Best for:** Simplest, fastest, most pragmatic

### Approach B: SvelteKit + Sveltia CMS (unified Svelte ecosystem)

- **Framework:** SvelteKit with `adapter-static` or `adapter-netlify`
- **Interactivity:** Svelte components where needed, CSS for the rest
- **Blog:** `mdsvex` for markdown processing
- **Why:** Entire stack is Svelte — site, CMS, and future AI plugin all in one ecosystem. No abstraction layer between you and the framework
- **Trade-off:** Loses Astro's content collections (mdsvex is good but less batteries-included). More setup for what is fundamentally a static site
- **Best for:** Long-term Svelte ecosystem investment, especially if the Sveltia AI plugin is a real priority

### Approach C: Astro + Sveltia CMS + Svelte islands (middle ground)

- **Framework:** Astro with `@astrojs/svelte` for interactive components
- **Interactivity:** Svelte islands hydrated only where needed
- **Blog:** Astro content collections + MDX
- **Why:** Astro's static strengths plus Svelte fluency for interactive bits
- **Trade-off:** Two frameworks for a site that probably doesn't need two. Adds complexity without clear payoff given minimal JS needs
- **Best for:** If more interactive components emerge than currently expected

## Open Questions

- **Approach decision** — A, B, or C?
- **Neobrutalism specifics** — exact visual direction to be explored with ChatGPT (codex-cli) during design/implementation

## What's Next

Once an approach is chosen:
1. Present detailed design (architecture, components, data flow)
2. Write design spec document
3. Spec review
4. Write implementation plan
5. Build it
