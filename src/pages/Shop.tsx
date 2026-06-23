import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { SlidersHorizontal } from 'lucide-react'
import { trpc } from '@/providers/trpc'
import ProductCard from '@/components/ProductCard'

interface ShopProps {
  sessionId: string
}

export default function Shop({ sessionId }: ShopProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const collectionSlug = searchParams.get('collection') ?? undefined
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: products, isLoading } = trpc.product.list.useQuery({
    collection: collectionSlug,
    search: searchQuery || undefined,
    status: 'active',
  })
  const { data: collections } = trpc.collection.list.useQuery()

  const activeCollection = collections?.find(c => c.slug === collectionSlug)

  // Collection colors for visual variety
  const collectionColors: Record<string, string> = {
    hoodies: 'from-amber-900/20 to-black',
    tees: 'from-stone-800/20 to-black',
    caps: 'from-yellow-900/20 to-black',
    accessories: 'from-neutral-800/20 to-black',
    'built-by-faith': 'from-amber-900/30 to-black',
    ommema: 'from-yellow-900/30 to-black',
  }

  return (
    <div className="pt-16">
      {/* Hero banner */}
      <div className={`relative py-20 sm:py-28 bg-gradient-to-b ${collectionSlug ? (collectionColors[collectionSlug] ?? 'from-[#1A1A1A] to-black') : 'from-[#1A1A1A] to-black'}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <p className="text-xs tracking-[0.2em] text-[#D4AF37] mb-2 uppercase">Shop</p>
          <h1 className="font-display text-5xl sm:text-7xl tracking-wider">
            {activeCollection ? activeCollection.name.toUpperCase() : 'ALL PRODUCTS'}
          </h1>
          {activeCollection?.description && (
            <p className="mt-3 text-sm text-white/50 max-w-md">{activeCollection.description}</p>
          )}
        </div>
      </div>

      {/* Filters bar */}
      <div className="sticky top-16 z-30 bg-black/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-xs tracking-wider text-white/60 hover:text-[#D4AF37] transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            FILTERS
          </button>
          <div className="flex-1" />
          <div className="text-xs text-white/40">
            {products?.length ?? 0} PRODUCTS
          </div>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-[#1A1A1A] border-b border-white/5">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSearchParams({})}
                className={`px-4 py-2 text-xs tracking-wider border transition-colors ${
                  !collectionSlug ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-white/10 text-white/60 hover:border-white/30'
                }`}
              >
                ALL
              </button>
              {collections?.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSearchParams({ collection: c.slug })}
                  className={`px-4 py-2 text-xs tracking-wider border transition-colors ${
                    collectionSlug === c.slug ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-white/10 text-white/60 hover:border-white/30'
                  }`}
                >
                  {c.name.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full max-w-sm bg-white/5 border border-white/10 rounded px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Product grid */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} sessionId={sessionId} />
            ))}
          </div>
        )}

        {!isLoading && (!products || products.length === 0) && (
          <div className="text-center py-20">
            <p className="text-white/40">No products found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
