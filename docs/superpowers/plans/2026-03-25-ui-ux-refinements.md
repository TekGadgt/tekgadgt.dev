# UI/UX Refinements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Address third-party design feedback to refine the neobrutalism aesthetic — fix color adjacency, unify container widths, reverse hover effects to press-down, simplify CTAs, and add polish (homepage animation, hire callout, footer indicator).

**Architecture:** All changes are CSS and Astro template modifications. No new dependencies. Design tokens in `theme.css` drive global changes; component-scoped `<style>` blocks handle per-component tweaks. Use Codex for design review on subjective choices.

**Tech Stack:** Astro 6, plain CSS custom properties, scoped component styles.

---

### Task 1: Reverse hover/press animation to "press down" pattern

All three reference design systems (neobrutalism.dev, neobrutalui, NeoBrutalismCSS) use a press-down effect: element translates _toward_ the shadow on hover, shadow shrinks or disappears. Current site does the opposite (lifts up, shadow grows). This applies to cards, buttons, and footer links.

**Files:**
- Modify: `src/styles/theme.css:24-25` (shadow tokens)
- Modify: `src/components/home/Hero.astro:145-153` (button hover/active)
- Modify: `src/components/work/ProjectCard.astro:54-57` (card hover)
- Modify: `src/components/blog/PostCard.astro:54-57` (card hover)
- Modify: `src/components/work/CommunityCard.astro:51-54` (card hover)
- Modify: `src/components/layout/Footer.astro:94-99` (footer link hover)

**Design pattern (from neobrutalism.dev):** Default has full shadow. Hover translates element by shadow offset, shadow disappears. Active presses further or scales down slightly.

- [ ] **Step 1: Update shadow tokens in theme.css**

Add a pressed shadow token and increase default shadow slightly for more visual range:

```css
/* In :root */
--shadow-offset: 4px;
--shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--shadow-hard);
--shadow-hover: 2px 2px 0 var(--shadow-hard);  /* was 6px 6px — now reduced for partial press */
```

Remove the old `--shadow-hover: 6px 6px 0 var(--shadow-hard)` and replace with the partial-press value above. This gives a three-stage feel: rest (4px shadow), hover (2px shadow + 2px translate), active (0px shadow + 4px translate).

- [ ] **Step 2: Update button hover/active in Hero.astro**

Replace the current lift-up hover with press-down:

```css
.btn:hover {
  transform: translate(2px, 2px);
  box-shadow: var(--shadow-hover);
}

.btn:active {
  transform: translate(var(--shadow-offset), var(--shadow-offset));
  box-shadow: none;
}
```

- [ ] **Step 3: Update ProjectCard hover**

```css
a.project-card:hover {
  transform: translate(2px, 2px);
  box-shadow: var(--shadow-hover);
}
```

- [ ] **Step 4: Update PostCard hover**

```css
.post-card:hover {
  transform: translate(2px, 2px);
  box-shadow: var(--shadow-hover);
}
```

- [ ] **Step 5: Update CommunityCard hover**

```css
a.community-card:hover {
  transform: translate(2px, 2px);
  box-shadow: var(--shadow-hover);
}
```

- [ ] **Step 6: Update Footer link hover**

Footer links currently lift up _and_ gain a shadow on hover. Reverse to press-down — they already have a shadow at rest via `box-shadow: var(--shadow)` on hover. Change the default to have the shadow, and hover presses it down:

```css
.footer-link {
  /* add box-shadow to default state */
  box-shadow: var(--shadow);
}

.footer-link:hover {
  background-color: var(--accent-primary);
  color: var(--text-on-accent);
  box-shadow: var(--shadow-hover);
  transform: translate(2px, 2px);
}
```

- [ ] **Step 7: Verify in dev server (both themes)**

Run `npm run dev`, check cards, buttons, footer links in both light and dark mode. The hover should feel like pressing the element flat against the surface.

- [ ] **Step 8: Consult Codex on animation feel**

Use the codex-cli MCP tool to get Codex's opinion on whether the 3-stage (rest/hover/active) press-down feels right, or if hover should go all the way to flat (translate full offset, shadow gone). Share the current CSS values.

