# ryanmcgovern.dev

Personal portfolio and developer site for Ryan McGovern. Built with Astro and managed through Keystatic CMS.

## Stack

- [Astro 7](https://astro.build) — static site generator
- [Keystatic](https://keystatic.com) — content management (GitHub storage mode)
- [Markdoc](https://markdoc.dev) — content authoring format
- [React](https://react.dev) — interactive components
- [Netlify](https://netlify.com) — hosting and deployment

## Pages

| Route | Description |
| :--- | :--- |
| `/` | Homepage |
| `/work` | Experience timeline and projects |
| `/blog` | Blog index and posts |
| `/about` | About page |
| `/now` | What I'm up to right now |
| `/uses` | Tools and setup |
| `/ai` | AI usage transparency |
| `/keystatic` | CMS admin interface |

## Project Structure

```
src/
├── components/     # Astro and React components
├── content/        # Keystatic-managed content (JSON, Markdoc)
├── lib/            # Utilities (Keystatic reader, helpers)
├── pages/          # File-based routing
└── styles/         # Global styles and design tokens
keystatic.config.ts # CMS schema and configuration
```

## Draft previews

Draft posts stay out of `/blog`, normal post routes, and RSS. To create an unlisted preview, keep the post marked as a draft and add a `Preview key` in Keystatic using at least 16 URL-safe letters, numbers, hyphens, or underscores.

After the site deploys, share:

```text
/preview/blog/<preview-key>/<post-slug>
```

Preview pages include `noindex, nofollow` and a visible unpublished banner. Clearing the draft checkbox removes the preview route and publishes the normal post route on the next build.

## Development

```sh
pnpm install       # Install dependencies
pnpm dev           # Start dev server at localhost:4321
pnpm build         # Production build to ./dist/
pnpm preview       # Preview production build locally
```
