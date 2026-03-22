# Personal Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Design rule:** All CSS and visual work must be reviewed or authored by Codex (ChatGPT via codex-cli MCP) before committing. Reference the spec's Visual Design Direction section for tokens, typography, and component patterns.

**Goal:** Build a personal portfolio site for Ryan McGovern using Astro + Keystatic with a neobrutalist visual design.

**Architecture:** Astro static site with Keystatic CMS in GitHub mode. All content managed through Keystatic singletons (structured data) and one collection (blog posts). Vanilla CSS with CSS custom properties for theming. Deployed to Netlify.

**Tech Stack:** Astro, Keystatic, Markdoc, Vanilla CSS, @astrojs/rss, Netlify

**Spec:** `docs/superpowers/specs/2026-03-21-personal-site-design.md`

---

## File Structure

```
personal_site/
├── astro.config.mjs                    # Astro config with Keystatic + Markdoc integrations
├── keystatic.config.ts                 # All singleton + collection schemas
├── netlify.toml                        # Netlify build config
├── package.json
├── tsconfig.json
├── public/
│   └── images/
│       └── buttons/                    # 88x31 button images
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── BaseLayout.astro        # HTML shell, head, theme script, header + footer
│   │   │   ├── Header.astro            # Nav + theme toggle
│   │   │   ├── Footer.astro            # Email, Cal.com, socials, button wall
│   │   │   └── ThemeToggle.astro       # Segmented LIGHT/DARK control
│   │   ├── home/
│   │   │   ├── Hero.astro              # Hero section with CTAs
│   │   │   └── CredibilityStrip.astro  # Featured items from singletons
│   │   ├── work/
│   │   │   ├── ExperienceSection.astro # Full-width timeline/list
│   │   │   ├── ProjectCard.astro       # Single project card
│   │   │   └── CommunityCard.astro     # Single community card
│   │   ├── blog/
│   │   │   ├── PostCard.astro          # Blog list preview card
│   │   │   └── PostHeader.astro        # Individual post header (title, date, tags, image)
│   │   ├── about/
│   │   │   └── AppearancesList.astro   # Appearances section
│   │   └── shared/
│   │       ├── ButtonWall.astro        # 88x31 button wall (mine + friends)
│   │       └── Chip.astro              # Tag/chip component
│   ├── content/
│   │   ├── posts/                      # Blog collection (Keystatic)
│   │   ├── homepage.json               # Homepage singleton
│   │   ├── about.mdoc                  # About singleton (Markdoc)
│   │   ├── appearances.json            # Appearances singleton
│   │   ├── projects.json               # Projects singleton
│   │   ├── community.json              # Community singleton
│   │   ├── experience.json             # Experience singleton
│   │   ├── now.mdoc                    # Now singleton (Markdoc)
│   │   ├── uses.json                   # Uses singleton
│   │   ├── footer.json                 # Footer singleton
│   │   └── buttonWall.json             # Button wall singleton
│   ├── pages/
│   │   ├── index.astro                 # Homepage
│   │   ├── work.astro                  # Work page
│   │   ├── blog/
│   │   │   ├── index.astro             # Blog list
│   │   │   └── [...slug].astro         # Blog post
│   │   ├── about.astro                 # About page
│   │   ├── now.astro                   # Now page
│   │   ├── uses.astro                  # Uses page
│   │   ├── 404.astro                   # Custom 404
│   │   └── rss.xml.ts                  # RSS feed
│   └── styles/
│       ├── global.css                  # Reset + base styles + CSS custom properties
│       └── theme.css                   # Light/dark theme token definitions
└── docs/
    └── superpowers/
        ├── specs/
        │   └── 2026-03-21-personal-site-design.md
        └── plans/
            └── 2026-03-21-personal-site.md (this file)
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `keystatic.config.ts`, `netlify.toml`

- [ ] **Step 1: Initialize Astro project**

```bash
cd /home/tekgadgt/work/personal_site
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict
```

Accept defaults. This creates `package.json`, `astro.config.mjs`, `tsconfig.json`, and `src/` scaffold.

- [ ] **Step 2: Install dependencies**

```bash
npm install @keystatic/core @keystatic/astro @astrojs/markdoc @astrojs/rss
```

- [ ] **Step 3: Configure Astro**

Update `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import keystatic from '@keystatic/astro';
import markdoc from '@astrojs/markdoc';

export default defineConfig({
  output: 'hybrid',
  integrations: [
    keystatic(),
    markdoc(),
  ],
});
```

Note: Keystatic requires `hybrid` or `server` output mode for its admin UI route. In production static builds, Keystatic's admin route is excluded.

- [ ] **Step 4: Create Netlify config**

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
```

