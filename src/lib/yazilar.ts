import { getCollection, type CollectionEntry } from 'astro:content';

export type Yazi = CollectionEntry<'yazilar'>;

// Production build'de draft'lar çıktıya girmez (SPEC §3.4). Dev'de görünür.
function yayindaMi(yazi: Yazi): boolean {
  return import.meta.env.PROD ? yazi.data.draft !== true : true;
}

// Tüm yayınlanacak yazılar, yeni → eski sıralı. Ayrıca permalink tekilliğini
// build sırasında zorlar: çakışma varsa açık hata fırlatır (SPEC §9).
export async function tumYazilar(): Promise<Yazi[]> {
  const yazilar = (await getCollection('yazilar')).filter(yayindaMi);

  const gorulen = new Map<string, string>();
  for (const yazi of yazilar) {
    const p = yazi.data.permalink;
    if (gorulen.has(p)) {
      throw new Error(
        `permalink çakışması: "${p}" hem "${gorulen.get(p)}" hem "${yazi.id}" tarafından kullanılıyor.`,
      );
    }
    gorulen.set(p, yazi.id);
  }

  return yazilar.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
}

export async function kategoriYazilari(
  kategori: 'gezi' | 'teknik',
): Promise<Yazi[]> {
  return (await tumYazilar()).filter((y) => y.data.category === kategori);
}
