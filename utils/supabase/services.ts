import { createClient } from './client';
import { Product } from '@/data/products';

export interface CategoryItem {
  id: string;
  label: string;
  description?: string;
  count?: number;
}

export function mapDbProductToProduct(row: any): Product {
  let parsedThumbnails: string[] = [row.image];
  if (Array.isArray(row.thumbnails)) {
    parsedThumbnails = row.thumbnails;
  } else if (typeof row.thumbnails === 'string') {
    try {
      parsedThumbnails = JSON.parse(row.thumbnails);
    } catch {
      parsedThumbnails = [row.image];
    }
  }

  let parsedSpecs = {};
  if (row.specs && typeof row.specs === 'object') {
    parsedSpecs = row.specs;
  } else if (typeof row.specs === 'string') {
    try {
      parsedSpecs = JSON.parse(row.specs);
    } catch {
      parsedSpecs = {};
    }
  }

  return {
    id: row.id,
    name: row.name,
    category: row.category_id || 'khac',
    categoryName: row.category_name || 'Khác',
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    discount: row.discount || undefined,
    rating: row.rating ? Number(row.rating) : 5.0,
    reviewsCount: row.reviews_count ? Number(row.reviews_count) : 0,
    stock: row.stock || 'Còn hàng',
    badge: row.badge || undefined,
    image: row.image,
    thumbnails: parsedThumbnails,
    desc: row.desc || '',
    specs: parsedSpecs,
    status: row.status || 'active',
  };
}

export async function getProductsFromSupabase(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Lỗi khi tải danh sách sản phẩm từ Supabase:', error.message);
    return [];
  }

  return (data || []).map(mapDbProductToProduct);
}

export async function getCategoriesFromSupabase(): Promise<CategoryItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Lỗi khi tải danh mục từ Supabase:', error.message);
    return [];
  }

  return (data || []).map((c: any) => ({
    id: c.id,
    label: c.name,
    description: c.description,
  }));
}

export async function getProductByIdFromSupabase(id: string): Promise<Product | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error(`Không tìm thấy sản phẩm id="${id}" từ Supabase:`, error?.message);
    return null;
  }

  return mapDbProductToProduct(data);
}
