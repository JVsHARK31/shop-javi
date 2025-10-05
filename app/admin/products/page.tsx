'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { ProductForm, ProductFormData } from '@/components/admin/product-form';
import { FeatureGuide } from '@/components/ui/feature-guide';
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
  getProducts,
  createProduct,
  updateProduct,
  toggleProductPublished,
  deleteProduct,
  getAllKategori,
} from '@/lib/services/products';
import { Product } from '@/lib/types';
import { formatRupiahShort } from '@/lib/format';
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight, Package, Image, ShoppingCart, Eye } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const ITEMS_PER_PAGE = 10;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, categoryFilter, products]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts({ published: undefined });
      setProducts(data);
    } catch (error) {
      toast.error('Gagal memuat produk');
      console.error(error);
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
        p.judul.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p =>
        p.kategori.includes(categoryFilter)
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
    console.log('👁️ TOGGLE DEBUG: Starting toggle for ID:', id, 'Current status:', currentStatus);
    
    try {
      console.log('👁️ TOGGLE DEBUG: Calling toggleProductPublished function...');
      await toggleProductPublished(id, !currentStatus);
      
      console.log('👁️ TOGGLE DEBUG: Toggle successful');
      toast.success(`Produk ${!currentStatus ? 'dipublish' : 'disembunyikan'}`);
      
      console.log('👁️ TOGGLE DEBUG: Reloading products...');
      await loadProducts();
      
      console.log('👁️ TOGGLE DEBUG: Complete!');
    } catch (error: any) {
      console.error('👁️ TOGGLE DEBUG: Error occurred:', error);
      console.error('👁️ TOGGLE DEBUG: Error message:', error.message);
      
      const errorMessage = error.message || 'Gagal mengubah status';
      toast.error('Gagal mengubah status: ' + errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    console.log('🗑️ DELETE DEBUG: Starting delete for ID:', deleteId);
    
    try {
      console.log('🗑️ DELETE DEBUG: Calling deleteProduct function...');
      
      // Show loading state
      toast.loading('Menghapus produk...', { id: 'delete-product' });
      
      await deleteProduct(deleteId);
      
      console.log('🗑️ DELETE DEBUG: Delete successful');
      toast.success('Produk berhasil dihapus', { id: 'delete-product' });
      
      console.log('🗑️ DELETE DEBUG: Clearing deleteId and reloading...');
      setDeleteId(null);
      await loadProducts();
      
      console.log('🗑️ DELETE DEBUG: Complete!');
    } catch (error: any) {
      console.error('🗑️ DELETE DEBUG: Error occurred:', error);
      console.error('🗑️ DELETE DEBUG: Error message:', error.message);
      console.error('🗑️ DELETE DEBUG: Full error:', error);
      
      // Show detailed error
      const errorMessage = error.message || 'Gagal menghapus produk';
      toast.error('Gagal menghapus produk: ' + errorMessage, { id: 'delete-product' });
      
      // Don't clear deleteId on error so user can try again
    }
  };

  const handleCreateProduct = async (data: ProductFormData) => {
    try {
      await createProduct(data);
      toast.success('Produk berhasil ditambahkan');
      loadProducts();
      loadCategories();
    } catch (error: any) {
      throw new Error(error.message || 'Gagal menambah produk');
    }
  };

  const handleUpdateProduct = async (data: ProductFormData) => {
    if (!editingProduct) return;

    try {
      await updateProduct(editingProduct.id, data);
      toast.success('Produk berhasil diupdate');
      setEditingProduct(null);
      loadProducts();
      loadCategories();
    } catch (error: any) {
      throw new Error(error.message || 'Gagal update produk');
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingProduct(null);
  };

  const guideSteps = [
    {
      title: 'Selamat Datang di Manajemen Produk',
      description: 'Di halaman ini Anda dapat mengelola semua produk toko Anda. Mari kita lihat fitur-fitur yang tersedia.',
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: 'Tambah Produk Baru',
      description: 'Klik tombol "Tambah Produk" untuk membuat produk baru. Anda dapat upload hingga 4 gambar, atur variasi, harga, dan stok produk.',
      icon: <Plus className="h-5 w-5" />,
    },
    {
      title: 'Upload & Atur Gambar',
      description: 'Upload maksimal 4 gambar per produk. Gunakan tombol panah untuk mengubah urutan. Gambar pertama akan menjadi thumbnail utama.',
      icon: <Image className="h-5 w-5" />,
    },
    {
      title: 'Filter & Pencarian',
      description: 'Gunakan search bar untuk mencari produk dengan cepat. Filter berdasarkan kategori dan status publikasi untuk mempermudah manajemen.',
      icon: <Search className="h-5 w-5" />,
    },
    {
      title: 'Publikasi Produk',
      description: 'Toggle switch untuk mempublikasikan atau menyembunyikan produk. Hanya produk yang dipublikasi yang akan muncul di storefront.',
      icon: <Eye className="h-5 w-5" />,
    },
    {
      title: 'Edit & Hapus',
      description: 'Klik icon pensil untuk edit produk atau icon sampah untuk menghapus. Semua perubahan tersimpan di database secara real-time.',
      icon: <Pencil className="h-5 w-5" />,
    },
  ];

  return (
    <AdminLayout>
      <FeatureGuide storageKey="admin-products-guide" steps={guideSteps} />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Produk</h1>
            <p className="text-muted-foreground">
              Kelola semua produk di toko Anda
            </p>
          </div>
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Produk
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {availableCategories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Gambar</TableHead>
                <TableHead>Produk</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead>Status</TableHead>
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
                    {searchQuery || categoryFilter !== 'all' ? 'Tidak ada produk yang cocok' : 'Belum ada produk. Klik "Tambah Produk" untuk memulai.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.gambar[0] ? (
                        <img
                          src={product.gambar[0]}
                          alt={product.judul}
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
                      <div className="font-medium">{product.judul}</div>
                      <div className="text-xs text-muted-foreground">{product.slug}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.kategori.slice(0, 2).map((kat) => (
                          <Badge key={kat} variant="secondary" className="text-xs">
                            {kat}
                          </Badge>
                        ))}
                        {product.kategori.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{product.kategori.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatRupiahShort(product.base_price)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.stok_total === 0 ? 'destructive' : 'default'}>
                        {product.stok_total}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={product.published}
                        onCheckedChange={() => handleTogglePublish(product.id, product.published)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(product)}
                          title="Edit produk"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            console.log('🗑️ DELETE DEBUG: Button clicked for product:', product.id, product.judul);
                            setDeleteId(product.id);
                          }}
                          title="Hapus produk"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} dari {filteredProducts.length} produk
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Sebelumnya
              </Button>
              <span className="text-sm">
                Halaman {currentPage} dari {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Selanjutnya
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <ProductForm
        open={formOpen}
        onOpenChange={closeForm}
        initialData={editingProduct ? {
          id: editingProduct.id,
          slug: editingProduct.slug,
          judul: editingProduct.judul,
          deskripsi: editingProduct.deskripsi,
          kategori: editingProduct.kategori,
          tag: editingProduct.tag,
          gambar: editingProduct.gambar,
          published: editingProduct.published,
          base_price: editingProduct.base_price,
          highlight_bullets: editingProduct.highlight_bullets,
          variations: editingProduct.variations || [],
        } : undefined}
        onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
        mode={editingProduct ? 'edit' : 'create'}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Produk?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Produk dan semua variasinya akan dihapus permanen dari database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                console.log('🗑️ DELETE DEBUG: AlertDialog confirmed, calling handleDelete');
                handleDelete();
              }} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus Permanen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