- [ ] **Step 5: Verify the project builds**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```

Expected: Dev server starts at `localhost:4321`.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json netlify.toml src/
git commit -m "feat: scaffold Astro project with Keystatic and Markdoc"
```

---

## Task 2: Keystatic Schema — Singletons

**Files:**
- Create: `keystatic.config.ts`
- Create: All seed content files in `src/content/`

- [ ] **Step 1: Write the Keystatic config with all singletons**

Create `keystatic.config.ts` at project root:

```typescript
import { config, collection, singleton, fields } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  singletons: {
    homepage: singleton({
      label: 'Homepage',
      path: 'src/content/homepage',
      format: { data: 'json' },
      schema: {
        heroHeading: fields.text({ label: 'Hero Heading' }),
        tagline: fields.text({ label: 'Tagline' }),
        bioText: fields.text({ label: 'Bio Text', multiline: true }),
        primaryCtaLabel: fields.text({ label: 'Primary CTA Label' }),
        primaryCtaUrl: fields.text({ label: 'Primary CTA URL' }),
        secondaryCtaLabel: fields.text({ label: 'Secondary CTA Label' }),
        secondaryCtaUrl: fields.text({ label: 'Secondary CTA URL' }),
        metaDescription: fields.text({ label: 'Meta Description', multiline: true }),
      },
    }),
    about: singleton({
      label: 'About',
      path: 'src/content/about',
      format: { contentField: 'content' },
      schema: {
        metaDescription: fields.text({ label: 'Meta Description', multiline: true }),
        content: fields.markdoc({ label: 'Content' }),
      },
    }),
    appearances: singleton({
      label: 'Appearances',
      path: 'src/content/appearances',
      format: { data: 'json' },
      schema: {
        items: fields.array(
          fields.object({
            type: fields.select({
              label: 'Type',
              options: [
                { label: 'Talk', value: 'talk' },
                { label: 'Interview', value: 'interview' },
                { label: 'Podcast', value: 'podcast' },
                { label: 'Article', value: 'article' },
              ],
              defaultValue: 'talk',
            }),
            title: fields.text({ label: 'Title', validation: { isRequired: true } }),
            outlet: fields.text({ label: 'Outlet/Event' }),
            date: fields.date({ label: 'Date' }),
            url: fields.url({ label: 'URL' }),
            featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
          }),
          {
            label: 'Appearances',
            itemLabel: (props) => props.fields.title.value || 'New Appearance',
          }
        ),
      },
    }),
    projects: singleton({
      label: 'Projects',
      path: 'src/content/projects',
      format: { data: 'json' },
      schema: {
        items: fields.array(
          fields.object({
            name: fields.text({ label: 'Name', validation: { isRequired: true } }),
            description: fields.text({ label: 'Description', multiline: true }),
            url: fields.url({ label: 'URL' }),
            techTags: fields.array(
              fields.text({ label: 'Tag' }),
              { label: 'Tech Tags', itemLabel: (props) => props.value || 'New Tag' }
            ),
            image: fields.image({
              label: 'Image',
              directory: 'public/images/projects',
              publicPath: '/images/projects/',
            }),
            featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
          }),
          {
            label: 'Projects',
            itemLabel: (props) => props.fields.name.value || 'New Project',
          }
        ),
      },
    }),
    community: singleton({
      label: 'Community',
      path: 'src/content/community',
      format: { data: 'json' },
      schema: {
        items: fields.array(
          fields.object({
            orgName: fields.text({ label: 'Organization', validation: { isRequired: true } }),
            role: fields.text({ label: 'Role' }),
            description: fields.text({ label: 'Description', multiline: true }),
            url: fields.url({ label: 'URL' }),
            status: fields.select({
              label: 'Status',
              options: [
                { label: 'Active', value: 'active' },
                { label: 'Past', value: 'past' },
              ],
              defaultValue: 'active',
            }),
            featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
          }),
          {
            label: 'Community Roles',
            itemLabel: (props) => props.fields.orgName.value || 'New Role',
          }
        ),
      },
    }),
    experience: singleton({
      label: 'Experience',
      path: 'src/content/experience',
      format: { data: 'json' },
      schema: {
        items: fields.array(
          fields.object({
            company: fields.text({ label: 'Company', validation: { isRequired: true } }),
            role: fields.text({ label: 'Role', validation: { isRequired: true } }),
            startDate: fields.date({ label: 'Start Date' }),
            endDate: fields.date({ label: 'End Date' }),
            location: fields.text({ label: 'Location' }),
            employmentType: fields.text({ label: 'Employment Type' }),
            summary: fields.text({ label: 'Summary', multiline: true }),
            impact: fields.array(
              fields.text({ label: 'Impact' }),
              { label: 'Impact Items', itemLabel: (props) => props.value || 'New Impact' }
            ),
            tech: fields.array(
              fields.text({ label: 'Technology' }),
              { label: 'Technologies', itemLabel: (props) => props.value || 'New Tech' }
            ),
            url: fields.url({ label: 'URL' }),
            featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
          }),
          {
            label: 'Experience',
            itemLabel: (props) => {
              const company = props.fields.company.value;
              const role = props.fields.role.value;
              return company && role ? `${role} @ ${company}` : 'New Position';
            },
          }
        ),
      },
    }),
    now: singleton({
      label: 'Now',
      path: 'src/content/now',
      format: { contentField: 'content' },
      schema: {
        content: fields.markdoc({ label: 'Content' }),
      },
    }),
    uses: singleton({
      label: 'Uses',
      path: 'src/content/uses',
      format: { data: 'json' },
      schema: {
        categories: fields.array(
          fields.object({
            name: fields.text({ label: 'Category Name', validation: { isRequired: true } }),
            items: fields.array(
              fields.object({
                name: fields.text({ label: 'Name', validation: { isRequired: true } }),
                description: fields.text({ label: 'Description' }),
                url: fields.url({ label: 'URL' }),
              }),
              {
                label: 'Items',
                itemLabel: (props) => props.fields.name.value || 'New Item',
              }
            ),
          }),
          {
            label: 'Categories',
            itemLabel: (props) => props.fields.name.value || 'New Category',
          }
        ),
      },
    }),
    footer: singleton({
      label: 'Footer',
      path: 'src/content/footer',
      format: { data: 'json' },
      schema: {
        email: fields.text({ label: 'Email' }),
        calUrl: fields.url({ label: 'Cal.com URL' }),
        socialLinks: fields.array(
          fields.object({
            platform: fields.text({ label: 'Platform Name', validation: { isRequired: true } }),
            url: fields.url({ label: 'URL', validation: { isRequired: true } }),
            icon: fields.text({ label: 'Icon Identifier' }),
          }),
          {
            label: 'Social Links',
            itemLabel: (props) => props.fields.platform.value || 'New Link',
          }
        ),
      },
    }),
    buttonWall: singleton({
      label: 'Button Wall',
      path: 'src/content/buttonWall',
      format: { data: 'json' },
      schema: {
        buttons: fields.array(
          fields.object({
            label: fields.text({ label: 'Label', validation: { isRequired: true } }),
            image: fields.image({
              label: 'Button Image (88x31)',
              directory: 'public/images/buttons',
              publicPath: '/images/buttons/',
            }),
            url: fields.url({ label: 'URL' }),
            group: fields.select({
              label: 'Group',
              options: [
                { label: 'Mine', value: 'mine' },
                { label: 'Friends', value: 'friends' },
              ],
              defaultValue: 'mine',
            }),
            active: fields.checkbox({ label: 'Active', defaultValue: true }),
          }),
          {
            label: 'Buttons',
            itemLabel: (props) => props.fields.label.value || 'New Button',
          }
        ),
      },
    }),
  },
  collections: {},
});
```

