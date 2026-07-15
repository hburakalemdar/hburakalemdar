import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { tumYazilar } from '../lib/yazilar';

// Tek besleme: tüm yazılar (draft'lar hariç), yeni → eski. Kategori beslemesi yok.
export async function GET(context: APIContext) {
  const yazilar = await tumYazilar();
  return rss({
    title: 'hburakalemdar.com',
    description: 'Burak Halit Alemdar — gezi ve teknik yazılar.',
    site: context.site ?? 'https://hburakalemdar.com',
    items: yazilar.map((yazi) => ({
      title: yazi.data.title,
      description: yazi.data.description,
      pubDate: yazi.data.date,
      categories: [yazi.data.category],
      link: `/yazi/${yazi.data.permalink}/`,
    })),
    customData: '<language>tr-TR</language>',
  });
}
