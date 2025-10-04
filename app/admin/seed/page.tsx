'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { seedDemoProducts } from '@/lib/seed-data';
import { toast } from 'sonner';
import { Database } from 'lucide-react';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      await seedDemoProducts();
      setSuccess(true);
      toast.success('Data demo berhasil ditambahkan!');
    } catch (error) {
      toast.error('Gagal menambahkan data demo');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seed Data</h1>
          <p className="text-muted-foreground">
            Tambahkan data demo produk untuk testing
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Seed Demo Products
            </CardTitle>
            <CardDescription>
              Ini akan menambahkan 3 produk demo ke database:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Template Website E-commerce (2 variasi)</li>
              <li>E-book Panduan Digital Marketing (2 variasi)</li>
              <li>Preset Lightroom Mobile (3 variasi)</li>
            </ul>

            <div className="pt-4">
              <Button
                onClick={handleSeed}
                disabled={loading || success}
                size="lg"
              >
                {loading ? 'Menambahkan...' : success ? 'Berhasil Ditambahkan!' : 'Tambahkan Data Demo'}
              </Button>
            </div>

            {success && (
              <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
                Data demo berhasil ditambahkan! Anda dapat melihatnya di halaman Produk atau di storefront.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
