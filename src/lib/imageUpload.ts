import { supabase } from './supabase';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_IMAGES = 5;

export function validateImage(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Unsupported format. Use JPEG, PNG, GIF, or WebP.';
  }
  if (file.size > MAX_SIZE) {
    return 'Image must be under 10MB.';
  }
  return null;
}

export function validateImageCount(currentCount, newCount) {
  if (currentCount + newCount > MAX_IMAGES) {
    return `Maximum ${MAX_IMAGES} images per message.`;
  }
  return null;
}

export function resizeImage(file, maxDim = 1568) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      if (img.width <= maxDim && img.height <= maxDim) {
        resolve(file);
        return;
      }
      const scale = maxDim / Math.max(img.width, img.height);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => resolve(new File([blob], file.name, { type: file.type })),
        file.type,
        0.85
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

export async function uploadImage(file, conversationId) {
  if (!supabase) {
    throw new Error('Image upload not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  const resized = await resizeImage(file);
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${conversationId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from('chat-images')
    .upload(path, resized, { contentType: file.type, upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from('chat-images')
    .getPublicUrl(path);

  return { url: data.publicUrl, media_type: file.type };
}

export async function imageUrlToBase64(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
      resolve({ data: base64, media_type: blob.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
