---
title: "Örnek teknik yazı (yapı testi)"
date: 2026-07-15
category: teknik
description: "Sitenin teknik kategorisini, kod bloğu vurgulamasını ve tekil sayfa render'ını doğrulamak için geçici bir yapı testi yazısı."
permalink: ornek-teknik
draft: false
---

Bu bir **yapı testidir**. Sahte teknik içerik değil; sitenin `teknik` kategori
etiketini, kod bloğu vurgulamasını (Shiki) ve tekil sayfa render'ını doğrulamak
için geçici olarak buradadır. İlk gerçek teknik yazı eklendiğinde silinecektir.

## Kod bloğu

Kod bloklarının sistem monospace yığınıyla ve Shiki vurgusuyla render olduğunu
doğrular:

```ts
export function selamla(ad: string): string {
  // Türkçe karakterler kod içinde de doğru görünmeli: ğ ş ı İ ç ö ü
  return `Merhaba, ${ad}!`;
}
```

Satır içi kod: `npm run build` komutu `dist/` üretir.

## Ne test ediliyor

- Kod bloğu vurgulama ve yatay kaydırma.
- Satır içi `code` biçimi.
- Tek akışta (`/yazilar`) ve `/kategori/teknik` filtresinde görünürlük.
