# PROGRESS — ne bitti, ne sırada

Durum kaynağı burası (CLAUDE.md "Durum dosyada"). Her adım bitiminde güncellenir.

## Özet

Astro (statik) iskelesi kuruldu ve `npm run build` **hatasız geçiyor**. SPEC.md
§1–§12 kabul kriterlerinin tümü karşılanıyor. Site GitHub Pages'e deploy edilmeye
hazır; sadece DNS ve GitHub Pages ayarları insan eliyle bekliyor (`BLOCKED.md`).

## Build / komutlar

```
npm install      # bağımlılıklar
npm run dev      # yerel geliştirme
npm run build    # dist/ üretir — DOĞRULAMA komutu
npm run preview  # build çıktısını yerelde sun
```

Son build: 8 sayfa + rss.xml + sitemap, ~0.7 sn, hatasız.

## Bitti

- [x] Git: remote bağlı (origin), main push'lu.
- [x] Stack kuruldu: Astro 5 statik, `@astrojs/sitemap`, `@astrojs/rss`, `sharp`.
- [x] `astro.config.mjs`: `site`, `output:'static'`, sitemap entegrasyonu.
- [x] Content collection `yazilar` (glob loader, Zod şema): `title/date/category
      (enum gezi|teknik)/description/permalink (ASCII regex)/cover?/draft`.
- [x] Draft filtresi (`import.meta.env.PROD`) + permalink tekillik kontrolü
      (`src/lib/yazilar.ts` — çakışmada build hatası).
- [x] Türkçe tarih biçimi (`src/lib/tarih.ts`, `15 Temmuz 2026`, Europe/Istanbul).
- [x] Layout `Base.astro`: `<html lang=tr>`, meta/description, Open Graph,
      RSS keşif linki, sitemap linki, font preload, üst nav + alt footer.
- [x] Bileşenler: `KategoriEtiket`, `YaziSatir`.
- [x] Sayfalar: `/`, `/yazilar`, `/yazi/[permalink]`, `/kategori/[kategori]`
      (gezi|teknik), `/hakkinda`, `/rss.xml`, `/404`.
- [x] Ana sayfa: bio + son 10 yazı + koşullu portföy bölümü (boş dizide render yok).
- [x] Portföy: `src/data/portfoy.ts` (tip-güvenli, şu an BOŞ → bölüm çıkmıyor).
- [x] Hakkında: e-posta HTML-entity obfüskasyon (JS'siz çalışır), GitHub, LinkedIn.
- [x] Self-host font: Source Serif 4 (latin + latin-ext woff2, `public/fonts/`),
      `@font-face` + `font-display:swap`, latin-400 preload.
- [x] **Türkçe glif doğrulaması:** fonttools ile cmap kontrolü — regular/bold/
      italic birleşik kapsam TAM (ğ Ğ ş Ş ı İ ç Ç ö Ö ü Ü). Bkz. DECISIONS.
- [x] Kod blokları: Astro dahili Shiki (`astro-code` class doğrulandı) + sistem
      monospace yığını.
- [x] Örnek yapı-testi yazıları: `ornek-gezi` (gezi), `ornek-teknik` (teknik) —
      kendini "yapı testi" ilan eder, uydurma içerik yok.
- [x] Deploy: `.github/workflows/deploy.yml` (npm ci + build → Pages), `public/CNAME`
      = hburakalemdar.com, `public/robots.txt` + sitemap linki.
- [x] Doğrulama: build çıktısı, RSS geçerli XML (tr-TR), kategori filtreleri izole,
      portföy boş→gizli, sitemap draft'sız.

## Sırada / açık

- [ ] **BLOCKED (insan):** DNS geçişi + GitHub Settings→Pages custom domain +
      Enforce HTTPS. Detay `BLOCKED.md`. Agent yapmaz.
- [ ] Gerçek içerik: ilk gerçek gezi/teknik yazısı.
- [ ] **TODO — örnek yazıları sil:** İlk gerçek gezi yazısı gelince
      `src/content/yazilar/ornek-gezi/` silinecek; ilk gerçek teknik yazısı gelince
      `src/content/yazilar/ornek-teknik/` silinecek (SPEC §3.5, geçici yapı testi).
- [ ] Portföy: gerçek proje çıktıkça `src/data/portfoy.ts`'e eklenir.
- [ ] Tasarım ince ayarı (kullanıcıyla birlikte — şimdilik iskele, SPEC §7).

## Değişen/eklenen dosyalar (bu tur)

```
package.json, package-lock.json, astro.config.mjs, tsconfig.json, .gitignore
src/content.config.ts
src/data/portfoy.ts
src/lib/{yazilar,tarih}.ts
src/styles/global.css
src/layouts/Base.astro
src/components/{KategoriEtiket,YaziSatir}.astro
src/pages/{index,yazilar,hakkinda,404}.astro
src/pages/yazi/[permalink].astro
src/pages/kategori/[kategori].astro
src/pages/rss.xml.ts
src/content/yazilar/ornek-gezi/index.md
src/content/yazilar/ornek-teknik/index.md
public/CNAME, public/robots.txt
public/fonts/source-serif-4-*.woff2  (6 dosya: latin+latin-ext × 400/700/italic)
.github/workflows/deploy.yml
```
