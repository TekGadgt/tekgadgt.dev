# Personal Site Design Spec

## Overview

Personal portfolio site for Ryan McGovern — developer and community builder. The site serves as a central hub for projects, community work, blog content, and professional presence.

## Tech Stack

- **Framework:** Astro (static site generation)
- **CMS:** Keystatic in GitHub mode ([docs](https://keystatic.com/docs/github-mode))
- **Content format:** Markdoc (Keystatic default)
- **Styling:** Vanilla CSS — Codex (ChatGPT) drives design decisions and may introduce Tailwind/SCSS later
- **Deployment:** Netlify (static build, auto-deploy on push)
- **RSS:** `@astrojs/rss`
- **Theme toggle:** Vanilla JS, groundwork only — Codex designs the actual theme

## Pages

### Homepage (`/`)

- Hero: name, tagline ("Developer & Community Builder"), 2-3 line bio
- Primary CTA (View Projects) + secondary CTA (Get in Touch)
- Credibility strip: pulls entries flagged `featured: true` from projects, community, and appearances singletons
- "Read full story" link to About page
- Content managed via `homepage` Keystatic singleton

### Work (`/work`)

- Two-column layout on desktop: Projects (left) | Community (right)
- Stacked on mobile: Projects above Community
- Each side pulls from its respective Keystatic singleton
- Project entry: name, description, URL, tech tags (array), image (optional), featured (boolean)
- Community entry: org name, role, description, URL, status (active/past), featured (boolean)

### Blog (`/blog` + `/blog/[slug]`)

- List page with post previews
- Individual post pages rendered from Markdoc
- Keystatic collection — slug derived from title field
- Post fields: title, date, tags (array), draft flag, content (Markdoc)
- File structure: `src/content/posts/[slug]/index.mdoc`

### About (`/about`)

- Deeper narrative about background, values, how dev + community building connect
- Managed as Keystatic singleton (rich Markdoc content)
- Appearances section rendered below the narrative, pulled from `appearances` singleton
- Appearance entry: type (talk/interview/podcast/article), title, outlet/event, date, URL, featured (boolean)

### Now (`/now`)

- Single page showing current focus — what Ryan is working on, reading, etc.
- Managed as Keystatic singleton (rich Markdoc content)
- Reference: [nownownow.com/about](https://nownownow.com/about)

### Uses (`/uses`)

- Tools, hardware, software, dev setup
- Managed as Keystatic singleton — JSON array of categories, each with name and items (array of name + description + optional URL)
- Reference: [uses.tech](https://uses.tech/)

### RSS Feed (`/rss.xml`)

- Generated via `@astrojs/rss` from blog posts collection

## Layout

### Header

- Site name/logo
- Navigation: Work, Blog, About, Now, Uses
- Theme toggle

### Footer (all pages)

- Email address
- Cal.com booking link
- Social links (array of platform name + URL + icon identifier)
- Managed via `footer` Keystatic singleton

## Keystatic Schema

### Singletons

| Singleton | Format | Fields |
|-----------|--------|--------|
| `homepage` | JSON | hero heading, tagline, bio text, primary CTA (label + URL), secondary CTA (label + URL) |
| `about` | Markdoc | rich content field |
| `appearances` | JSON | array of: type, title, outlet/event, date, URL, featured (boolean) |
| `projects` | JSON | array of: name, description, URL, tech tags (array), image (optional), featured (boolean) |
| `community` | JSON | array of: org name, role, description, URL, status (active/past), featured (boolean) |
| `now` | Markdoc | rich content field |
| `uses` | JSON | array of categories: name + items (array of name + description + optional URL) |
| `footer` | JSON | email, Cal.com URL, social links (array of platform name + URL + icon identifier) |

### Collections

| Collection | Format | Slug Source | Fields |
|------------|--------|-------------|--------|
| `posts` | Markdoc | title field (slugified → filename) | title, date, tags (array), draft (boolean), content (Markdoc) |

## Content File Structure

```
src/
  content/
    posts/                  # Keystatic collection (blog)
      [slug]/
        index.mdoc

keystatic/                  # Keystatic singletons (paths determined by schema config)
  homepage.json
  about.mdoc
  appearances.json
  projects.json
  community.json
  now.mdoc
  uses.json
  footer.json
```

Note: Actual singleton paths are determined by Keystatic schema configuration.

## Theme Toggle

Groundwork implementation — Codex designs actual color values and visual design.

- Inline `<script>` in `<head>` reads `localStorage` preference before paint (prevents flash of wrong theme)
- Falls back to `prefers-color-scheme` on first visit
- User choice persisted to `localStorage`
- CSS custom properties for all theme-dependent values (colors, shadows, etc.)
- Toggle control in header nav

## Design Direction

Visual design is driven by Codex (ChatGPT via codex-cli). This spec covers architecture and content structure. Codex will:

- Design the overall visual identity, typography, spacing, and color palette
- Create component-level styles
- Decide if a CSS framework (Tailwind, SCSS, etc.) should be introduced
- Hook up theme toggle to actual design tokens

## Contact

- No dedicated `/contact` page
- Email and Cal.com link live in the footer
- Bot-protection for email is deferred to a future iteration

## Future Considerations (out of scope)

- AI CMS plugin (BYOK model) — separate future project
- Email bot-protection / accessible obfuscation
- Splitting `/work` back into separate `/projects` and `/community` pages if content grows
- Extracting appearances from About into its own page
