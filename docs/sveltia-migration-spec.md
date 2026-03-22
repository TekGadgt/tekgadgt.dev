# Sveltia CMS Migration Spec

## Overview

Migration from Keystatic CMS to Sveltia CMS. Sveltia is a drop-in Decap/Netlify CMS replacement that runs as a standalone SPA — no framework integration or React dependency required. It reads/writes content as flat files via the GitHub API.

## Current Keystatic Integration Summary

### Packages
- `@keystatic/astro` (^5.0.6) — Astro integration, mounts admin UI at `/keystatic`
- `@keystatic/core` (^0.5.48) — Schema definitions and reader API
- `@astrojs/react` (^5.0.1) — Required by Keystatic admin UI
- `react` / `react-dom` (^19.2.4) — Required by Keystatic admin UI

### Configuration
- `keystatic.config.ts` — 274 lines, defines 9 singletons + 1 collection
- Storage: local (dev), GitHub `TekGadgt/tekgadgt.dev` (prod)

### Content Schema

**Singletons (9):**

| Singleton | Path | Format | Key Fields |
|-----------|------|--------|------------|
| homepage | src/content/homepage | JSON | heroHeading, tagline, bioText, CTAs, heroImage, metaDescription |
| about | src/content/about | Markdoc | metaDescription, content (markdoc) |
| appearances | src/content/appearances | JSON | items[] — type (select), title, outlet, date, url, featured |
| projects | src/content/projects | JSON | items[] — name, description, url, techTags[], image, featured |
| community | src/content/community | JSON | items[] — orgName, role, description, url, status (select), featured |
| experience | src/content/experience | JSON | items[] — company, role, dates, location, type, summary, impact[], tech[], url, featured |
| now | src/content/now | Markdoc | content (markdoc) |
| uses | src/content/uses | JSON | categories[] → items[] — name, description, url |
| footer | src/content/footer | JSON | email, calUrl, socialLinks[] |
| buttonWall | src/content/buttonWall | JSON | buttons[] — label, image (88x31), url, group (select), active |

**Collections (1):**

| Collection | Path | Format | Key Fields |
|------------|------|--------|------------|
| posts | src/content/posts/*/ | Markdoc | title (slug), description, date, tags[], draft, image, content (markdoc) |

### Reader API (`src/lib/reader.ts`)
```typescript
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';
export const reader = createReader(process.cwd(), keystaticConfig);
```

### Files Using Reader (15 files)

**Pages (8):**
- `src/pages/index.astro` — `reader.singletons.homepage.read()`
- `src/pages/about.astro` — `reader.singletons.about.read()` + `.content()` for markdoc
- `src/pages/now.astro` — `reader.singletons.now.read()` + `.content()` for markdoc
- `src/pages/uses.astro` — `reader.singletons.uses.read()`
- `src/pages/work.astro` — `reader.singletons.projects.read()` + `community.read()`
- `src/pages/blog/index.astro` — `reader.collections.posts.all()` (filters drafts in prod)
- `src/pages/blog/[...slug].astro` — `reader.collections.posts.all()` (getStaticPaths) + `.read(slug)` + `.content()` for markdoc
- `src/pages/rss.xml.ts` — `reader.collections.posts.all()`

**Components (7):**
- `src/components/home/Hero.astro` — `reader.singletons.homepage.read()`
- `src/components/home/CredibilityStrip.astro` — `Promise.all()` reading projects, community, appearances
- `src/components/work/ExperienceSection.astro` — `reader.singletons.experience.read()`
- `src/components/about/AppearancesList.astro` — `reader.singletons.appearances.read()`
- `src/components/shared/ButtonWall.astro` — `reader.singletons.buttonWall.read()`
- `src/components/layout/Footer.astro` — `reader.singletons.footer.read()`

### Astro Config Touchpoints (`astro.config.mjs`)
- `import keystatic from '@keystatic/astro'`
- `import react from '@astrojs/react'`
- Both in `integrations: [react(), keystatic(), markdoc()]`
- Netlify adapter configured (partially for Keystatic admin server routes)

---

## Migration Plan

### Phase 1: Setup Sveltia CMS

1. **Create admin page** at `public/admin/index.html` — single HTML file that loads Sveltia CMS via CDN script tag
2. **Create CMS config** at `public/admin/config.yml` — translate all Keystatic schema definitions to Decap/Sveltia YAML format
3. **Configure GitHub backend** in config.yml for repo `TekGadgt/tekgadgt.dev`

### Phase 2: Replace Reader API

Sveltia CMS only handles the admin UI and Git-based editing. For the build-time data layer, replace the Keystatic reader with direct file reads.

**Option A: Astro Content Collections (recommended)**
- Define content collections in `src/content.config.ts` using Astro's built-in content layer
- JSON singletons → read with `fs.readFileSync` or import directly
- Markdoc content → use Astro's content collections with markdoc integration
- Blog posts collection → maps naturally to Astro content collections

**Option B: Simple file reader utility**
- Replace `src/lib/reader.ts` with helpers that read JSON/Markdoc files from `src/content/`
- Minimal abstraction, direct fs reads

### Phase 3: Update All Consuming Files

Update the 15 files listed above to use the new data access pattern instead of `reader.singletons.X.read()` / `reader.collections.X.all()`.

### Phase 4: Remove Keystatic

1. Remove `@keystatic/astro`, `@keystatic/core` from package.json
2. Remove `@astrojs/react`, `react`, `react-dom` (unless needed elsewhere)
3. Delete `keystatic.config.ts`
4. Remove `keystatic()` and `react()` from astro.config.mjs integrations
5. Potentially remove Netlify adapter if going fully static (Sveltia admin is client-side only)

### Phase 5: Content File Adjustments

- JSON singletons should work as-is
- Markdoc files (`.mdoc`) may need conversion to standard Markdown (`.md`) if Sveltia doesn't support Markdoc — Sveltia uses standard Markdown with frontmatter
- Blog posts: convert from `index.mdoc` to `index.md` with YAML frontmatter

---

## Key Differences

| Aspect | Keystatic | Sveltia CMS |
|--------|-----------|-------------|
| Admin UI | React SPA, framework-integrated | Standalone SPA, framework-agnostic |
| Config | TypeScript | YAML (config.yml) |
| Data access | Reader API (build-time) | Direct file reads / Astro content collections |
| Content format | JSON + Markdoc | Markdown + YAML frontmatter + JSON |
| Auth | GitHub OAuth via integration | GitHub OAuth (Netlify Identity or custom) |
| Framework coupling | Tight (Astro integration + React) | None (just files) |
| Maintenance risk | Behind on Astro versions | Decoupled, no framework deps |

## Risks & Considerations

- **Markdoc → Markdown**: Sveltia expects standard Markdown. If any Markdoc-specific features are used (custom tags, nodes), those need conversion or a custom rendering pipeline.
- **Singleton pattern**: Decap/Sveltia supports "files collections" for singleton-like content, but the config is slightly different than Keystatic singletons.
- **Image handling**: Keystatic has built-in image fields with directory config. Sveltia supports media folders but config differs.
- **OAuth setup**: Sveltia needs OAuth configured (Netlify Identity or external OAuth provider) for GitHub authentication on the admin UI.
- **Nested arrays/objects**: Keystatic handles deeply nested schemas (e.g., uses → categories → items). Verify Sveltia's widget support for equivalent nesting.
