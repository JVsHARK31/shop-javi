import Link from 'next/link';
import { Package } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-gradient-to-b from-muted/40 to-muted/60">
      <div className="container px-4 py-8 sm:py-10 md:py-12">
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-base font-bold sm:text-lg">Javier_shark006 Shop</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Toko produk digital terpercaya dengan berbagai pilihan template,
              e-book, preset, dan lisensi software.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold sm:text-lg">Kategori</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/?kategori=Template Design" className="text-muted-foreground transition-colors hover:text-primary">
                  Template Design
                </Link>
              </li>
              <li>
                <Link href="/?kategori=E-book & Panduan" className="text-muted-foreground transition-colors hover:text-primary">
                  E-book & Panduan
                </Link>
              </li>
              <li>
                <Link href="/?kategori=Preset & Assets" className="text-muted-foreground transition-colors hover:text-primary">
                  Preset & Assets
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold sm:text-lg">Kontak</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="font-medium">WhatsApp: +62 882-9028-6954</li>
              <li>Senin - Minggu: 09:00 - 21:00 WIB</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold sm:text-lg">Informasi</h3>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Package className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <p className="leading-relaxed">
                Produk digital — pengiriman berupa file/link setelah pembayaran
                terkonfirmasi
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground sm:pt-8 sm:text-sm">
          <p>© {new Date().getFullYear()} Javier_shark006 Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
