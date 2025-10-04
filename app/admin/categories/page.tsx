'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { FeatureGuide } from '@/components/ui/feature-guide';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/services/categories';
import { Category } from '@/lib/types';
import { Plus, Pencil, Trash2, FolderOpen, Tag, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error: any) {
      toast.error(error.message || 'Gagal memuat kategori');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Nama kategori wajib diisi');
      return;
    }

    if (!formData.slug.trim()) {
      toast.error('Slug kategori wajib diisi');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        toast.success('Kategori berhasil diperbarui');
      } else {
        await createCategory(formData);
        toast.success('Kategori berhasil ditambahkan');
      }
      await loadCategories();
      handleCloseForm();
    } catch (error: any) {
      toast.error(error.message || 'Gagal menyimpan kategori');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    });
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;

    try {
      await deleteCategory(deletingCategory.id);
      toast.success('Kategori berhasil dihapus');
      await loadCategories();
      setDeleteDialogOpen(false);
      setDeletingCategory(null);
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghapus kategori');
    }
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
    });
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const guideSteps = [
    {
      title: 'Manajemen Kategori',
      description: 'Di halaman ini Anda dapat mengelola semua kategori produk. Kategori membantu mengorganisir produk agar mudah ditemukan pelanggan.',
      icon: <FolderOpen className="h-5 w-5" />,
    },
    {
      title: 'Tambah Kategori Baru',
      description: 'Klik tombol "Tambah Kategori" untuk membuat kategori baru. Masukkan nama, slug akan otomatis di-generate, dan tambahkan deskripsi opsional.',
      icon: <Plus className="h-5 w-5" />,
    },
    {
      title: 'Slug Otomatis',
      description: 'Slug adalah URL-friendly version dari nama kategori. Sistem akan otomatis generate slug saat Anda mengetik nama, tapi Anda bisa edit manual jika perlu.',
      icon: <Tag className="h-5 w-5" />,
    },
    {
      title: 'Cari Kategori',
      description: 'Gunakan search bar untuk mencari kategori berdasarkan nama, slug, atau deskripsi. Sangat berguna saat kategori sudah banyak.',
      icon: <Search className="h-5 w-5" />,
    },
    {
      title: 'Edit & Hapus',
      description: 'Klik icon pensil untuk edit kategori atau icon sampah untuk menghapus. Hati-hati saat menghapus kategori yang masih digunakan produk!',
      icon: <Pencil className="h-5 w-5" />,
    },
  ];

  return (
    <AdminLayout>
      <FeatureGuide storageKey="admin-categories-guide" steps={guideSteps} />

      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Kategori</h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Kelola kategori produk toko Anda
            </p>
          </div>
          <Button onClick={() => setFormOpen(true)} size="sm" className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Kategori
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-5 w-32 rounded bg-muted" />
                  <div className="h-4 w-24 rounded bg-muted" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 w-full rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-center text-sm text-muted-foreground">
                {searchQuery
                  ? 'Tidak ada kategori yang sesuai pencarian'
                  : 'Belum ada kategori. Tambahkan kategori pertama Anda!'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="group transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg truncate">
                        {category.name}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm truncate">
                        /{category.slug}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(category)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => {
                          setDeletingCategory(category);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {category.description && (
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground line-clamp-2 sm:text-sm">
                      {category.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        <div className="rounded-lg border bg-muted/50 p-3 sm:p-4">
          <div className="flex items-start gap-3">
            <Tag className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground sm:h-5 sm:w-5" />
            <div className="space-y-1">
              <p className="text-xs font-medium sm:text-sm">Total Kategori</p>
              <p className="text-xl font-bold sm:text-2xl">{categories.length}</p>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Perbarui informasi kategori'
                : 'Buat kategori baru untuk mengorganisir produk Anda'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nama Kategori <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Contoh: Template Design"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug <span className="text-destructive">*</span>
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="template-design"
                required
              />
              <p className="text-xs text-muted-foreground">
                URL-friendly version. Otomatis di-generate dari nama.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi (Opsional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi singkat tentang kategori ini..."
                rows={3}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={handleCloseForm}>
                Batal
              </Button>
              <Button type="submit">
                {editingCategory ? 'Perbarui' : 'Tambah'} Kategori
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda yakin ingin menghapus kategori <strong>{deletingCategory?.name}</strong>?
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingCategory(null)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