- [ ] **Step 2: Verify Keystatic admin loads**

```bash
npm run dev
```

Navigate to `http://localhost:4321/keystatic`. Expected: Keystatic admin UI shows all singletons in the sidebar.

- [ ] **Step 3: Commit**

```bash
git add keystatic.config.ts
git commit -m "feat: add Keystatic schema for all singletons"
```

---

## Task 3: Keystatic Schema — Blog Collection

**Files:**
- Modify: `keystatic.config.ts`

- [ ] **Step 1: Add the posts collection to keystatic.config.ts**

Add inside the `collections: {}` object:

```typescript
collections: {
  posts: collection({
    label: 'Blog Posts',
    slugField: 'title',
    path: 'src/content/posts/*/',
    format: { contentField: 'content' },
    schema: {
      title: fields.slug({ name: { label: 'Title', validation: { isRequired: true } } }),
      description: fields.text({ label: 'Description', multiline: true, validation: { isRequired: true } }),
      date: fields.date({ label: 'Date', validation: { isRequired: true } }),
      tags: fields.array(
        fields.text({ label: 'Tag' }),
        { label: 'Tags', itemLabel: (props) => props.value || 'New Tag' }
      ),
      draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
      image: fields.image({
        label: 'Cover Image',
        directory: 'public/images/posts',
        publicPath: '/images/posts/',
      }),
      content: fields.markdoc({ label: 'Content' }),
    },
  }),
},
```

