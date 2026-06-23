import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { ArrowLeft, ShoppingBag, Truck, Shield, Check } from 'lucide-react'
import { trpc } from '@/providers/trpc'

interface ProductPageProps {
  sessionId: string
}

export default function Product({ sessionId }: ProductPageProps) {
  const { slug } = useParams<{ slug: string }>()
  const { data: product, isLoading } = trpc.product.getBySlug.useQuery({ slug: slug ?? '' })
  const utils = trpc.useUtils()
  const addToCart = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      utils.cart.get.invalidate()
      utils.cart.getCount.invalidate()
    },
  })

  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  if (isLoading) {
    return (
      <div className="pt-16 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pt-16 flex flex-col items-center justify-center min-h-screen">
        <p className="text-white/40 mb-4">Product not found</p>
        <Link to="/shop" className="text-[#D4AF37] hover:underline">Back to shop</Link>
      </div>
    )
  }

  const sizes = [...new Set(product.variants?.map(v => v.size) ?? [])]
  const isSale = product.comparePrice && Number(product.comparePrice) > Number(product.price)

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) return
    addToCart.mutate(
      { productId: product.id, quantity, sessionId },
      {
        onSuccess: () => {
          setAdded(true)
          setTimeout(() => setAdded(false), 2000)
        },
      }
    )
  }

  return (
    <div className="pt-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        {/* Breadcrumb */}
        <Link to="/shop" className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-[#D4AF37] transition-colors mb-8">
          <ArrowLeft className="w-3 h-3" />
          BACK TO SHOP
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-[#1A1A1A] rounded-sm overflow-hidden">
              {product.featuredImage && (
                <img
                  src={product.featuredImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((img, i) => (
                  <div key={i} className="aspect-square bg-[#1A1A1A] rounded-sm overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#D4AF37] transition-all">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="lg:py-4">
            <p className="text-xs tracking-[0.2em] text-[#D4AF37] mb-2 uppercase">
              {product.stockStatus === 'in_stock' ? 'In Stock' : product.stockStatus === 'low_stock' ? 'Low Stock' : 'Coming Soon'}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl tracking-wider">{product.name.toUpperCase()}</h1>

            <div className="flex items-center gap-3 mt-4">
              <span className="text-2xl font-semibold">${Number(product.price).toFixed(2)}</span>
              {isSale && product.comparePrice && (
                <span className="text-lg text-white/40 line-through">${Number(product.comparePrice).toFixed(2)}</span>
              )}
            </div>

            {product.verse && (
              <p className="mt-4 font-serif italic text-sm text-[#D4AF37]/80 border-l-2 border-[#D4AF37]/30 pl-4">
                {product.verse}
              </p>
            )}

            <p className="mt-6 text-sm text-white/60 leading-relaxed">{product.description}</p>

            {/* Size selector */}
            {sizes.length > 0 && (
              <div className="mt-8">
                <label className="text-xs tracking-wider text-white/40 mb-3 block">SIZE</label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 flex items-center justify-center text-sm font-semibold border transition-all ${
                        selectedSize === size
                          ? 'border-[#D4AF37] bg-[#D4AF37] text-black'
                          : 'border-white/10 text-white/60 hover:border-white/30'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6">
              <label className="text-xs tracking-wider text-white/40 mb-3 block">QUANTITY</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-white/30 transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-white/30 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={added}
              className={`w-full mt-8 py-4 flex items-center justify-center gap-3 text-sm font-bold tracking-wider transition-all ${
                added
                  ? 'bg-green-600 text-white'
                  : 'bg-[#D4AF37] text-black hover:bg-[#C4A030]'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  ADDED TO CART
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  ADD TO CART
                </>
              )}
            </button>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/5">
              {[
                { icon: Truck, label: 'Free Shipping', sub: 'Orders over $100' },
                { icon: Shield, label: 'Premium Quality', sub: '450gsm Cotton' },
                { icon: Check, label: 'Faith Guarantee', sub: 'Satisfaction assured' },
              ].map((badge) => (
                <div key={badge.label} className="text-center">
                  <badge.icon className="w-5 h-5 mx-auto text-[#D4AF37]" />
                  <p className="text-[10px] font-semibold mt-2 tracking-wider">{badge.label.toUpperCase()}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">{badge.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
