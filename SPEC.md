# SPEC — hburakalemdar.com

Kişisel site: gezi ve teknik yazılar (tek akış, kategoriyle ayrılır), küçük bir
portföy, kısa bir hakkında/iletişim sayfası. İçerik Türkçe. Sade, minimal, resmi
tipografi.

Bu dosya **ne** yapılacağını söyler. **Nasıl** çalışılacağı `CLAUDE.md`'de.
Verilen her karar burada nettir; cevapsız soru bırakılmadı. SPEC bir konuda
sessizse en makul yorumu seç, gerekçeni `DECISIONS.md`'ye yaz, devam et.

---

## 1. Stack

- **Astro** (statik çıktı, `output: 'static'`). Varsayılan sıfır client JS.
- İçerik: **Astro Content Collections** (tip güvenli markdown/MDX).
- Kod bloğu vurgulama: Astro'nun dahili **Shiki**'si (teknik yazılar için).
- Görsel optimizasyonu: **`astro:assets`** (`<Image />`) — build'de webp + boyut.
- Sitemap: `@astrojs/sitemap`. RSS: `@astrojs/rss`.
- Node tabanlı; `package.json` + `package-lock.json` commit'lenir.
- Yeni bağımlılık eklemeden önce CLAUDE.md kuralı geçerli: gerçekten gerekli mi
  diye düşün, gerekiyorsa ekle ve `DECISIONS.md`'ye yaz.

Build/geliştirme komutları (kurulunca doğrulanacak):

```
npm install
npm run dev      # yerel geliştirme
npm run build    # dist/ üretir
npm run preview  # build çıktısını yerelde sun
```

**Doğrulama:** her anlamlı adımda `npm run build` geçmeli. Başarı iddiası değil,
komut + çıktı gösterilir (CLAUDE.md "Doğrulama").

---

## 2. Dil ve yerelleştirme

- **Sadece Türkçe.** i18n altyapısı yok. `<html lang="tr">`.
- Tarih formatı Türkçe: `15 Temmuz 2026` (ay adı Türkçe). Timezone Europe/Istanbul.
- Türkçe karakterler (ğ ş ı İ ç ö ü) her yerde eksiksiz — font seçimi §7'de
  doğrulanacak. Bu projenin en sık hatası; font koymadan önce glif kontrolü şart.

---

## 3. İçerik modeli

### 3.1 Yazılar (gezi + teknik, TEK AKIŞ)

Gezi ve teknik yazılar **ayrı blog gibi durmaz**. Tek koleksiyon, tek akış;
kategori sadece bir etiket/filtredir.

- Koleksiyon: `src/content/yazilar/`
- Her yazı bir **klasör** (görsel yan yana dursun diye):
  ```
  src/content/yazilar/kis-gezisi/
    index.md          # veya index.mdx
    kapak.jpg         # opsiyonel kapak
    foto-1.jpg        # yazı içi görseller
  ```
- Görseller markdown'ın yanındaki klasörde; `astro:assets` ile build'de
  webp'e çevrilir, boyutlandırılır, `loading="lazy"` uygulanır.

**Front-matter şeması** (Zod ile `src/content/config.ts`):

| Alan          | Tip                      | Zorunlu | Not                                             |
|---------------|--------------------------|---------|-------------------------------------------------|
| `title`       | string                   | ✓       | Yazı başlığı                                    |
| `date`        | date                     | ✓       | Yayın tarihi, sıralama buna göre (yeni → eski)  |
| `category`    | enum: `gezi` \| `teknik` | ✓       | **Şema başka değer kabul etmez** (build hatası) |
| `description` | string                   | ✓       | Liste kartında ve `<meta description>`'da       |
| `slug`        | string                   | ✓       | **Elle yazılır**, ASCII, tire-ayraç (§4)        |
| `cover`       | image                    | —       | Opsiyonel kapak görseli                         |
| `draft`       | boolean (varsayılan `false`) | —   | `true` ise **build'e girmez** (§3.4)            |

- `tags` (serbest etiket) **YOK**. Taksonomi sadece `category`.
- `slug` front-matter'da zorunlu ve elle verilir; klasör adından türetilmez.
  (Klasör adı ile slug tutarlı tutulması önerilir ama şart değil.)

### 3.2 Portföy

- Koleksiyon: `src/content/portfoy/` (her öğe bir `.md`).
- Şema:

| Alan          | Tip    | Zorunlu | Not                                  |
|---------------|--------|---------|--------------------------------------|
| `title`       | string | ✓       | Proje adı                            |
| `description` | string | ✓       | Kısa açıklama                        |
| `url`         | string | —       | Repo veya canlı link (opsiyonel)     |
| `order`       | number | —       | Manuel sıralama (opsiyonel)          |

