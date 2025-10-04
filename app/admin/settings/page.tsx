'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
          <p className="text-muted-foreground">
            Kelola pengaturan toko Anda
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Configuration</CardTitle>
            <CardDescription>
              Nomor WhatsApp yang digunakan untuk menerima pesanan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
              <Input
                id="whatsapp"
                type="text"
                value="6288290286954"
                disabled
                className="max-w-sm"
              />
              <p className="text-sm text-muted-foreground">
                Nomor ini dikonfigurasi di kode aplikasi
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin Credentials</CardTitle>
            <CardDescription>
              Kredensial login admin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value="admin"
                disabled
                className="max-w-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value="admin123"
                disabled
                className="max-w-sm"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Ubah kredensial ini di file .env (ADMIN_USERNAME dan ADMIN_PASSWORD)
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
