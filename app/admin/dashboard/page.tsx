'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProducts } from '@/lib/services/products';
import { Product } from '@/lib/types';
import { Package, CircleCheck as CheckCircle2, CircleAlert as AlertCircle } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    publishedProducts: 0,
    lowStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const allProducts = await getProducts({ published: undefined });

        const published = allProducts.filter(p => p.published).length;
        const lowStock = allProducts.filter(p => (p.stok_total ?? 0) > 0 && (p.stok_total ?? 0) <= 5).length;

        setStats({
          totalProducts: allProducts.length,
          publishedProducts: published,
          lowStockProducts: lowStock,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Selamat datang di admin panel Javier_shark006 Shop
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Produk
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats.totalProducts}
              </div>
              <p className="text-xs text-muted-foreground">
                Semua produk di sistem
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Produk Published
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats.publishedProducts}
              </div>
              <p className="text-xs text-muted-foreground">
                Produk aktif di katalog
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Stok Rendah
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats.lowStockProducts}
              </div>
              <p className="text-xs text-muted-foreground">
                Produk dengan stok ≤ 5
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Panduan Cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Mengelola Produk</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Gunakan menu <strong>Produk</strong> untuk menambah, mengedit, atau menghapus produk</li>
                <li>Setiap produk harus memiliki minimal 1 variasi</li>
                <li>Toggle status Published untuk menampilkan/menyembunyikan produk</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Kategori & Tag</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Kelola kategori di menu <strong>Kategori</strong></li>
                <li>Gunakan kategori dan tag untuk memudahkan filtering produk</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