- **Yıl ve teknoloji etiketi YOK.**
- Gerçek proje yoksa bölüm **boş başlar** — placeholder/lorem koyma.
  Boşken sayfa "Yakında" yerine sadece başlık + boş liste gösterir.

### 3.3 Hakkında / İletişim

Tek statik sayfa (`/hakkinda`). Kısa bio + bağlantılar:

- **E-posta:** `halit@hburakalemdar.com` (Gmail KULLANILMAZ). `mailto:` linki,
  bot'lara karşı hafif obfüskasyon (ör. JS/entity ile birleştirme veya
  `at`/`nokta` yazımı — sayfa yine de JS'siz çalışmalı, entity yöntemi tercih).
- **GitHub:** https://github.com/hburakalemdar
- **LinkedIn:** https://www.linkedin.com/in/burak-halit-alemdar-a59306297/
- X/Twitter **yok**.

Bio metni gerçek içerik gelene kadar tek-iki cümlelik gerçek bir özet olabilir;
lorem ipsum koyma. Metin belirsizse `BLOCKED.md`/`IDEAS.md` yerine kısa, dürüst
bir yer tutucu-olmayan cümle yaz ve `DECISIONS.md`'ye not düş.

### 3.4 Taslaklar

- `draft: true` olan yazı build çıktısına **girmez** (production'da yok).
- Geliştirmede (`npm run dev`) görünür olabilir; production build'de filtrelenir.
  Content query'lerinde `import.meta.env.PROD` ile filtre uygulanır.

---

## 4. URL yapısı ve slug'lar

| Yol                  | İçerik                                              |
|----------------------|-----------------------------------------------------|
| `/`                  | Ana sayfa: kısa bio + son yazılar (§5)              |
| `/yazi/{slug}`       | Tekil yazı (gezi ve teknik ortak namespace)         |
| `/yazilar`           | Tüm yazılar arşivi (yeni → eski, kategori etiketli) |
| `/kategori/gezi`     | Sadece gezi yazıları (filtre)                       |
| `/kategori/teknik`   | Sadece teknik yazıları (filtre)                     |
| `/portfoy`           | Portföy listesi                                     |
| `/hakkinda`          | Hakkında / iletişim                                 |
| `/rss.xml`           | Tek RSS beslemesi (§6)                              |
| `/404`               | Türkçe 404 sayfası                                  |

**Slug kuralları:**

- Sadece ASCII: küçük harf, rakam, tire (`a-z0-9-`). Türkçe karakter **yok**.
- Elle yazılır (front-matter `slug`). Ör: `Kış Gezisi` → `slug: kis-gezisi`.
- Kategori URL'de yer **almaz** (tek akış felsefesi); sadece filtre sayfası var.

---

## 5. Ana sayfa (`/`)

- Üstte **kısa bio** (1-2 cümle, kim olduğu).
- Altında **son yazılar** listesi (karışık, her satırda kategori etiketi:
  `[gezi]` / `[teknik]`). Son ~10 yazı; altında `/yazilar`'a "Tüm yazılar" linki.
- Landing/kart ızgarası YOK (ayrı blog hissi vermemek için).

---

## 6. RSS

- **Tek besleme:** `/rss.xml`, tüm yazılar (draft'lar hariç), yeni → eski.
- `<head>`'de otomatik keşif linki her sayfada:
  ```html
  <link rel="alternate" type="application/rss+xml" title="hburakalemdar.com" href="/rss.xml">
  ```
- Kategori bazlı ayrı besleme **yok**.

---

## 7. Tasarım ve tipografi

Yön: **sade, minimal, resmi tipografi.** Süs yok, renk kıt, boşluk bol.
Detay sonra beraber oturtulacak — şimdilik iskele; güzelleştirmeye takılma.

- **Self-host serif** (başlık + gövde tek serif ailesi). Dış font isteği YOK
  (gizlilik; Google Fonts vb. dış çağrı yapılmaz). Fontlar repoda woff2 olarak.
- Font seçim kriteri: **Türkçe glif kapsamı tam** (ğ ş ı İ ç ö ü — özellikle
  noktasız `ı` ve noktalı büyük `İ`). Aday: **Source Serif 4** (Türkçe kapsamı
  doğrulanmış, açık lisans). Seçim koymadan önce glif kontrolü yapılır ve
  `DECISIONS.md`'ye yazılır.
- Sadece kullanılan ağırlıklar (regular + italic + bold) alınır; alt küme
  yapılabilir. Dosyalar `public/fonts/` altında; `@font-face` ile
  `font-display: swap`.
- Kod blokları (teknik yazılar): **sistem monospace** yığını
  (`ui-monospace, SFMono-Regular, Menlo, monospace`) — ekstra font yükü yok.
- Dark mode **YOK** (CLAUDE.md).

---

## 8. Deploy

- **GitHub Pages**, `hburakalemdar/hburakalemdar` reposundan.
- **GitHub Actions** workflow (`.github/workflows/deploy.yml`):
  `npm ci && npm run build` → `dist/` → Pages'e deploy (`actions/deploy-pages`).
- Custom domain: `hburakalemdar.com`. `public/CNAME` içinde tek satır domain.
- **DNS'e DOKUNMA.** DNS/domain ayarları geri alınamaz/harici — CLAUDE.md gereği
  yasak. Gerekliyse `BLOCKED.md`'ye yaz. (Repo CNAME dosyası konur ama DNS
  kayıtlarını kullanıcı yönetir.)
- Astro `site: 'https://hburakalemdar.com'`, `base: '/'` (kök domain, user-repo
  olsa da custom domain kökten sunar).

---

## 9. Edge case'ler ve kararlar

- **Kategori enum ihlali:** `category` yalnız `gezi`/`teknik`; şema başka değere
  build'i patlatır (sessizce geçmez).
- **Slug çakışması:** iki yazı aynı slug'ı alırsa build hata versin (Astro
  content collection zaten uyarır; ayrıca gözden geçir).
