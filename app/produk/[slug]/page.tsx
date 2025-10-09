'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/storefront/header';
import { Footer } from '@/components/storefront/footer';
import { ProductImageGallery } from '@/components/storefront/product-image-gallery';
import { ProductOrderForm } from '@/components/storefront/product-order-form';
import { getProductBySlug } from '@/lib/services/products';
import { getCategories } from '@/lib/services/categories';
import { Product, Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CircleCheck as CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [productData, categoriesData] = await Promise.all([
          getProductBySlug(slug),
          getCategories(),
        ]);

        if (!productData) {
          setNotFound(true);
        } else {
          setProduct(productData);
        }
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading product:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header categories={[]} />
        <main className="flex-1">
          <div className="container px-4 py-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <Skeleton className="aspect-square w-full" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header categories={categories} />
        <main className="flex-1">
          <div className="container px-4 py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="text-3xl font-bold">Produk Tidak Ditemukan</h1>
              <p className="mt-4 text-muted-foreground">
                Maaf, produk yang Anda cari tidak tersedia atau sudah tidak aktif.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header categories={categories} />

      <main className="flex-1">
        <div className="container px-3 py-3 sm:px-4 sm:py-4 md:py-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-3 -ml-1 sm:mb-4 sm:-ml-2 hover:bg-accent active:bg-accent/80 h-10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>

          <div className="grid gap-4 sm:gap-5 md:gap-6 lg:grid-cols-2 lg:gap-8">
            <ProductImageGallery images={product.gambar || []} alt={product.judul || product.slug} />

            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-3">
                  {(product.kategori || []).map((kat) => (
                    <Badge key={kat} variant="secondary" className="text-xs">
                      {kat}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-lg font-bold tracking-tight leading-tight sm:text-xl sm:leading-tight md:text-2xl lg:text-3xl">
                  {product.judul}
                </h1>
              </div>

              {product.highlight_bullets && product.highlight_bullets.length > 0 && (
                <div className="space-y-2.5 sm:space-y-3">
                  <h3 className="text-sm font-semibold sm:text-base">Fitur Unggulan:</h3>
                  <ul className="space-y-2.5 sm:space-y-3">
                    {product.highlight_bullets.map((bullet, index) => (
                      <li key={index} className="flex items-start gap-2 sm:gap-2.5">
                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-green-600 mt-0.5" />
                        <span className="text-sm sm:text-base leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div
                className="prose prose-sm max-w-none text-sm sm:text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.deskripsi || '' }}
              />

              <ProductOrderForm product={product} />

              {product.tag && product.tag.length > 0 && (
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-2.5">Tag:</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {product.tag.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