- [ ] **Step 2: Verify collection appears in Keystatic admin**

```bash
npm run dev
```

Navigate to `http://localhost:4321/keystatic`. Expected: "Blog Posts" collection appears in the sidebar alongside singletons.

- [ ] **Step 3: Commit**

```bash
git add keystatic.config.ts
git commit -m "feat: add blog posts collection to Keystatic schema"
```

---

## Task 4: Seed Content

**Files:**
- Create: All JSON and Markdoc files in `src/content/`

- [ ] **Step 1: Create seed content for all singletons**

Create `src/content/homepage.json`:
```json
{
  "heroHeading": "Ryan McGovern",
  "tagline": "Developer & Community Builder",
  "bioText": "I build software and communities. Currently leading meetups, shipping side projects, and writing about the things I learn along the way.",
  "primaryCtaLabel": "View Work",
  "primaryCtaUrl": "/work",
  "secondaryCtaLabel": "Get in Touch",
  "secondaryCtaUrl": "#footer",
  "metaDescription": "Ryan McGovern — developer and community builder. Projects, blog, and community work."
}
```

Create `src/content/about.mdoc`:
```markdoc
---
metaDescription: "About Ryan McGovern — developer, community builder, and organizer in the 757."
---

# About

This is placeholder content for the about page. Replace with your story, background, values, and how development and community building connect for you.
```

Create `src/content/appearances.json`:
```json
{
  "items": [
    {
      "type": "interview",
      "title": "Builder Meetups Are Where the 757 Gets Better",
      "outlet": "Innovate 757",
      "date": "2026-03-19",
      "url": "https://www.innovate757.org/2026/03/19/builder-meetups-are-where-the-757-gets-better/",
      "featured": true
    }
  ]
}
```

Create `src/content/projects.json`:
```json
{
  "items": [
    {
      "name": "cssdaily.dev",
      "description": "Daily CSS tips and challenges.",
      "url": "https://cssdaily.dev",
      "techTags": ["CSS", "Web"],
      "image": null,
      "featured": true
    },
    {
      "name": "Conclave Chat",
      "description": "Real-time chat application.",
      "url": "",
      "techTags": ["JavaScript", "WebSockets"],
      "image": null,
      "featured": true
    },
    {
      "name": "BuildBeat",
      "description": "Build tracking and accountability tool.",
      "url": "",
      "techTags": ["JavaScript"],
      "image": null,
      "featured": false
    }
  ]
}
```

Create `src/content/community.json`:
```json
{
  "items": [
    {
      "orgName": "Late Night Builders",
      "role": "Organizer",
      "description": "Builder meetup community.",
      "url": "",
      "status": "active",
      "featured": true
    },
    {
      "orgName": "AI Collective",
      "role": "Online Community Lead",
      "description": "Local AI community.",
      "url": "",
      "status": "active",
      "featured": true
    }
  ]
}
```

Create `src/content/experience.json`:
```json
{
  "items": []
}
```

Create `src/content/now.mdoc`:
```markdoc
This is placeholder content for the /now page. Update with what you're currently focused on, reading, building, or exploring.
```

Create `src/content/uses.json`:
```json
{
  "categories": [
    {
      "name": "Development",
      "items": [
        {
          "name": "VS Code",
          "description": "Primary editor",
          "url": "https://code.visualstudio.com"
        }
      ]
    }
  ]
}
```

Create `src/content/footer.json`:
```json
{
  "email": "placeholder@example.com",
  "calUrl": "https://cal.com/placeholder",
  "socialLinks": [
    {
      "platform": "GitHub",
      "url": "https://github.com/placeholder",
      "icon": "github"
    },
    {
      "platform": "LinkedIn",
      "url": "https://linkedin.com/in/placeholder",
      "icon": "linkedin"
    }
  ]
}
```

Create `src/content/buttonWall.json`:
```json
{
  "buttons": []
}
```

- [ ] **Step 2: Verify seed content loads in Keystatic admin**

```bash
npm run dev
```

Navigate to `http://localhost:4321/keystatic`. Click through each singleton and verify the seed data appears in the editor. Expected: All singletons show their seed content.

- [ ] **Step 3: Commit**

```bash
git add src/content/
git commit -m "feat: add seed content for all Keystatic singletons"
```

---

## Task 5: Theme CSS Foundation

**Files:**
- Create: `src/styles/theme.css`, `src/styles/global.css`

