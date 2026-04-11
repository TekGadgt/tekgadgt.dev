# ryanmcgovern.dev

Personal portfolio and developer site for Ryan McGovern. Built with Astro and managed through Keystatic CMS.

## Stack

- [Astro 6](https://astro.build) — static site generator
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

## Development

```sh
npm install        # Install dependencies
npm run dev        # Start dev server at localhost:4321
npm run build      # Production build to ./dist/
npm run preview    # Preview production build locally
```
