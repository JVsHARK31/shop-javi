import { supabase } from '../supabase/client';

const BUCKET_NAME = 'product-images';

export async function uploadProductImage(file: File): Promise<string> {
  console.log('📤 STORAGE DEBUG: Starting upload for file:', file.name);
  
  // Validate file first
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  console.log('📤 STORAGE DEBUG: Uploading to path:', filePath);

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('📤 STORAGE DEBUG: Upload error:', error);
    
    // Enhanced error messages
    if (error.message.includes('Bucket not found')) {
      throw new Error('Storage bucket belum dikonfigurasi. Silakan jalankan SQL setup di Supabase.');
    } else if (error.message.includes('insufficient_privilege')) {
      throw new Error('Tidak ada izin untuk upload. Pastikan policies sudah dikonfigurasi.');
    } else if (error.message.includes('File too large')) {
      throw new Error('File terlalu besar. Maksimal 5MB per file.');
    } else if (error.message.includes('Invalid file type')) {
      throw new Error('Format file tidak didukung. Gunakan JPEG, PNG, WebP, atau GIF.');
    } else {
      throw new Error(`Upload gagal: ${error.message}`);
    }
  }

  console.log('📤 STORAGE DEBUG: Upload successful');

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  console.log('📤 STORAGE DEBUG: Public URL generated:', publicUrl);

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

export async function uploadMultipleImages(files: File[], currentImagesCount: number = 0): Promise<string[]> {
  // Validasi maksimal 4 gambar per produk
  if (currentImagesCount + files.length > 4) {
    throw new Error('Maksimal 4 gambar per produk');
  }
  
  const uploadPromises = files.map(file => uploadProductImage(file));
  return Promise.all(uploadPromises);
}

/**
 * Validate maximum 4 images for a product
 */
export function validateMaxImages(currentCount: number, newCount: number): { valid: boolean; error?: string } {
  const totalCount = currentCount + newCount;
  
  if (totalCount > 4) {
    return {
      valid: false,
      error: `Maksimal 4 gambar per produk. Saat ini ada ${currentCount} gambar, Anda mencoba menambah ${newCount} lagi.`
    };
  }
  
  return { valid: true };
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

export async function checkStorageBucket(): Promise<{ exists: boolean; error?: string }> {
  try {
    console.log('📦 STORAGE DEBUG: Checking if bucket exists...');
    
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('📦 STORAGE DEBUG: Error listing buckets:', error);
      return { exists: false, error: `Gagal mengecek bucket: ${error.message}` };
    }
    
    const bucketExists = buckets.some(bucket => bucket.id === BUCKET_NAME);
    
    console.log('📦 STORAGE DEBUG: Bucket exists:', bucketExists);
    
    if (!bucketExists) {
      return { 
        exists: false, 
        error: 'Storage bucket belum dikonfigurasi. Jalankan SQL setup di Supabase.' 
      };
    }
    
    return { exists: true };
  } catch (error: any) {
    console.error('📦 STORAGE DEBUG: Unexpected error:', error);
    return { exists: false, error: error.message };
  }
}