**Design rule:** Have Codex author the CSS for this task. The spec's Visual Design Direction section defines all tokens, typography, and base styles.

- [ ] **Step 1: Ask Codex to write `theme.css`**

Prompt Codex with the color palette from the spec and ask it to generate `src/styles/theme.css` with:
- `:root` (light theme) and `[data-theme="dark"]` selectors
- All CSS custom properties from the spec's color palette table
- Typography custom properties (font families, sizes, line heights, prose width)
- Shadow and border tokens

- [ ] **Step 2: Ask Codex to write `global.css`**

Prompt Codex to generate `src/styles/global.css` with:
- CSS reset (minimal — box-sizing, margin reset, img max-width)
- Base typography styles using the custom properties
- Font-face declarations or Google Fonts import for Archivo Black, IBM Plex Sans, IBM Plex Mono, Silkscreen
- Base link, heading, and body styles
- `prefers-reduced-motion` media query to disable animations

- [ ] **Step 3: Verify styles render**

Create a minimal `src/pages/index.astro` that imports both CSS files and renders a heading + paragraph. Check in browser that fonts load, colors apply, and dark mode tokens work when you manually add `data-theme="dark"` to `<html>`.

- [ ] **Step 4: Commit**

```bash
git add src/styles/ src/pages/index.astro
git commit -m "feat: add theme tokens and global CSS foundation"
```

---

## Task 6: Base Layout + Theme Toggle

**Files:**
- Create: `src/components/layout/BaseLayout.astro`, `src/components/layout/ThemeToggle.astro`

- [ ] **Step 1: Create ThemeToggle component**

Create `src/components/layout/ThemeToggle.astro` — the chunky segmented LIGHT/DARK control. Have Codex author the component markup and styles per the spec's Theme Toggle Design section.

The component should:
- Render two labeled segments: LIGHT and DARK
- Use pixel-style sun/moon glyphs
- Snap with positional shift on toggle
- Emit no JS — interactivity is handled by the inline head script

- [ ] **Step 2: Create BaseLayout component**

Create `src/components/layout/BaseLayout.astro`:

```astro
---
import '../styles/theme.css';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Ryan McGovern — developer and community builder.' } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <script is:inline>
      (function() {
        const stored = localStorage.getItem('theme');
        const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const theme = stored || preferred;
        document.documentElement.setAttribute('data-theme', theme);
      })();
    </script>
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 3: Add theme toggle JS**

Add a `<script>` block at the bottom of `BaseLayout.astro` (not `is:inline`) that:
- Selects the toggle control
- On click, reads current `data-theme`, flips it, updates `data-theme` and `localStorage`
- Updates the toggle's visual state (active segment)

- [ ] **Step 4: Update index.astro to use BaseLayout**

```astro
---
import BaseLayout from '../components/layout/BaseLayout.astro';
---

<BaseLayout title="Ryan McGovern">
  <main>
    <h1>Hello World</h1>
    <p>Site is under construction.</p>
  </main>
</BaseLayout>
```

- [ ] **Step 5: Verify theme and layout works**

```bash
npm run dev
```

Expected: Page loads with correct theme based on system preference (light or dark applied via `data-theme` attribute). ThemeToggle is rendered temporarily in the page. Toggle switches between light/dark. Refresh preserves the choice. (ThemeToggle moves into the Header component in Task 7.)

Note: Temporarily render `<ThemeToggle />` in the index page or BaseLayout body so you can test it. It moves to `<Header />` in Task 7.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/ src/pages/index.astro
git commit -m "feat: add base layout with theme toggle"
```

---

## Task 7: Header + Footer Components

**Files:**
- Create: `src/components/layout/Header.astro`, `src/components/layout/Footer.astro`
- Modify: `src/components/layout/BaseLayout.astro`

**Design rule:** Have Codex author or review the CSS for header and footer.

- [ ] **Step 1: Create Header component**

Create `src/components/layout/Header.astro`:
- Site name/logo linking to `/`
- Nav links: Work, Blog, About, Now, Uses
- ThemeToggle component
- Neobrutalist nav styling (tab-like links, strong active state, keyboard focus ring)
- Mobile nav (hamburger/collapsible) — vanilla JS for toggle

- [ ] **Step 2: Create Footer component**

Create `src/components/layout/Footer.astro`:
- Read footer data from `src/content/footer.json`
- Render email, Cal.com link, social links
- Social link icons (strategy determined by Codex — inline SVGs recommended)
- Slot for ButtonWall component (added later)

- [ ] **Step 3: Wire Header and Footer into BaseLayout**

