// Türkçe tarih formatı: "15 Temmuz 2026" (SPEC §2). Timezone Europe/Istanbul.
const bicimlendirici = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Istanbul',
});

export function tarihTR(date: Date): string {
  return bicimlendirici.format(date);
}

// <time datetime=""> için makine-okur ISO tarih (YYYY-MM-DD).
export function tarihISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}
