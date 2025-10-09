'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getHiddenProducts,
  toggleProductPublished,
  getAllKategori,
} from '@/lib/services/products';
import { Product } from '@/lib/types';
import { formatRupiahShort } from '@/lib/format';
import { Search, Eye, EyeOff, ChevronLeft, ChevronRight, Package, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 10;

export default function AdminHiddenProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadHiddenProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, categoryFilter, products]);

  const loadHiddenProducts = async () => {
    setLoading(true);
    try {
      console.log('👁️ HIDDEN PRODUCTS DEBUG: Loading hidden products...');
      
      // Load only hidden products
      const data = await getHiddenProducts();
      
      console.log('👁️ HIDDEN PRODUCTS DEBUG: Found', data.length, 'hidden products');
      setProducts(data);
    } catch (error) {
      console.error('👁️ HIDDEN PRODUCTS DEBUG: Error loading hidden products:', error);
      toast.error('Gagal memuat produk disembunyikan');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await getAllKategori();
      setAvailableCategories(cats);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(p =>
        (p.judul ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p =>
        (p.kategori ?? []).includes(categoryFilter)
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    console.log('👁️ HIDDEN TOGGLE DEBUG: Starting toggle for ID:', id, 'Current status:', currentStatus);
    
    try {
      console.log('👁️ HIDDEN TOGGLE DEBUG: Calling toggleProductPublished function...');
      
      // Show loading state
      toast.loading('Mengubah status produk...', { id: 'toggle-hidden-product' });
      
      // Toggle from hidden (false) to visible (true)
      await toggleProductPublished(id, !currentStatus);
      
      console.log('👁️ HIDDEN TOGGLE DEBUG: Toggle successful');
      toast.success('Produk berhasil ditampilkan', { id: 'toggle-hidden-product' });
      
      console.log('👁️ HIDDEN TOGGLE DEBUG: Reloading hidden products...');
      await loadHiddenProducts();
      
      console.log('👁️ HIDDEN TOGGLE DEBUG: Complete!');
    } catch (error: any) {
      console.error('👁️ HIDDEN TOGGLE DEBUG: Error occurred:', error);
      console.error('👁️ HIDDEN TOGGLE DEBUG: Error message:', error.message);
      
      const errorMessage = error.message || 'Gagal mengubah status produk';
      toast.error('Gagal mengubah status: ' + errorMessage, { id: 'toggle-hidden-product' });
    }
  };

  const handleRefresh = async () => {
    console.log('👁️ HIDDEN PRODUCTS DEBUG: Manual refresh triggered');
    await loadHiddenProducts();
    toast.success('Data produk disembunyikan diperbarui');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <EyeOff className="h-6 w-6 text-muted-foreground" />
              Produk Disembunyikan
            </h1>
            <p className="text-muted-foreground">
              Kelola produk yang disembunyikan dari tampilan publik
            </p>
          </div>
          
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">Total Disembunyikan</p>
            </div>
            <p className="text-2xl font-bold">{products.length}</p>
          </div>
          
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">Hasil Pencarian</p>
            </div>
            <p className="text-2xl font-bold">{filteredProducts.length}</p>
          </div>
          
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">Siap Ditampilkan</p>
            </div>
            <p className="text-2xl font-bold text-green-600">{filteredProducts.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari produk disembunyikan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="w-full sm:w-48">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {availableCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Gambar</TableHead>
                <TableHead>Produk</TableHead>
                <TableHead className="hidden sm:table-cell">Kategori</TableHead>
                <TableHead className="hidden md:table-cell">Harga</TableHead>
                <TableHead className="hidden md:table-cell">Stok</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-32">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground h-32">
                    {searchQuery || categoryFilter !== 'all' ? (
                      'Tidak ada produk disembunyikan yang cocok'
                    ) : (
                      <div className="space-y-2">
                        <EyeOff className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p>Tidak ada produk yang disembunyikan</p>
                        <p className="text-sm">Semua produk sedang ditampilkan</p>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.gambar?.[0] ? (
                        <img
                          src={product.gambar[0]}
                          alt={product.judul ?? product.slug}
                          width={60}
                          height={60}
                          className="rounded object-cover"
                        />
                      ) : (
                        <div className="w-[60px] h-[60px] bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{product.judul ?? product.slug}</div>
                      <div className="text-xs text-muted-foreground">{product.slug}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {(product.deskripsi ?? '').slice(0, 60)}...
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(product.kategori ?? []).slice(0, 2).map((kat) => (
                          <Badge key={kat} variant="secondary" className="text-xs">
                            {kat}
                          </Badge>
                        ))}
                        {(product.kategori ?? []).length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{(product.kategori ?? []).length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-medium">
                      {formatRupiahShort(product.base_price)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={product.stok_total === 0 ? 'destructive' : 'default'}>
                        {product.stok_total}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <Badge variant="secondary" className="text-xs">
                          Disembunyikan
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <EyeOff className="h-3 w-3 text-muted-foreground" />
                          <Switch
                            checked={!product.published}
                            onCheckedChange={() => handleTogglePublish(product.id, product.published)}
                            className="data-[state=checked]:bg-green-600"
                          />
                          <Eye className="h-3 w-3 text-green-600" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleTogglePublish(product.id, product.published)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Tampilkan</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <p className="text-sm text-muted-foreground">
              Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} dari {filteredProducts.length} produk disembunyikan
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Sebelumnya</span>
              </Button>
              <span className="text-sm px-2">
                Halaman {currentPage} dari {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <span className="hidden sm:inline mr-2">Selanjutnya</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
