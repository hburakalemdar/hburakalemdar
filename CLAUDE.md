# hburakalemdar.com

Kişisel site: gezi yazıları, teknik yazılar, küçük bir portföy bölümü. İçerik Türkçe.

Ne yapılacağı `@SPEC.md` dosyasında. Bu dosya nasıl çalışacağını anlatır.

## Gözetimsiz çalışma

Bu projede çoğunlukla ben yokken çalışıyorsun. Soru sorup bekleme — **karar ver, gerekçesini `DECISIONS.md`'ye yaz, devam et.** SPEC.md bir konuda sessizse en makul yorumu seç ve seçimini kaydet.

Tek istisna: para gerektiren, domain/DNS değiştiren veya geri alınamaz bir şey. Onu yapma, `BLOCKED.md`'ye yaz, başka işe geç.

## Durum dosyada, konuşmada değil

Uzun koşuda context compact olur ve konuşmadaki detay kaybolur. Diskteki dosyalar kalır. **YOU MUST** şu iki dosyayı işlerken güncel tut:

- `PROGRESS.md` — ne bitti, ne yapılıyor, sırada ne var, hangi dosyalar değişti. Her adım bitiminde güncelle.
- `DECISIONS.md` — verdiğin her teknik karar + tek cümle gerekçe. Sonradan "neden böyle" diye sorulacak her şey buraya.

Compact olduktan sonra ilk iş bu ikisini oku.

## Compact Instructions

Özetlerken şunları eksiksiz koru: seçilen stack ve gerekçesi, değişen dosyaların tam listesi, build/test komutları, çözülmemiş hatalar, SPEC.md'de kapsam dışı bırakılmış şeyler.

## Subagent kullan

Ana context'i temiz tut. Şunları subagent'a devret:

- Kütüphane/dokümantasyon araştırması (çok çıktı üretir, sadece özet lazım)
- Kod tabanında keşif ("şu pattern nerede kullanılmış")
- Build/test çıktısı taraması — sadece başarısız olanları raporlasın

Sonucu yazmadan önce diff'i taze bir subagent'a inceleterek doğrula: SPEC.md'ye karşı eksik var mı, kapsam dışında bir şey değişmiş mi.

Subagent bedava değil, token'ı çarpar. Kısa ve doğrudan iş için kullanma.

## Git

Remote: `https://github.com/hburakalemdar/hburakalemdar.git`

İlk iş: repo'yu bu remote'a bağla ve ilk commit'i push et. Bağlı değilse `git remote add origin`, sonra `git push -u origin main`. Kod yazmaya başlamadan önce bunu hallet — her şey push'lu olsun.

Riskli bir işe başlamadan önce commit at — kurtarma noktası bu, checkpoint değil.

Her anlamlı adımda commit **ve push**. Mesaj ne yapıldığını söylesin. Ben yokken ilerlemeyi GitHub'dan takip edeceğim, lokalde birikmesin.

`gh` CLI kurulu, PR/issue için onu kullan.

## Doğrulama

İş "bitmiş göründü" diye bitmiş sayılmaz. Her turda çalıştırabileceğin bir kontrol olsun: build geçiyor mu, sayfa render oluyor mu. Kontrol yoksa önce onu kur.

Başarıyı iddia etme, kanıt göster: komut ve çıktısı.

## Kısıtlar

**Türkçe karakterler (ğ ş ı İ ç ö ü) her fontta eksiksiz çalışmalı.** Font seçmeden önce kontrol et. Bu en sık yapılan hata.

Tasarım yönü: sade ve minimal, tipografi resmi. Süs yok, renk kıt, boşluk bol. Detayı sonra beraber oturtacağız — şimdilik iskeleti çıkar, güzelleştirmeye takılma.

Yazı eklemek bir dosya yazıp push etmekle olmalı. Panel/CMS/veritabanı yok.

Bağımlılık eklemeden önce gerçekten gerekli mi diye sor. Bu bir blog.

## Yapma

- Dark mode, yorum sistemi, newsletter, paylaş butonu.
- Placeholder/lorem ipsum içerik. Gerçek içerik yoksa boş bırak.
- Analytics.
- Kapsam genişletme. SPEC.md'de olmayan şeyi yapma, `IDEAS.md`'ye yaz.