Update `BaseLayout.astro` to import and render `<Header />` and `<Footer />` around the `<slot />`.

- [ ] **Step 4: Verify header and footer render**

```bash
npm run dev
```

Expected: Header with nav links and theme toggle. Footer with placeholder social links. Navigation links work (404 for pages not yet created, which is fine).

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/
git commit -m "feat: add header and footer components"
```

---

## Task 8: Homepage

**Files:**
- Create: `src/components/home/Hero.astro`, `src/components/home/CredibilityStrip.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create Hero component**

Create `src/components/home/Hero.astro`:
- Read homepage data from `src/content/homepage.json`
- Render heading, tagline, bio text
- Primary and secondary CTA buttons (neobrutalist style)

- [ ] **Step 2: Create CredibilityStrip component**

Create `src/components/home/CredibilityStrip.astro`:
- Read from `src/content/projects.json`, `src/content/community.json`, `src/content/appearances.json`
- Filter for `featured: true` items
- Order: projects first, then community, then appearances
- Display name + link for each

- [ ] **Step 3: Wire up index.astro**

Update `src/pages/index.astro` to import and render Hero + CredibilityStrip + "Read full story" link.

- [ ] **Step 4: Have Codex review/author the component styles**

Send the Hero and CredibilityStrip markup to Codex for styling per the spec's neobrutalist component patterns.

- [ ] **Step 5: Verify homepage renders**

```bash
npm run dev
```

Expected: Hero with name, tagline, bio, CTAs. Credibility strip showing featured items. Responsive layout.

- [ ] **Step 6: Commit**

```bash
git add src/components/home/ src/pages/index.astro
git commit -m "feat: add homepage with hero and credibility strip"
```

---

## Task 9: Work Page

**Files:**
- Create: `src/components/work/ExperienceSection.astro`, `src/components/work/ProjectCard.astro`, `src/components/work/CommunityCard.astro`
- Create: `src/components/shared/Chip.astro`
- Create: `src/pages/work.astro`

- [ ] **Step 1: Create Chip component**

Create `src/components/shared/Chip.astro` — blocky tag/chip used for tech tags and status labels.

- [ ] **Step 2: Create ProjectCard component**

Create `src/components/work/ProjectCard.astro`:
- Props: name, description, url, techTags, image, featured
- Neobrutalist card with thick border, offset shadow
- Tech tags rendered as Chips
- Optional FEATURED corner label

- [ ] **Step 3: Create CommunityCard component**

Create `src/components/work/CommunityCard.astro`:
- Props: orgName, role, description, url, status, featured
- Same card style as ProjectCard
- Status rendered as a Chip (ACTIVE/PAST)

- [ ] **Step 4: Create ExperienceSection component**

Create `src/components/work/ExperienceSection.astro`:
- Read from `src/content/experience.json`
- Full-width timeline/list layout
- Gracefully handle empty array (no section rendered)
- Each entry: company, role, dates, summary, impact list, tech chips

- [ ] **Step 5: Create work page**

Create `src/pages/work.astro`:
- Uses BaseLayout
- ExperienceSection (full-width, above the split)
- Two-column grid: projects (left) | community (right) on desktop
- Stacked on mobile: projects above community
- Read from `src/content/projects.json` and `src/content/community.json`
- Map items to ProjectCard and CommunityCard components

- [ ] **Step 6: Have Codex review/author the styles**

Send the work page and card components to Codex for styling.

- [ ] **Step 7: Verify work page renders**

```bash
npm run dev
```

Navigate to `/work`. Expected: Two-column layout with project and community cards. Experience section empty (no seed data). Responsive stacking on narrow viewports.

- [ ] **Step 8: Commit**

```bash
git add src/components/work/ src/components/shared/ src/pages/work.astro
git commit -m "feat: add work page with experience, projects, and community sections"
```

---

## Task 10: Blog — List Page + Post Page

**Files:**
- Create: `src/components/blog/PostCard.astro`, `src/components/blog/PostHeader.astro`
- Create: `src/pages/blog/index.astro`, `src/pages/blog/[...slug].astro`

- [ ] **Step 1: Create a seed blog post via Keystatic**

Create `src/content/posts/hello-world/index.mdoc`:

```markdoc
---
title: Hello World
description: "A first post to test the blog."
date: "2026-03-21"
tags:
  - meta
draft: false
image: null
---

This is a test post. If you're reading this, the blog is working.
```

- [ ] **Step 2: Create PostCard component**

Create `src/components/blog/PostCard.astro`:
- Props: title, description, date, tags, slug, image
- Neobrutalist card linking to `/blog/[slug]`
- Date formatted, tags as Chips

