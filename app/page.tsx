'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/storefront/header';
import { Footer } from '@/components/storefront/footer';
import { ProductCard, ProductCardSkeleton } from '@/components/storefront/product-card';
import { ProductFilters } from '@/components/storefront/product-filters';
import { FeatureGuide } from '@/components/ui/feature-guide';
import { getProducts, getAllKategori, getAllTags } from '@/lib/services/products';
import { getCategories } from '@/lib/services/categories';
import { Product, Category } from '@/lib/types';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { Filter, Search, ShoppingCart, Tag, Import as SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Home() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableKategori, setAvailableKategori] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedKategori, setSelectedKategori] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('terbaru');
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const kategoriParam = searchParams.get('kategori');
    if (kategoriParam) {
      setSelectedKategori([kategoriParam]);
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [categoriesData, kategoriData, tagsData] = await Promise.all([
          getCategories(),
          getAllKategori(),
          getAllTags(),
        ]);
        setCategories(categoriesData);
        setAvailableKategori(kategoriData);
        setAvailableTags(tagsData);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const data = await getProducts({
          kategori: selectedKategori.length > 0 ? selectedKategori : undefined,
          tag: selectedTags.length > 0 ? selectedTags : undefined,
          search: debouncedSearch || undefined,
          sortBy: sortBy as any,
          published: true,
        });
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [selectedKategori, selectedTags, debouncedSearch, sortBy]);

  const handleClearFilters = () => {
    setSelectedKategori([]);
    setSelectedTags([]);
    setSearchQuery('');
  };

  const filterComponent = (
    <ProductFilters
      availableKategori={availableKategori}
      availableTags={availableTags}
      selectedKategori={selectedKategori}
      selectedTags={selectedTags}
      sortBy={sortBy}
      onKategoriChange={setSelectedKategori}
      onTagsChange={setSelectedTags}
      onSortChange={setSortBy}
      onClearFilters={handleClearFilters}
    />
  );

  const guideSteps = [
    {
      title: 'Selamat Datang di Javier_shark006 Shop',
      description: 'Toko produk digital dengan berbagai pilihan template, e-book, preset, dan lisensi software. Mari kita kenali fitur-fiturnya!',
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      title: 'Cari Produk Favorit Anda',
      description: 'Gunakan search bar di header untuk mencari produk dengan cepat. Ketik nama produk atau kata kunci yang Anda inginkan.',
      icon: <Search className="h-5 w-5" />,
    },
    {
      title: 'Filter & Sortir Produk',
      description: 'Klik tombol "Filter & Urutkan" (mobile) atau gunakan sidebar (desktop) untuk memfilter berdasarkan kategori, tag, dan mengurutkan berdasarkan harga.',
      icon: <Filter className="h-5 w-5" />,
    },
    {
      title: 'Kategori & Tag',
      description: 'Filter produk berdasarkan kategori seperti Template Design, E-book, atau Preset. Gunakan tag untuk pencarian lebih spesifik.',
      icon: <Tag className="h-5 w-5" />,
    },
    {
      title: 'Urutkan Hasil',
      description: 'Urutkan produk berdasarkan: Terbaru, Harga Terendah, atau Harga Tertinggi untuk menemukan produk yang sesuai budget Anda.',
      icon: <SortAsc className="h-5 w-5" />,
    },
    {
      title: 'Detail & Pesan Produk',
      description: 'Klik kartu produk untuk melihat detail lengkap, gambar slide, variasi, dan pilih jumlah. Pesan langsung via WhatsApp!',
      icon: <ShoppingCart className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <FeatureGuide storageKey="storefront-guide" steps={guideSteps} />
      <Header categories={categories} onSearch={setSearchQuery} />

      <main className="flex-1">
        <div className="container px-4 py-6 sm:py-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">Produk Digital</h1>
              <p className="mt-1 text-sm text-muted-foreground sm:mt-2 sm:text-base">
                Temukan berbagai produk digital berkualitas untuk kebutuhan Anda
              </p>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="w-full sm:w-auto lg:hidden">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter & Urutkan
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] sm:w-80">
                {filterComponent}
              </SheetContent>
            </Sheet>
          </div>

          <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-8">
            <aside className="hidden lg:block">
              {filterComponent}
            </aside>

            <div className="w-full">
              {loading ? (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 text-center">
                  <div className="rounded-full bg-muted p-6">
                    <Filter className="h-10 w-10 text-muted-foreground sm:h-12 sm:w-12" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold sm:text-xl">
                    Tidak ada produk ditemukan
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                    Coba ubah filter atau kata kunci pencarian Anda
                  </p>
                  {(selectedKategori.length > 0 || selectedTags.length > 0 || searchQuery) && (
                    <Button
                      variant="outline"
                      onClick={handleClearFilters}
                      className="mt-6"
                    >
                      Hapus Semua Filter
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2">
                    <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                      Menampilkan <span className="font-bold text-foreground">{products.length}</span> produk
                    </p>
                  </div>
                  <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
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