- **Görsel yok:** `cover` opsiyonel; yoksa kart/başlık görselsiz render olur,
  boş `<img>` bırakılmaz.
- **Boş bölüm:** portföy/yazı yoksa liste boş render; "Yakında"/placeholder yok.
- **404:** Türkçe, siteye dönüş linki olan sade sayfa.
- **Sitemap:** `@astrojs/sitemap` ile otomatik; draft'lar hariç.
- **SEO/meta:** her sayfada `<title>`, `<meta description>`; yazılarda
  `description` alanından. Open Graph temel etiketler (title/description/type)
  — süs değil, paylaşımda düzgün görünsün diye. Paylaş **butonu** yok (bu ayrı).
- **Sayfalama:** başta tüm yazılar tek listede. Yazı sayısı artarsa sayfalama
  `IDEAS.md`'ye; şimdilik yok.
- **Erişilebilirlik:** anlamlı `alt` metinleri, yeterli kontrast, semantik HTML.

---

## 10. Kapsam DIŞI (YAPMA)

CLAUDE.md "Yapma" listesi bağlayıcı:

- Dark mode, yorum sistemi, newsletter, paylaş butonu.
- Placeholder / lorem ipsum. Gerçek içerik yoksa boş bırak.
- Analytics / izleme / dış font çağrısı.
- Panel / CMS / veritabanı. Yazı = bir dosya yaz + push.
- Serbest etiket (tags) taksonomisi, çoklu dil, kategori RSS'leri, sayfalama
  (şimdilik). Bunlar akla gelirse `IDEAS.md`'ye.
- SPEC'te olmayan kapsam genişletmesi. Fikir → `IDEAS.md`.

---

## 11. Dizin yapısı (hedef)

```
.
├── astro.config.mjs
├── package.json
├── src/
│   ├── content/
│   │   ├── config.ts          # yazilar + portfoy şemaları (Zod)
│   │   ├── yazilar/
│   │   │   └── {slug}/index.md (+ görseller)
│   │   └── portfoy/
│   │       └── {proje}.md
│   ├── layouts/
│   │   └── Base.astro          # <html lang=tr>, head, RSS link, font
│   ├── components/             # YaziKart, KategoriEtiket vb.
│   ├── pages/
│   │   ├── index.astro         # bio + son yazılar
│   │   ├── yazilar.astro       # tüm arşiv
│   │   ├── yazi/[slug].astro
│   │   ├── kategori/[kategori].astro
│   │   ├── portfoy.astro
│   │   ├── hakkinda.astro
│   │   ├── rss.xml.ts
│   │   └── 404.astro
│   └── styles/
├── public/
│   ├── CNAME                   # hburakalemdar.com
│   └── fonts/                  # self-host serif woff2
└── .github/workflows/deploy.yml
```

---

## 12. Bitince ne "bitti" sayılır (kabul kriterleri)

1. `npm run build` hatasız geçer (çıktı gösterilir).
2. `/`, `/yazilar`, `/yazi/{slug}`, `/kategori/gezi`, `/kategori/teknik`,
   `/portfoy`, `/hakkinda`, `/rss.xml`, `/404` render olur.
3. En az bir gerçek gezi ve bir gerçek teknik yazı ile akış görünür (lorem yok;
   gerçek içerik yoksa yapı doğrulaması için en az iskelet + gerçek kısa metin).
4. Türkçe karakterler seçilen fontta eksiksiz görünür (görsel doğrulama).
5. RSS geçerli XML; `<head>`'de keşif linki var.
6. GitHub Actions ile Pages deploy pipeline'ı kurulu; CNAME yerinde.
7. `PROGRESS.md` ve `DECISIONS.md` güncel.
