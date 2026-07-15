// Portföy öğeleri — koleksiyon DEĞİL, tek tip-güvenli dosya (SPEC §3.2).
// Dizi boşsa ana sayfadaki portföy bölümü HİÇ render olmaz (başlık bile çıkmaz).
// Placeholder/"Yakında" yok — gerçek proje geldikçe buraya eklenir.

export type PortfoyOgesi = {
  title: string;
  description: string;
  url?: string;
};

export const portfoy: PortfoyOgesi[] = [];
