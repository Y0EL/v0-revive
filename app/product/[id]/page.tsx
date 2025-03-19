import { products, getProductById } from "@/data/products"
import ProductClient from './ProductClient'

// Generate static params for all products (Server Component function)
export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id.toString()
  }))
}

// Server Component - kita tambahkan async sebelum fungsi
export default async function ProductPage({ params }: { params: { id: string } }) {
  // Pastikan params.id ditangani dengan benar
  const id = params.id.toString();
  
  // Dapatkan produk secara async untuk memastikan tidak ada error dynamic API
  const product = await Promise.resolve(getProductById(id));
  
  // Jika produk tidak ditemukan, kita bisa menanganinya
  if (!product) {
    return <div className="container py-20">
      <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
      <p>The product you're looking for doesn't exist.</p>
    </div>
  }
  
  // Pass data ke client component
  return <ProductClient product={product} productId={id} />
}