- [ ] **Step 9: Commit**

```bash
git add src/styles/theme.css src/components/home/Hero.astro src/components/work/ProjectCard.astro src/components/blog/PostCard.astro src/components/work/CommunityCard.astro src/components/layout/Footer.astro
git commit -m "fix: reverse hover effect to press-down pattern (neobrutalism standard)"
```

---

### Task 2: Fix shadow/border colors — eliminate white/light shadows

Yellow and white should never be adjacent. Light grey shadows are too close to white borders. Solution: use `--shadow-hard` (dark) universally for shadows, even in dark mode where it's currently `#d9d3c6` (light). The border color `--border` in dark mode is `#F5F1E8` which reads as near-white. Shadows should always use the dark base color for contrast.

**Files:**
- Modify: `src/styles/theme.css:87-88` (dark mode shadow color)

- [ ] **Step 1: Change dark mode shadow to dark color**

In the `[data-theme="dark"]` block, change:

```css
--shadow-hard: #121212;  /* was #d9d3c6 — dark shadow even on dark bg for contrast */
```

This means dark mode shadows won't be visible against the dark background in the traditional sense, but they'll be visible against card/surface backgrounds (`#262626`, `#303030`) and will maintain the "pressed" metaphor without introducing light-colored shadows that clash with borders.

- [ ] **Step 2: Consult Codex on dark mode shadow approach**

Use the codex-cli MCP tool to ask Codex: "In dark mode neobrutalism, should shadows be dark (invisible against bg but visible on elevated surfaces) or should we use a subtle mid-tone like `#555`? The border is light (#F5F1E8) and we want to avoid light shadows touching yellow accent elements."

- [ ] **Step 3: Verify in dev server**

Toggle between light and dark themes. Check that no yellow element has a white/light shadow or border directly adjacent. Check cards, buttons, featured labels, chips.

- [ ] **Step 4: Commit**

```bash
git add src/styles/theme.css
git commit -m "fix: use dark shadows in both themes to avoid yellow/white adjacency"
```

---

### Task 3: Unify container widths across pages

Current widths: Work = 1200px, Blog = 900px, About = 70ch (~560px). Content jumps when navigating between pages. Pick a single max-width for all page content areas.

**Files:**
- Modify: `src/pages/work.astro:44` (max-width)
- Modify: `src/pages/blog/index.astro:52` (max-width)
- Modify: `src/pages/about.astro:41` (max-width)
- Modify: `src/styles/theme.css` (add shared page-width token)

- [ ] **Step 1: Add a page-width token to theme.css**

```css
/* In :root, after --prose-width */
--page-width: 960px;
```

960px is a good middle ground — wide enough for the work page's two-column grid, narrow enough that blog cards and prose don't stretch uncomfortably.

- [ ] **Step 2: Update work.astro container**

```css
.work-page {
  max-width: var(--page-width);
  margin: 0 auto;
  padding: 0 1.5rem;
}
```

- [ ] **Step 3: Update blog/index.astro container**

```css
.blog-inner {
  max-width: var(--page-width);
  margin: 0 auto;
}
```

- [ ] **Step 4: Update about.astro container**

Keep prose content narrower within the unified container for readability:

```css
.about-inner {
  max-width: var(--page-width);
  margin: 0 auto;
}

.about-prose {
  max-width: var(--prose-width);
}
```

- [ ] **Step 5: Consult Codex on width choice**

Use codex-cli to ask: "Unifying page container width to 960px. Work page has a 2-column grid that currently uses 1200px. Blog has card grid. About has prose. Does 960px work for all, or should we go wider? The header/footer are 1200px."

- [ ] **Step 6: Verify in dev server**

