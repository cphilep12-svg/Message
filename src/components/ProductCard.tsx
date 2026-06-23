import { Link } from 'react-router'
import { ShoppingBag, Heart } from 'lucide-react'
import { trpc } from '@/providers/trpc'

interface ProductCardProps {
  product: {
    id: number
    name: string
    slug: string
    price: string
    comparePrice?: string | null
    featuredImage?: string | null
    stockStatus?: string
  }
  sessionId: string
}

export default function ProductCard({ product, sessionId }: ProductCardProps) {
  const utils = trpc.useUtils()
  const addToCart = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      utils.cart.get.invalidate()
      utils.cart.getCount.invalidate()
    },
  })

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart.mutate({ productId: product.id, quantity: 1, sessionId })
  }

  const isSale = product.comparePrice && Number(product.comparePrice) > Number(product.price)

  return (
    <div className="group relative">
      <Link to={`/shop/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-square bg-[#1A1A1A] rounded-sm overflow-hidden">
          {product.featuredImage ? (
            <img
              src={product.featuredImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20">
              <ShoppingBag className="w-8 h-8" />
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button
              onClick={handleAddToCart}
              className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#D4AF37] transition-colors transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
              title="Add to cart"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
            <button
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-colors transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
              title="Add to wishlist"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* Sale badge */}
          {isSale && (
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#D4AF37] text-black text-[10px] font-bold tracking-wider">
              SALE
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-3 px-1">
          <h3 className="text-sm font-medium text-white group-hover:text-[#D4AF37] transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-semibold">${Number(product.price).toFixed(2)}</span>
            {isSale && product.comparePrice && (
              <span className="text-xs text-white/40 line-through">
                ${Number(product.comparePrice).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
