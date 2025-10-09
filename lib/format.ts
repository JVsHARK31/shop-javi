import { WhatsAppOrderData } from './types';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRupiahShort(amount: number): string {
  return formatRupiah(amount).replace('Rp', 'Rp ');
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatWhatsAppMessage(data: WhatsAppOrderData): string {
  const message = `Halo, saya ingin memesan:%0A%0A- Produk: ${data.namaProduk}%0A- Variasi: ${data.namaVariasi}%0A- Jumlah: ${data.qty}%0A- Perkiraan total: ${formatRupiahShort(data.totalHarga)}%0A%0A${data.urlProduk}`;

  return message;
}

export function generateWhatsAppUrl(phoneNumber: string, message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((resolve, reject) => {
      document.execCommand('copy') ? resolve() : reject();
      textArea.remove();
    });
  }
}

export function getMinPrice(variations: { price: number }[]): number {
  if (!variations || variations.length === 0) return 0;
  return Math.min(...variations.map(v => v.price));
}

export function getMaxPrice(variations: { price: number }[]): number {
  if (!variations || variations.length === 0) return 0;
  return Math.max(...variations.map(v => v.price));
}

export function getPriceDisplay(variations: { price: number }[]): string {
  if (!variations || variations.length === 0) return formatRupiahShort(0);

  const minPrice = getMinPrice(variations);
  const maxPrice = getMaxPrice(variations);

  // Jika harga sama semua variasi, tampilkan satu harga
  if (minPrice === maxPrice) {
    return formatRupiahShort(minPrice);
  }

  // Jika harga berbeda, tampilkan rentang harga (TANPA kata "Mulai")
  return `Rentang harga: ${formatRupiahShort(minPrice)} – ${formatRupiahShort(maxPrice)}`;
}
