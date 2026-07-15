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

## 2026-07-15 — Tasarım turu: kontrast + hiyerarşi (4. tur)

Sorun: "varsayılan minimal" — az öğeli ama karaktersiz, göz nereye bakacağını
bilmiyordu. Çözüm: meta'yı geri çek, başlığı öne çıkar, tek accent, tek hover.

- **Tek accent renk: oxblood `#6e1423`.** Koyu, resmi (terracotta değil).
  SADECE `<a>` metin rengi ve hover'da kullanılır; başka hiçbir dekoratif yerde
  yok. `--accent` değişkeni.
- **Renk paleti:** metin `#1a1a1a` (başlık+gövde), ikincil `#6f6f6b` (açıklama),
  meta `#9a978f` (mono tarih·kategori, soluk gri), çizgi `#e7e6e1`,
  zemin `#fdfdfc`, kod zemini `#f3f2ee`.
- **Meta = mono, küçük, soluk, küçük harf.** Tarih ve kategori `--mono` yığını,
  `0.8rem`, `#9a978f`, `letter-spacing 0.02em`, `text-transform: lowercase`.
  Gövde serifiyle yarışmıyor. Ayraç `·` çizgi renginde (en soluk).
- **Kategori kutusuz.** Eski kenarlıklı `.etiket` kutusu kaldırıldı; artık düz
  mono metin (`.kat`), tarihle aynı satırda `·` ayraçla. Kutu minimal düzende en
  çok göze batan öğeydi.
- **Başlık hiyerarşisi tersine çevrildi.** Yazı başlıkları serif, büyük, koyu,
  bold (liste `1.2rem/700`, tekil `h1 2.1rem/700`). Bölüm etiketleri ("Son
  yazılar" vb.) küçüldü: mono, `0.78rem`, `letter-spacing 0.12em`, uppercase,
  meta grisi — artık başlık değil "etiket" gibi okunuyor.
- **Tipografi ölçeği:** kök `18px`; h1 `2.1rem`, h2 (gövde) `1.45rem`, h3
  `1.2rem`, liste başlığı `1.2rem`, giriş `1.15rem`, gövde `1rem`, açıklama
  `0.98rem`, meta `0.8rem`, bölüm etiketi `0.78rem`, nav/footer `0.75–0.78rem`
  (mono). Gövde satır yüksekliği `1.65`, başlıklar `1.2`.
- **İmza öğe: liste satırı = solda mono meta (10rem kolon), sağda başlık.**
  Grid `10rem 1fr`. Tek gösterişli hamle: hover'da başlığın altına accent renkli
  `1px` çizgi (`background-size 0→100%`, `0.18s`). Başka hover/animasyon yok.
  Dar ekranda (`<34rem`) meta başlığın üstüne, tek kolona iner.
- **Dikey ritim: 8px ölçeği.** Tek boşluk skalası `--sp-1..8` = 8/16/24/32/48/64px;
  tüm bölüm araları, padding ve margin'ler bu değişkenlerden. Rastgele rem
  değerleri kaldırıldı.
- **Nav + footer mono, küçük harf, soluk; hover'da accent.** Site kromu gövdeden
  ayrışsın ve sessiz kalsın diye mono; tek renkli vurgu hover'da beliriyor.

## 2026-07-15 — Editoryal ölçek + ızgara (5. tur)

Sorun: gövde çok büyüktü (bio sayfanın en büyük öğesiydi), başlık/gövde kontrastı
~1.2:1 kalıyordu; liste iki sütun (tarih|başlık) olduğu için sol kenar tırtıklıydı.

- **Modüler ölçek: Major Third (1.25), gövde ankor 18px.** Kontrast 18→28 (liste
  başlığı ~1.55:1) ve 18→42 (tekil başlık ~2.3:1). Ölçek:
  - gövde `18px` (1rem), satır yüksekliği `1.6`
  - meta (tarih·kategori) `14px` mono — gövdeden 4px küçük
  - bölüm etiketi ("SON YAZILAR") `13px` mono soluk
  - liste yazı başlığı `1.55rem` (~28px), `line-height 1.25`
  - tekil yazı başlığı `h1 2.35rem` (~42px), `line-height 1.12`
  - gövde içi `h2 1.55rem` (~28px), `h3 1.25rem` (~22px)
  - **bio gövdeyle AYNI (18px)** — artık sayfanın en büyük öğesi değil (önceki
    tur `1.15rem`'di, yanlıştı).
- **Tek hizalama ekseni (ızgara yok).** Liste iki sütunlu grid'den (`10rem 1fr`)
  tek eksene alındı: her yazı bloğu `meta → başlık → özet` sırasıyla aynı sol
  kenardan başlar. İki sütun tırtıklı kenar üretiyordu; kaldırıldı.
- **Tek ölçü `--measure: 34rem` (~62-66 karakter).** Bio, özet ve gövde metni
  aynı `--measure`'a bağlı; kabuk genişliği de buradan. Tutarsız satır uzunlukları
  (geniş bio / dar özet) giderildi. Editoryal 60-66 karakter standardı.
- **Başlık biçimi: 3 araç (boyut + ağırlık + renk) + `letter-spacing -0.01em`.**
  Kitap-sıkılığı; gazete sıkılığı (daha negatif) değil. Fazla araç yok.
- **İmza hover: `text-decoration` accent alt çizgi (gradient animasyon yerine).**
  Başlık artık büyük ve çok satıra sarabildiği için, çok satırda da doğru çizilen
  `text-decoration-color: var(--accent)` kullanıldı; animasyon kaldırıldı.
- **Dikey ritim tek kaynak `--sp-1..8` (8px katları).** Tüm başlık/blok/bölüm
  boşlukları bu ölçekten; rastgele rem değeri kalmadı.

## 2026-07-15 — Ölçü: iki ayrı değer (6. tur)

Önceki turdaki tek `--measure` (34rem her yerde) hataydı: liste sayfalarını
gereksiz daraltıyordu. Liste sayfalarında düzyazı OKUNMUYOR, TARANIYOR — okuma
ölçüsü kısıtı orada geçersiz.

- **İki ayrı ölçü.** `--measure-read: 65ch` yalnızca tekil yazı gövdesinde
  (`.yazi-govde` — uzun okuma var). `--measure-wide: 1100px` liste sayfalarının
  kabuk genişliği (`/`, `/yazilar`, `/kategori/*`). Ölçüldü: kabuk 1100px,
  makale gövdesi 619px (~65ch).
- **Liste içeriğinde okuma kısıtı yok.** Bio (`.giris`) ve özet (`.aciklama`)
  `max-width` kaldırıldı; geniş kabuk içinde nefes alıyorlar. Sayfa taranıyor,
  okunmuyor.
- **Kutu iç boşluğu `padding-inline: 1.5rem`.** Mobilde metin kenara yapışmasın;
  mobil media query yalnız `padding-block`'u küçültür, inline 1.5rem korunur.
- **375px doğrulama.** Ortam pencereyi min 500px'e kırpıyor (gerçek 375 viewport
  alınamadı). Gerçek 500px'te yatay scroll yok (`docScrollW===winW`); DOM'da
  375px'e zorlanan testte en kötü durum (kod bloklu makale) gövde 375px'te
  sınırlı, yalnız `pre` kendi içinde kayıyor (`overflow-x:auto`), sayfa taşması
  yok. En dar içerik öğeleri (meta nowrap ~200px, en uzun kelime ~150px) 327px
  içerik kutusunun altında.
