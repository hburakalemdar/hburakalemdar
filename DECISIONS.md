# DECISIONS — teknik kararlar + gerekçe

Her satır: karar + tek cümle gerekçe. "Neden böyle" sorusunun cevabı burada.
Detaylı gereksinim `SPEC.md`'de.

## 2026-07-15 — İlk SPEC turu

- **Stack: Astro (statik).** İçerik sitesi için olgun, varsayılan sıfır client
  JS, tip güvenli content collections; kullanıcı Astro'yu seçti.
- **Deploy: GitHub Pages + Actions.** Repo zaten `hburakalemdar/hburakalemdar`;
  ek hesap gerekmez, custom domain CNAME ile bağlanır.
- **Sadece Türkçe, i18n yok.** İçerik Türkçe; çok dillilik ihtiyacı yok,
  gereksiz karmaşayı ekarte ettik.
- **Gezi + teknik tek akış, `category` sadece filtre.** Kullanıcı açıkça "ayrı
  blog gibi durmasın" dedi; URL'de kategori yok (`/yazi/...`), filtre
  `/kategori/...`.
- **`category` enum = gezi|teknik (Zod).** Yanlış kategori sessizce geçmesin,
  build'i patlatsın.
- **Slug elle yazılır, ASCII.** Türkçe karakterli URL kopyalanınca %-encode olup
  çirkinleşiyor; okunur/paylaşılır URL için translit edilmiş ASCII.
- **Görseller yazı klasöründe + `astro:assets`.** Foto'lu gezi yazıları için
  build-time webp/boyut/lazy en iyi sonucu verir.
- **RSS: tek `/rss.xml` + head'de keşif linki.** Tek akış felsefesiyle uyumlu;
  kategori beslemeleri küçük site için fazla.
- **Ana sayfa: kısa bio + son yazılar.** Kişisel site için sıcak giriş; landing/
  kart ızgarası "ayrı blog" hissi verdiği için elendi.
- **Metadata: date/category/description zorunlu, cover opsiyonel, tags yok.**
  Küçük sitede serbest etiket taksonomisi fazla; `category` yeterli.
- **`draft: true` production build'e girmez.** Yarım yazılar yayına sızmasın.
- **Tipografi: self-host serif (aday Source Serif 4).** Resmi/edebi his; dış font
  çağrısı gizlilik (analytics-benzeri istek) nedeniyle istenmiyor, fontlar
  repoda. Türkçe glif kapsamı font koymadan doğrulanacak.
- **İletişim: e-posta `halit@hburakalemdar.com` (Gmail değil), GitHub, LinkedIn.**
  Kullanıcı Gmail'in kullanılmayacağını belirtti; X yok.

## 2026-07-15 — Kullanıcı düzeltmeleri (2. tur)

- **URL alanı `slug` değil `permalink`.** Astro'da `slug` eski `type:'content'`
  API'sinde rezerve (şemaya eklenince build patlar: `content-schema-contains-slug-error`),
  Astro 5 content layer'da rezerve alan `id`. Sıfır çakışma için her iki API'de
  de serbest olan `permalink` özel alanı seçildi; route `/yazi/[permalink].astro`.
  (Resmi Astro docs ile doğrulandı.)
- **Portföy: ayrı sayfa/koleksiyon YOK.** Ana sayfanın altında küçük bir bölüm,
  tek data dosyasından (`src/data/portfoy.ts`) beslenir; dizi boşsa hiç render
  olmaz. Küçük portföy için ayrı route + collection fazla ağırdı.
- **Örnek yazılar: `ornek-` prefix'li, kendini "yapı testi" ilan eden geçici
  içerik.** §12 doğrulama içerik ister, §10 placeholder yasaklar — çelişki;
  uydurma anı yazmak yerine dürüstçe "bu geçici bir yapı testidir" diyen ve ilk
  gerçek yazıda silinecek örneklerle çözüldü.
- **DNS işi BLOCKED'a yazıldı, agent uygulamıyor.** GitHub Pages A/AAAA/CNAME
  eklenecek, park kayıtları silinecek; mail (MX/SPF iCloud/DKIM) kayıtlarına
  dokunulmayacak — geri dönüşü zor, insan eliyle yapılmalı. IP'ler docs.github.com
  ile doğrulandı.

## 2026-07-15 — İskele uygulaması (3. tur)

- **Astro 5 + content layer (glob loader).** SPEC'teki `type:'content'` yerine
  Astro 5 varsayılanı; `defineCollection({ loader: glob(...) })` ile
  `src/content/yazilar/{klasor}/index.md` okunuyor. Şema `src/content.config.ts`
  (Astro 5'te `src/content/config.ts` yerine kök `src/content.config.ts` da geçerli).
- **`permalink` Zod regex `^[a-z0-9-]+$`.** SPEC ASCII/tire kuralını şema
  seviyesinde zorlar; Türkçe karakterli permalink build'i patlatır.
- **Permalink tekilliği kod ile zorlanıyor.** `getStaticPaths` sessizce ezmesin
  diye `tumYazilar()` içinde Map ile çakışma taranıp açık hata fırlatılıyor (SPEC §9).
- **Draft filtresi tek yerde (`src/lib/yazilar.ts`).** Tüm query'ler bu helper'dan
  geçiyor; `import.meta.env.PROD` ile production'da draft çıkmıyor, dev'de görünüyor.
- **Font: Source Serif 4, fontsource woff2 (latin + latin-ext), self-host.** Türkçe
  glif kapsamı fonttools cmap kontrolüyle doğrulandı — regular/bold/italic birleşik
  TAM (ğ Ğ ş Ş ı İ ç Ç ö Ö ü Ü). `ı` latin alt-kümesinde, `İ Ğğ Şş` latin-ext'te;
  `@font-face` unicode-range ile ikisi de yükleniyor. Değişken font yerine 3 statik
  ağırlık (400/400i/700) — sadece kullanılan ağırlıklar, daha küçük yük.
- **Kod vurgusu: Astro dahili Shiki (varsayılan).** Ekstra entegrasyon/dependency
  yok; `astro-code` çıktısı doğrulandı. Kod fontu sistem monospace (font yükü yok).
- **E-posta obfüskasyonu: HTML entity + `set:html`.** Her karakter `&#code;`
  entity'sine çevrilip `<Fragment set:html>` ile basılıyor; browser JS'siz parse
  ediyor, naif bot düz `mailto:` bulamıyor (SPEC §3.3).
- **`trailingSlash: 'ignore'`, RSS link'leri sonda `/`'li.** GitHub Pages dizin
  index'iyle uyum; Astro varsayılan çıktı `/yazi/{permalink}/index.html`.
- **Deploy: resmi GitHub Pages Actions (upload-pages-artifact + deploy-pages).**
  `gh-pages` branch'i yerine artifact tabanlı resmi akış; `concurrency: pages`.
- **`sharp` açık bağımlılık.** `astro:assets` build-time görsel dönüşümü için
  gerekli; opsiyonel kapak görselleri webp'e çevrilsin diye eklendi.
