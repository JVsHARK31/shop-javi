import Link from 'next/link';
import { Product } from '@/lib/types';
import { getPriceDisplay } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stok_total === 0;
  const priceDisplay = getPriceDisplay(product.variations || []);
  const mainImage = product.gambar[0] || '/placeholder.png';

  return (
    <Link href={`/produk/${product.slug}`} className="block h-full active:scale-[0.98] transition-transform">
      <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/50">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          <img
            src={mainImage}
            alt={product.judul}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400';
            }}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {isOutOfStock && (
            <Badge
              variant="destructive"
              className="absolute right-2 top-2 sm:right-3 sm:top-3 text-xs sm:text-sm font-semibold shadow-lg"
            >
              Stok Habis
            </Badge>
          )}
        </div>
        <CardContent className="flex flex-1 flex-col p-3 sm:p-4 md:p-5">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug transition-colors group-hover:text-primary sm:text-base md:text-lg">
            {product.judul}
          </h3>
          {product.kategori && product.kategori.length > 0 && (
            <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {product.kategori[0]}
            </p>
          )}
        </CardContent>
        <CardFooter className="border-t bg-muted/30 p-3 sm:p-4 md:p-5">
          <div className="flex items-baseline gap-1">
            <p className="text-base font-bold text-primary sm:text-lg md:text-xl">{priceDisplay}</p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <div className="aspect-square animate-pulse bg-muted" />
      <CardContent className="p-4">
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-muted" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
      </CardFooter>
    </Card>
  );
}
