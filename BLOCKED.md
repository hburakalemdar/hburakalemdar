# BLOCKED — insan müdahalesi gereken işler

CLAUDE.md gereği para/domain/DNS/geri-alınamaz işleri agent yapmaz. Bunları
Burak elle uygulamalı. Repo tarafındaki her şey (CNAME dosyası, Actions
workflow) hazırlanır; aşağıdakiler senin elinle DNS sağlayıcısında ve GitHub
ayarlarında yapılır.

---

## 1. DNS — GitHub Pages'e geçiş (Namecheap)

Site GitHub Pages'te yayınlanacak (`hburakalemdar/hburakalemdar` →
`hburakalemdar.github.io`), custom domain `hburakalemdar.com`. Mevcut park/
yönlendirme kayıtları GitHub Pages ile **çakışır**, kaldırılmalı.

### 1a. SİLİNECEK kayıtlar (park/yönlendirme — çakışıyor)

| Tip                 | Host | Değer                          |
|---------------------|------|--------------------------------|
| URL Redirect Record | `@`  | `http://www.hburakalemdar.com` |
| CNAME Record        | `www`| `parkingpage.namecheap.com`    |

### 1b. EKLENECEK kayıtlar (GitHub Pages — kaynak: docs.github.com)

Apex (`@`) için 4 **A** kaydı:

```
A   @   185.199.108.153
A   @   185.199.109.153
A   @   185.199.110.153
A   @   185.199.111.153
```

Apex (`@`) için 4 **AAAA** kaydı (IPv6, önerilir):

```
AAAA   @   2606:50c0:8000::153
AAAA   @   2606:50c0:8001::153
AAAA   @   2606:50c0:8002::153
AAAA   @   2606:50c0:8003::153
```

`www` için tek **CNAME** (hedef kullanıcı adı .github.io, repo adı değil):

```
CNAME   www   hburakalemdar.github.io.
```

> Not: Apex'te düz CNAME DNS standardınca kullanılamaz; GitHub bu yüzden
> A/AAAA verir. Namecheap ALIAS/CNAME-flattening'i apex'te GitHub tarafından
> kabul edilir ama **birincil önerilen yol A + AAAA'dır** — onu kullan.

### 1c. GitHub tarafı (DNS yayıldıktan sonra)

1. Repo **Settings → Pages → Custom domain**: `hburakalemdar.com` yaz, **Save**.
   (Repoda `CNAME` dosyasını da günceller; repo'da zaten `public/CNAME` var.)
2. `dig hburakalemdar.com +noall +answer` ile A kayıtlarının 185.199.108–111.153
   döndüğünü doğrula.
3. Doğrulama bitince **Enforce HTTPS**'i işaretle (sertifika için 24 saate kadar
   sürebilir; hemen görünmezse bekle).

---

## 2. ⚠️ DOKUNULMAYACAK kayıtlar (mail çalışıyor — bozarsan geri dönüşü zor)

Aşağıdakiler e-posta (iCloud custom domain) içindir. **Silme, değiştirme,
üzerine yazma.** Yukarıdaki A/AAAA/CNAME işlemleri bunları etkilememeli.

- **MX** kayıtları (tümü) — gelen mail. Dokunma.
- **TXT / SPF:** `v=spf1 include:icloud.com ...` — mail doğrulaması. Dokunma.
- **CNAME `sig1._domainkey`** (DKIM) — mail imzası. Dokunma.

`halit@hburakalemdar.com` bu kayıtlara bağlı. A/AAAA sadece apex web trafiğini,
`www` CNAME sadece www'yi etkiler; mail kayıtları (MX/TXT/`_domainkey`) ayrı
host'lardadır ve el değmeden kalır.

---

## Durum

- [ ] 1a: park/yönlendirme kayıtları silindi
- [ ] 1b: GitHub Pages A/AAAA/CNAME kayıtları eklendi
- [ ] 1c: GitHub Settings → Pages custom domain + Enforce HTTPS
- [ ] 2: mail kayıtlarının (MX/SPF/DKIM) el değmeden durduğu teyit edildi
