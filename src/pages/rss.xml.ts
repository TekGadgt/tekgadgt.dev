import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { reader } from '../lib/reader';

export async function GET(context: APIContext) {
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