Navigate between Work, Blog, and About pages. Content area should feel consistent — no jump between pages. Check that the work page 2-column grid still works at 960px (it breaks to single column at 900px, so it'll be tight — may need to lower the breakpoint or adjust).

- [ ] **Step 7: Commit**

```bash
git add src/styles/theme.css src/pages/work.astro src/pages/blog/index.astro src/pages/about.astro
git commit -m "fix: unify container widths across pages to eliminate content jumping"
```

---

### Task 4: Simplify homepage CTAs — remove "Read full story" link

Move the about-page mention into the bio paragraph text. Keep only two CTA buttons: "View Work" and "Get in Touch" (or whatever the CMS values are).

**Files:**
- Modify: `src/components/home/Hero.astro:25-27` (remove read-more link)
- Modify: `src/components/home/Hero.astro:170-186` (remove read-more CSS)
- Modify: CMS content `src/content/homepage/index.json` (update bio text to include about mention)

- [ ] **Step 1: Remove the "Read full story" link from Hero.astro template**

Remove lines 25-27:

```astro
          <a href="/about" class="hero-read-more">
            Read full story &rarr;
          </a>
```

- [ ] **Step 2: Remove the `.hero-read-more` CSS rules**

Remove the entire `.hero-read-more` and `.hero-read-more:hover` and `.hero-read-more:focus-visible` style blocks (lines 170-186).

- [ ] **Step 3: Update homepage CMS content to weave in the about link**

Read `src/content/homepage/index.json` and update the `bioText` field to naturally mention the about page. The exact wording depends on current content — the bio should end with something like "Learn more about me and my work on the about page." (This is a content decision — consult Codex.)

- [ ] **Step 4: Consult Codex on bio text wording**

Use codex-cli to share the current bioText and ask for a natural way to incorporate the about page link into the paragraph. Note: since this is a plain text field (not HTML), we may need to handle this differently — either make it a link in the template or keep it as plain text directing users to click "About" in the nav.

- [ ] **Step 5: Verify in dev server**

Check the hero section — should have exactly two CTA buttons, no trailing text link.

- [ ] **Step 6: Commit**

```bash
git add src/components/home/Hero.astro src/content/homepage/index.json
git commit -m "fix: simplify hero CTAs to two buttons, move about link into bio text"
```

---

### Task 5: Reduce border heaviness — thin borders selectively

Borders are part of the neobrutalism identity, but not everything needs them. Reduce border-width from 3px to 2px globally, and remove the full-width border from the credibility strip.

**Files:**
- Modify: `src/styles/theme.css:39` (border-width token)
- Modify: `src/components/home/CredibilityStrip.astro:49` (remove bottom border)
- Modify: `src/components/home/Hero.astro:42` (remove hero bottom border)

- [ ] **Step 1: Consult Codex on border width**

Use codex-cli: "Currently using 3px borders everywhere (neobrutalism). Feedback says too border-heavy. Options: (A) reduce to 2px globally, (B) keep 3px on cards/buttons but 2px on section dividers, (C) remove section divider borders entirely and only border interactive elements. Which approach best maintains neobrutalism while being less heavy?"

- [ ] **Step 2: Apply the chosen border approach**

Based on Codex feedback, update `--border-width` in theme.css and/or selectively remove borders from non-interactive elements. At minimum:

Remove the credibility strip bottom border:
```css
.credibility-strip {
  background-color: var(--surface-subtle);
  /* removed: border-bottom */
}
```

Remove the hero section bottom border:
```css
.hero {
  /* removed: border-bottom */
  background-color: var(--bg);
}
```

- [ ] **Step 3: Verify in dev server**

Check the homepage flow — hero → credibility strip → footer. The sections should feel visually separated by spacing and background color without heavy border lines between every section.

- [ ] **Step 4: Commit**

```bash
git add src/styles/theme.css src/components/home/CredibilityStrip.astro src/components/home/Hero.astro
git commit -m "fix: reduce border heaviness — remove section divider borders, thin borders"
```

---

### Task 6: Fix nav hover glitch

The nav hover glitch when moving between items is caused by the transparent-to-visible border transition on `.nav-link`. When hovering from an active item (which has `border-color: var(--border)`) to an adjacent non-active item, the border appearance causes a layout shift because `transparent` borders still take space but the visual change + background change creates a perceived glitch.

**Files:**
- Modify: `src/components/layout/Header.astro:114-138` (nav link styles)

- [ ] **Step 1: Diagnose the glitch**

The issue: `.nav-link` has `border: var(--border-width) solid transparent` and on hover changes to `border-color: var(--border)`. The transition property list (`background-color 0.1s, color 0.1s`) does NOT include `border-color`, so the border snaps instantly while the background transitions smoothly — this creates the visual glitch.

- [ ] **Step 2: Fix by adding border-color to transition OR removing hover borders**

Option A — add border-color to transition:
```css
.nav-link {
  transition: background-color 0.1s, color 0.1s, border-color 0.1s;
}
```

Option B — remove hover borders entirely, just use background:
```css
.nav-link:hover:not(.nav-link--active) {
  background-color: var(--muted);
  /* removed: border-color change */
}
```

Start with Option A. If the glitch persists, try Option B.

- [ ] **Step 3: Also add box-shadow transition to active state**

The active nav link has `box-shadow: 2px 2px 0 var(--border)` which also snaps when navigating. Add `box-shadow` to the transition:

```css
.nav-link {
  transition: background-color 0.1s, color 0.1s, border-color 0.1s, box-shadow 0.1s;
}
```

- [ ] **Step 4: Verify in dev server**

Hover back and forth between nav items, especially around the active item. The transition should be smooth with no visual jumping.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Header.astro
git commit -m "fix: smooth nav hover transition to eliminate glitch between items"
```

---

### Task 7: Add "Available for Hire" callout on homepage

Needs to fit the neobrutalism aesthetic. A small callout/banner above or below the hero CTAs, or as a distinct element between hero and credibility strip.

**Files:**
- Modify: `src/components/home/Hero.astro` (add callout element)
- Modify: `src/pages/index.astro` (if callout goes outside hero)

- [ ] **Step 1: Consult Codex on callout placement and design**

Use codex-cli: "Adding an 'Available for Hire' callout to the homepage. The hero has: heading, tagline, bio paragraph, two CTA buttons (View Work, Get in Touch), and a photo. Below the hero is a credibility strip. Options: (A) inline chip/badge next to the tagline, (B) small banner between hero and credibility strip, (C) accent-colored callout box below the CTAs within the hero section. Which fits best in a neobrutalist design? Share specific CSS approach."

- [ ] **Step 2: Implement the callout**

Based on Codex feedback, add the element. A likely approach — a chip-style badge near the tagline:

```astro
<p class="hero-tagline">
  {homepage?.tagline}
  <span class="hire-badge">Available for Hire</span>
</p>
```

```css
.hire-badge {
  display: inline-block;
  font-family: var(--font-retro);
  font-size: 0.625rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background-color: var(--success);
  color: #fff;
  border: var(--border-width) solid var(--border);
  padding: 0.25rem 0.5rem;
  margin-left: 0.75rem;
  vertical-align: middle;
  box-shadow: 2px 2px 0 var(--shadow-hard);
}
```

- [ ] **Step 3: Verify in dev server**

Check both themes, desktop and mobile layout. The badge should feel natural, not forced.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/Hero.astro
git commit -m "feat: add 'Available for Hire' callout badge on homepage"
```

---

### Task 8: Homepage entrance animation

Subtle entrance animation for hero content that fits the neobrutalism aesthetic. None of the reference design systems use entrance animations — they load statically. A simple slide-up + fade is safe and doesn't conflict with the design language.

**Files:**
- Modify: `src/components/home/Hero.astro` (add animation CSS and classes)

- [ ] **Step 1: Consult Codex on animation style**

Use codex-cli: "Adding a homepage entrance animation for the hero section in a neobrutalism design. The site uses hard shadows, thick borders, bold colors. Options: (A) simple fade-in + slide-up, staggered across heading/tagline/bio/CTAs, (B) typewriter effect on heading with elements appearing after, (C) elements slide in from the left with the hard shadow appearing separately. Which fits the aesthetic best? Keep it subtle — neobrutalism reference sites don't animate at all."

- [ ] **Step 2: Implement entrance animation**

A likely approach — staggered fade-up with `@keyframes` and `animation-delay`, respecting `prefers-reduced-motion`:

```css
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-heading,
.hero-tagline,
.hero-bio,
.hero-ctas,
.hero-photo {
  animation: fade-up 0.4s ease-out both;
}

.hero-heading { animation-delay: 0s; }
.hero-tagline { animation-delay: 0.05s; }
.hero-bio { animation-delay: 0.1s; }
.hero-ctas { animation-delay: 0.15s; }
.hero-photo { animation-delay: 0.1s; }

@media (prefers-reduced-motion: reduce) {
  .hero-heading,
  .hero-tagline,
  .hero-bio,
  .hero-ctas,
  .hero-photo {
    animation: none;
  }
}
```

- [ ] **Step 3: Verify in dev server**

Reload homepage. Elements should stagger in quickly (total ~0.5s). Check that `prefers-reduced-motion` disables it. Check that it doesn't feel out of place with the hard-edge aesthetic.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/Hero.astro
git commit -m "feat: add staggered entrance animation to homepage hero"
```

---

### Task 9: Footer "Get in Touch" scroll indicator

When someone clicks "Get in Touch" on the homepage (which links to the footer's contact section), add a visual indicator that draws attention to the contact elements.

**Files:**
- Modify: `src/components/home/Hero.astro` (update CTA href to `#footer` or contact anchor)
- Modify: `src/components/layout/Footer.astro` (add highlight animation)
- Modify: `src/components/layout/BaseLayout.astro` (add scroll behavior CSS)

- [ ] **Step 1: Check current "Get in Touch" CTA href**

Read `src/content/homepage/index.json` to see what URL the secondary CTA points to. If it doesn't point to `#footer`, update the CMS content or template.

- [ ] **Step 2: Add smooth scroll to BaseLayout**

```css
/* Add to global.css or BaseLayout */
html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

- [ ] **Step 3: Add a highlight animation to Footer.astro**

When the footer is scrolled to via hash link, pulse the contact links briefly:

```css
@keyframes contact-pulse {
  0%, 100% { box-shadow: var(--shadow); }
  50% { box-shadow: 0 0 0 3px var(--accent-primary), var(--shadow); }
}

.footer-contact:target .footer-link,
.footer-link.highlight {
  animation: contact-pulse 0.6s ease-in-out 2;
}
```

- [ ] **Step 4: Add a small script to trigger the highlight**

Since `:target` works on the element with the matching ID, add an ID to the contact section and use a script to apply the class on hash navigation:

```astro
<div class="footer-contact" id="contact">
```

```html
<script>
  if (window.location.hash === '#contact') {
    document.querySelectorAll('#contact .footer-link').forEach(el => {
      el.classList.add('highlight');
      el.addEventListener('animationend', () => el.classList.remove('highlight'), { once: true });
    });
  }
</script>
```

Update the homepage CTA's URL in the CMS to point to `#contact` (or hardcode it in the template if the CMS URL is different).

- [ ] **Step 5: Verify in dev server**

Click "Get in Touch" on the homepage. Page should smooth-scroll to footer, and the email/call links should pulse briefly with the accent color.

- [ ] **Step 6: Commit**

```bash
git add src/components/home/Hero.astro src/components/layout/Footer.astro src/components/layout/BaseLayout.astro src/styles/global.css
git commit -m "feat: add smooth scroll + highlight indicator for Get in Touch CTA"
```

---

## Execution Order

Tasks 1-6 are fixes addressing direct feedback — do these first. Tasks 7-9 are enhancements — do these after.

Recommended order:
1. **Task 3** (container widths) — quick structural fix
2. **Task 2** (shadow colors) — affects all other visual changes
3. **Task 1** (hover reversal) — biggest visual change, depends on shadow tokens from Task 2
4. **Task 5** (border reduction) — complements Tasks 1-2
5. **Task 4** (simplify CTAs) — quick template change
6. **Task 6** (nav glitch) — independent CSS fix
7. **Task 7** (hire callout) — new element
8. **Task 8** (homepage animation) — polish
9. **Task 9** (footer indicator) — polish
