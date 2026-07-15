---
title: "Örnek gezi yazısı (yapı testi)"
date: 2026-07-14
category: gezi
description: "Sitenin gezi kategorisini, yazı akışını ve tipografiyi doğrulamak için geçici bir yapı testi yazısı."
permalink: ornek-gezi
draft: false
---

Bu bir **yapı testidir**. Uydurma bir gezi anısı değil; sitenin yazı akışını,
`gezi` kategori etiketini, Türkçe tipografiyi ve tekil yazı sayfasını doğrulamak
için geçici olarak buradadır. İlk gerçek gezi yazısı eklendiğinde silinecektir.

## Türkçe karakter kontrolü

Şu harflerin seçilen fontta (Source Serif 4) eksiksiz göründüğünü doğrular:
ğ Ğ, ş Ş, ı I, i İ, ç Ç, ö Ö, ü Ü. Örnek kelimeler: **ışık**, **İstanbul**,
**şoför**, **çığ**, **düğün**, **öğütücü**.

## Ne test ediliyor

- Başlık, tarih (Türkçe biçim) ve kategori etiketinin birlikte render'ı.
- Gövde metni satır yüksekliği ve paragraf boşluğu.
- Kategori filtresinde (`/kategori/gezi`) ve tek akışta (`/yazilar`) görünürlük.
