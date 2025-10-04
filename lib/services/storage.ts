import { supabase } from '../supabase/client';

const BUCKET_NAME = 'product-images';

export async function uploadProductImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteProductImage(imageUrl: string): Promise<void> {
  const filePath = imageUrl.split(`${BUCKET_NAME}/`)[1];

  if (!filePath) {
    return;
  }

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    console.error('Delete failed:', error.message);
  }
}

export async function uploadMultipleImages(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(file => uploadProductImage(file));
  return Promise.all(uploadPromises);
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024;
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Format file tidak didukung. Gunakan JPEG, PNG, WebP, atau GIF.'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Ukuran file terlalu besar. Maksimal 5MB per file.'
    };
  }

  return { valid: true };
}
