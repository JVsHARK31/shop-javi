'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getCategories } from '@/lib/services/categories';
import { uploadProductImage, validateImageFile, deleteProductImage } from '@/lib/services/storage';
import { X, Plus, Upload, Loader as Loader2, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface ProductVariation {
  id?: string;
  nama_variasi: string;
  price: number;
  sku: string;
  stok: number;
  is_default: boolean;
  sort_order: number;
}

export interface ProductFormData {
  id?: string;
  slug: string;
  judul: string;
  deskripsi: string;
  kategori: string[];
  tag: string[];
  gambar: string[];
  published: boolean;
  base_price: number;
  highlight_bullets: string[];
  variations: ProductVariation[];
}

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => Promise<void>;
  mode: 'create' | 'edit';
}

export function ProductForm({ open, onOpenChange, initialData, onSubmit, mode }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    slug: '',
    judul: '',
    deskripsi: '',
    kategori: [],
    tag: [],
    gambar: [],
    published: false,
    base_price: 0,
    highlight_bullets: [],
    variations: [],
  });

  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newBullet, setNewBullet] = useState('');
  const [newImage, setNewImage] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        slug: '',
        judul: '',
        deskripsi: '',
        kategori: [],
        tag: [],
        gambar: [],
        published: false,
        base_price: 0,
        highlight_bullets: [],
        variations: [],
      });
    }
  }, [initialData, open]);

  const loadCategories = async () => {
    try {
      const cats = await getCategories();
      setAvailableCategories(cats.map(c => c.name));
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleJudulChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      judul: value,
      slug: mode === 'create' ? generateSlug(value) : prev.slug,
    }));
  };

  const addCategory = (category: string) => {
    if (category && !formData.kategori.includes(category)) {
      setFormData(prev => ({
        ...prev,
        kategori: [...prev.kategori, category],
      }));
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      kategori: prev.kategori.filter(k => k !== category),
    }));
  };

  const addTag = () => {
    if (newTag && !formData.tag.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tag: [...prev.tag, newTag],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tag: prev.tag.filter(t => t !== tag),
    }));
  };

  const addBullet = () => {
    if (newBullet) {
      setFormData(prev => ({
        ...prev,
        highlight_bullets: [...prev.highlight_bullets, newBullet],
      }));
      setNewBullet('');
    }
  };

  const removeBullet = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlight_bullets: prev.highlight_bullets.filter((_, i) => i !== index),
    }));
  };

  const addImage = () => {
    if (newImage) {
      if (formData.gambar.length >= 4) {
        toast.error('Maksimal 4 gambar per produk');
        return;
      }
      setFormData(prev => ({
        ...prev,
        gambar: [...prev.gambar, newImage],
      }));
      setNewImage('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 4 - formData.gambar.length;
    if (remainingSlots <= 0) {
      toast.error('Maksimal 4 gambar per produk');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      toast.warning(`Hanya ${remainingSlots} gambar yang akan diupload (maksimal 4 total)`);
    }

    setUploadingImage(true);
    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        const validation = validateImageFile(file);

        if (!validation.valid) {
          toast.error(validation.error);
          continue;
        }

        const url = await uploadProductImage(file);
        uploadedUrls.push(url);
        toast.success(`Gambar ${i + 1} berhasil diupload`);
      }

      if (uploadedUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          gambar: [...prev.gambar, ...uploadedUrls],
        }));
      }
    } catch (error: any) {
      toast.error(error.message || 'Gagal upload gambar');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gambar: prev.gambar.filter((_, i) => i !== index),
    }));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    setFormData(prev => {
      const newGambar = [...prev.gambar];
      const [removed] = newGambar.splice(fromIndex, 1);
      newGambar.splice(toIndex, 0, removed);
      return { ...prev, gambar: newGambar };
    });
  };

  const addVariation = () => {
    const newVariation: ProductVariation = {
      nama_variasi: `Variasi ${formData.variations.length + 1}`,
      price: formData.base_price,
      sku: `SKU-${Date.now()}`,
      stok: 0,
      is_default: formData.variations.length === 0,
      sort_order: formData.variations.length,
    };
    setFormData(prev => ({
      ...prev,
      variations: [...prev.variations, newVariation],
    }));
  };

  const updateVariation = (index: number, field: keyof ProductVariation, value: any) => {
    setFormData(prev => ({
      ...prev,
      variations: prev.variations.map((v, i) =>
        i === index ? { ...v, [field]: value } : v
      ),
    }));
  };

  const removeVariation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.judul || !formData.slug) {
      toast.error('Judul dan slug harus diisi');
      return;
    }

    if (formData.kategori.length === 0) {
      toast.error('Pilih minimal 1 kategori');
      return;
    }

    if (formData.gambar.length === 0) {
      toast.error('Tambahkan minimal 1 gambar');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Gagal menyimpan produk');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Tambah Produk Baru' : 'Edit Produk'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Isi form di bawah untuk menambah produk baru'
              : 'Ubah informasi produk dan klik simpan'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="judul">Judul Produk *</Label>
              <Input
                id="judul"
                value={formData.judul}
                onChange={(e) => handleJudulChange(e.target.value)}
                placeholder="Masukkan judul produk"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="url-friendly-slug"
                required
              />
              <p className="text-xs text-muted-foreground">
                URL: /produk/{formData.slug}
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                value={formData.deskripsi}
                onChange={(e) => setFormData(prev => ({ ...prev, deskripsi: e.target.value }))}
                placeholder="Deskripsi lengkap produk"
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <Label>Kategori *</Label>
              <div className="flex gap-2">
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  <option value="">Pilih kategori</option>
                  {availableCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <Button type="button" onClick={() => addCategory(newCategory)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.kategori.map(kat => (
                  <Badge key={kat} variant="secondary" className="gap-1">
                    {kat}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeCategory(kat)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Tag</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Tambah tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tag.map(tag => (
                  <Badge key={tag} variant="outline" className="gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Gambar Produk *</Label>
                <span className="text-xs text-muted-foreground">
                  {formData.gambar.length} / 4 gambar
                </span>
              </div>

              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage || formData.gambar.length >= 4}
                  className="w-full"
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      {formData.gambar.length >= 4 ? 'Maksimal 4 Gambar' : 'Upload Gambar (Max 5MB)'}
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Format: JPEG, PNG, WebP, GIF. Maksimal 4 gambar. Gambar pertama akan menjadi thumbnail.
                </p>
              </div>

              <div className="text-xs text-muted-foreground">atau masukkan URL gambar:</div>
              <div className="flex gap-2">
                <Input
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                  disabled={formData.gambar.length >= 4}
                />
                <Button
                  type="button"
                  onClick={addImage}
                  variant="outline"
                  disabled={formData.gambar.length >= 4}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formData.gambar.length > 0 && (
                <div className="space-y-2 mt-3">
                  <div className="text-xs text-muted-foreground">
                    Gunakan tombol panah untuk mengubah urutan gambar (gambar pertama = thumbnail utama)
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {formData.gambar.map((img, idx) => (
                      <div key={idx} className="relative group border rounded-lg p-2 bg-muted/20">
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <img
                              src={img}
                              alt={`Product ${idx + 1}`}
                              className="w-full h-32 object-cover rounded border bg-white"
                            />
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-xs font-medium">
                                {idx === 0 ? '🌟 Thumbnail Utama' : `Gambar ${idx + 1}`}
                              </span>
                              <div className="flex gap-1">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => moveImage(idx, idx - 1)}
                                  disabled={idx === 0}
                                  title="Pindah ke kiri"
                                >
                                  <ChevronLeft className="h-3 w-3" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => moveImage(idx, idx + 1)}
                                  disabled={idx === formData.gambar.length - 1}
                                  title="Pindah ke kanan"
                                >
                                  <ChevronRight className="h-3 w-3" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => removeImage(idx)}
                                  title="Hapus gambar"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Highlight / Fitur Utama</Label>
              <div className="flex gap-2">
                <Input
                  value={newBullet}
                  onChange={(e) => setNewBullet(e.target.value)}
                  placeholder="Fitur unggulan produk"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBullet())}
                />
                <Button type="button" onClick={addBullet}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <ul className="space-y-1">
                {formData.highlight_bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <span>• {bullet}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBullet(idx)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="base_price">Harga Dasar</Label>
                <Input
                  id="base_price"
                  type="number"
                  value={formData.base_price}
                  onChange={(e) => setFormData(prev => ({ ...prev, base_price: Number(e.target.value) }))}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                />
                <Label htmlFor="published">Publish Produk</Label>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <Label>Variasi Produk</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Setiap variasi memiliki harga dan stok sendiri
                  </p>
                </div>
                <Button type="button" size="sm" onClick={addVariation}>
                  <Plus className="h-4 w-4 mr-1" />
                  Tambah Variasi
                </Button>
              </div>
              <div className="space-y-3">
                {formData.variations.map((variation, idx) => (
                  <div key={idx} className="border rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">Variasi {idx + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariation(idx)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Nama Variasi</Label>
                        <Input
                          placeholder="Contoh: Lisensi Personal"
                          value={variation.nama_variasi}
                          onChange={(e) => updateVariation(idx, 'nama_variasi', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">SKU</Label>
                        <Input
                          placeholder="SKU-001"
                          value={variation.sku}
                          onChange={(e) => updateVariation(idx, 'sku', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Harga (Rp)</Label>
                        <Input
                          type="number"
                          placeholder="50000"
                          value={variation.price}
                          onChange={(e) => updateVariation(idx, 'price', Number(e.target.value))}
                          min="0"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Stok Tersedia</Label>
                        <Input
                          type="number"
                          placeholder="100"
                          value={variation.stok}
                          onChange={(e) => updateVariation(idx, 'stok', Number(e.target.value))}
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={variation.is_default}
                        onCheckedChange={(checked) => updateVariation(idx, 'is_default', checked)}
                      />
                      <span className="text-sm text-muted-foreground">Default variasi</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : mode === 'create' ? 'Tambah Produk' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
