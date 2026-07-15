import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Tek akış: gezi + teknik yazılar aynı koleksiyonda; kategori sadece filtre.
// URL alanı `slug`/`id` DEĞİL `permalink` (Astro rezerve alan çakışması — SPEC §3.1).
const yazilar = defineCollection({
  loader: glob({ pattern: '**/index.{md,mdx}', base: './src/content/yazilar' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      category: z.enum(['gezi', 'teknik']),
      description: z.string(),
      // Elle yazılır, ASCII, tire-ayraç. URL'i belirler.
      permalink: z
        .string()
        .regex(/^[a-z0-9-]+$/, 'permalink sadece a-z, 0-9 ve tire içerebilir'),
      cover: image().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { yazilar };