- [ ] **Step 3: Create blog list page**

Create `src/pages/blog/index.astro`:
- Uses BaseLayout
- Reads all posts from Keystatic
- Filters out drafts in production (`import.meta.env.PROD`)
- Sorts by date descending
- Renders PostCard for each

- [ ] **Step 4: Create PostHeader component**

Create `src/components/blog/PostHeader.astro`:
- Props: title, date, tags, image, description
- Renders title, date, reading time estimate, tags, optional hero image

- [ ] **Step 5: Create blog post page**

Create `src/pages/blog/[...slug].astro`:
- Uses BaseLayout with post title and description for meta
- Uses Astro's `getStaticPaths` to generate paths from Keystatic posts
- Filters drafts in production
- Renders PostHeader + Markdoc content in a framed reading container

- [ ] **Step 6: Have Codex review/author blog styles**

Send PostCard, PostHeader, and the reading container styles to Codex. Key requirements from spec:
- Post header card treatment
- Framed reading container with generous spacing
- Code blocks in neobrutalist frame style
- Prose width 68-72ch

- [ ] **Step 7: Verify blog renders**

```bash
npm run dev
```

Navigate to `/blog`. Expected: List showing "Hello World" post card. Click through to `/blog/hello-world`. Expected: Post renders with header and content.

- [ ] **Step 8: Commit**

```bash
git add src/components/blog/ src/pages/blog/ src/content/posts/
git commit -m "feat: add blog list and post pages with Markdoc rendering"
```

---

## Task 11: About Page + Appearances

**Files:**
- Create: `src/components/about/AppearancesList.astro`
- Create: `src/pages/about.astro`

- [ ] **Step 1: Create AppearancesList component**

Create `src/components/about/AppearancesList.astro`:
- Read from `src/content/appearances.json`
- Render each appearance: type badge (Chip), title, outlet, date, link
- Handle empty array gracefully

- [ ] **Step 2: Create about page**

Create `src/pages/about.astro`:
- Uses BaseLayout with about meta description
- Read about singleton (Markdoc content)
- Render the Markdoc content
- Render AppearancesList below the narrative

- [ ] **Step 3: Have Codex review/author styles**

- [ ] **Step 4: Verify about page renders**

```bash
npm run dev
```

Navigate to `/about`. Expected: Placeholder narrative text + appearances section with the Innovate 757 interview entry.

- [ ] **Step 5: Commit**

```bash
git add src/components/about/ src/pages/about.astro
git commit -m "feat: add about page with appearances section"
```

---

## Task 12: Now + Uses Pages

**Files:**
- Create: `src/pages/now.astro`, `src/pages/uses.astro`

- [ ] **Step 1: Create now page**

Create `src/pages/now.astro`:
- Uses BaseLayout
- Read now singleton (Markdoc content)
- Render content

- [ ] **Step 2: Create uses page**

Create `src/pages/uses.astro`:
- Uses BaseLayout
- Read uses singleton
- Render categories with items (name, description, optional link)
- Each category as a section heading, items as a list

- [ ] **Step 3: Have Codex review/author styles**

- [ ] **Step 4: Verify both pages render**

```bash
npm run dev
```

Navigate to `/now` and `/uses`. Expected: Placeholder content renders correctly.

- [ ] **Step 5: Commit**

```bash
git add src/pages/now.astro src/pages/uses.astro
git commit -m "feat: add now and uses pages"
```

---

## Task 13: Button Wall + 404 Page

**Files:**
- Create: `src/components/shared/ButtonWall.astro`
- Create: `src/pages/404.astro`
- Modify: `src/components/layout/Footer.astro`

- [ ] **Step 1: Create ButtonWall component**

Create `src/components/shared/ButtonWall.astro`:
- Read from `src/content/buttonWall.json`
- Filter for `active: true` buttons
- Group into "Mine" and "Friends" sections
- Render each as an 88x31 image link
- Handle empty array gracefully (don't render anything)
- Use Silkscreen font for section headings (retro touch)

- [ ] **Step 2: Add ButtonWall to Footer**

Update `src/components/layout/Footer.astro` to render `<ButtonWall />` above the social links.

- [ ] **Step 3: Create 404 page**

Create `src/pages/404.astro`:
- Uses BaseLayout with title "Page Not Found"
- Simple message: "This page doesn't exist."
- Link back to homepage
- Neobrutalist styling (could be playful — have Codex weigh in)

- [ ] **Step 4: Have Codex review/author styles**

- [ ] **Step 5: Verify both render**

```bash
npm run dev
```

Expected: Footer shows empty button wall (no buttons seeded). Navigate to a nonexistent route — 404 page renders.

- [ ] **Step 6: Commit**

```bash
git add src/components/shared/ButtonWall.astro src/pages/404.astro src/components/layout/Footer.astro
git commit -m "feat: add button wall component and 404 page"
```

---

## Task 14: RSS Feed

**Files:**
- Create: `src/pages/rss.xml.ts`

- [ ] **Step 1: Create RSS feed endpoint**

Create `src/pages/rss.xml.ts`:

```typescript
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

export async function GET(context: APIContext) {
  const reader = createReader(process.cwd(), keystaticConfig);
  const posts = await reader.collections.posts.all();

  const publishedPosts = posts
    .filter((post) => !post.entry.draft)
    .sort((a, b) => new Date(b.entry.date).getTime() - new Date(a.entry.date).getTime());

  return rss({
    title: 'Ryan McGovern',
    description: 'Developer & Community Builder',
    site: context.site ?? 'https://example.com',
    items: publishedPosts.map((post) => ({
      title: post.entry.title,
      description: post.entry.description,
      pubDate: new Date(post.entry.date),
      link: `/blog/${post.slug}/`,
    })),
  });
}
```

- [ ] **Step 2: Add site URL to Astro config**

Update `astro.config.mjs` to include `site: 'https://example.com'` (placeholder — update when real domain is known).

- [ ] **Step 3: Verify RSS feed generates**

```bash
npm run build
```

Check that `dist/rss.xml` exists and contains the "Hello World" test post. Expected: Valid RSS XML with one `<item>`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/rss.xml.ts astro.config.mjs
git commit -m "feat: add RSS feed generation"
```

---

## Task 15: Build Verification + Netlify Deploy Prep

**Files:**
- Possibly modify: `astro.config.mjs`, `netlify.toml`

- [ ] **Step 1: Run full production build**

```bash
npm run build
```

Expected: Build completes with no errors. All pages generated in `dist/`.

- [ ] **Step 2: Preview the production build**

```bash
npm run preview
```

Click through all pages: `/`, `/work`, `/blog`, `/blog/hello-world`, `/about`, `/now`, `/uses`. Verify theme toggle works. Check a nonexistent route for 404.

- [ ] **Step 3: Verify Keystatic admin works in dev**

```bash
npm run dev
```

Navigate to `/keystatic`. Verify you can browse and edit all singletons and the blog collection.

- [ ] **Step 4: Configure Keystatic GitHub mode for production**

Update `keystatic.config.ts` storage to conditionally use GitHub mode in production:

```typescript
storage: import.meta.env.DEV
  ? { kind: 'local' }
  : {
      kind: 'github',
      repo: 'OWNER/REPO', // TODO: replace with actual repo
    },
```

Reference: https://keystatic.com/docs/github-mode

- [ ] **Step 5: Fix any issues found**

Address any build errors, broken layouts, or missing content.

- [ ] **Step 6: Commit**

```bash
git add keystatic.config.ts
git commit -m "feat: configure Keystatic GitHub mode for production"
```

- [ ] **Step 7: Commit any remaining fixes**

```bash
git add -A
git commit -m "fix: address build verification issues"
```

(Skip if no fixes needed.)

---

## Task 16: Work Page — Add ButtonWall

**Files:**
- Modify: `src/pages/work.astro`

- [ ] **Step 1: Add ButtonWall to work page**

Update `src/pages/work.astro` to render `<ButtonWall />` at the bottom of the page (below the projects/community split), per the spec's 90s Touches section.

- [ ] **Step 2: Verify it renders**

```bash
npm run dev
```

Navigate to `/work`. Expected: ButtonWall renders at the bottom (empty for now, since no buttons are seeded).

- [ ] **Step 3: Commit**

```bash
git add src/pages/work.astro
git commit -m "feat: add button wall to work page"
```

---

## Deferred Visual Features

The following items from the spec's Visual Design Direction are intentionally deferred from this plan. They are polish/enhancement items that should be tackled after the core site is functional:

- **Markdoc custom callouts** (`Note`, `Build Log`, `Opinion`) — requires Markdoc tag config + custom components. Add when blog content needs them.
- **Visitor counter module** — retro simulated/real counter artifact. Add as a standalone enhancement.
- **CSS entrance stagger animations** — CSS-only entrance animations for major sections with `prefers-reduced-motion` support. Add during design polish pass.
- **Horizontal ticker/marquee strip** — optional metadata lane. Add during design polish pass.
- **Reading time calculation** — word-count-based estimate for blog posts. Add when blog post template is finalized.
