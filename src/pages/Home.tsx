import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router'
import { ArrowRight, RefreshCw } from 'lucide-react'
import { trpc } from '@/providers/trpc'
import ProductCard from '@/components/ProductCard'

interface HomeProps {
  sessionId: string
}

// ── Hero Section ───────────────────────────────────────────
function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight

    const words = ["TRUST GOD", "OMMEMA", "NEVER GIVE UP", "BUILT BY FAITH", "KEEP GOING", "I TRUST IN GOD"]
    const wordObjects = words.map((word) => ({
      word,
      x: Math.random() * w * 0.6 + w * 0.2,
      y: Math.random() * h * 0.6 + h * 0.2,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: 0,
      targetOpacity: 0.15 + Math.random() * 0.25,
      size: 14 + Math.random() * 10,
    }))

    let time = 0

    function animate() {
      if (!ctx) return
      time += 0.005
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, w, h)

      // Draw god rays
      const centerX = w * 0.5
      const centerY = h * 0.35
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + time * 0.3
        const length = h * 1.2
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(centerX + Math.cos(angle) * length, centerY + Math.sin(angle) * length)
        ctx.strokeStyle = `rgba(212, 175, 55, ${0.015 + Math.sin(time + i) * 0.008})`
        ctx.lineWidth = 60 + Math.sin(time * 0.7 + i) * 20
        ctx.stroke()
      }

      // Glow center
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, w * 0.4)
      gradient.addColorStop(0, `rgba(212, 175, 55, ${0.08 + Math.sin(time * 2) * 0.03})`)
      gradient.addColorStop(0.5, `rgba(212, 175, 55, ${0.02 + Math.sin(time * 2) * 0.01})`)
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, w, h)

      // Draw floating words
      wordObjects.forEach((obj) => {
        obj.opacity += (obj.targetOpacity - obj.opacity) * 0.01
        obj.x += obj.vx
        obj.y += obj.vy

        if (obj.x < 0 || obj.x > w) obj.vx *= -1
        if (obj.y < 0 || obj.y > h) obj.vy *= -1

        ctx.save()
        ctx.font = `600 ${obj.size}px Montserrat`
        ctx.fillStyle = `rgba(212, 175, 55, ${obj.opacity})`
        ctx.textAlign = 'center'
        ctx.fillText(obj.word, obj.x, obj.y)
        ctx.restore()
      })

      animRef.current = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <p className="text-xs sm:text-sm tracking-[0.3em] text-[#D4AF37] mb-6 uppercase font-medium">
          Find What God Is Saying
        </p>
        <h1 className="font-display text-[80px] sm:text-[120px] lg:text-[160px] leading-none tracking-wider text-white">
          MESSAGE
        </h1>
        <p className="mt-4 text-sm sm:text-base text-white/50 tracking-wide">
          Luxury Christian Streetwear
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link
            to="/shop"
            className="px-8 py-3.5 bg-white text-black text-sm font-bold tracking-wider hover:bg-[#D4AF37] transition-colors"
          >
            SHOP COLLECTION
          </Link>
          <Link
            to="/about"
            className="px-8 py-3.5 border border-[#D4AF37] text-[#D4AF37] text-sm font-bold tracking-wider hover:bg-[#D4AF37] hover:text-black transition-colors"
          >
            DISCOVER MESSAGE
          </Link>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-gradient-to-t from-black to-transparent z-10" />
    </section>
  )
}

// ── Manifesto Bar ──────────────────────────────────────────
function ManifestoBar() {
  return (
    <div className="bg-[#1A1A1A] py-4">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12 text-center">
          {[
            { text: 'BUILT BY ', highlight: 'FAITH' },
            { text: 'TRUST IN ', highlight: 'GOD' },
            { text: 'NEVER GIVE ', highlight: 'UP' },
          ].map((item, i) => (
            <span key={i} className="text-xs sm:text-sm tracking-[0.15em] font-semibold">
              {item.text}
              <span className="text-[#D4AF37]">{item.highlight}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Featured Products ──────────────────────────────────────
function FeaturedProducts({ sessionId }: { sessionId: string }) {
  const { data: products } = trpc.product.getFeatured.useQuery()

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.2em] text-[#D4AF37] mb-2 uppercase">New Arrivals</p>
            <h2 className="font-display text-4xl sm:text-5xl tracking-wider">FEATURED</h2>
          </div>
          <Link to="/shop" className="hidden sm:flex items-center gap-2 text-sm text-white/60 hover:text-[#D4AF37] transition-colors">
            VIEW ALL <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} sessionId={sessionId} />
          ))}
        </div>
        <div className="sm:hidden mt-8 text-center">
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-[#D4AF37] transition-colors">
            VIEW ALL <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── Collections Section ────────────────────────────────────
function CollectionsSection() {
  const { data: collections } = trpc.collection.list.useQuery()
  const displayCollections = collections?.slice(0, 3) ?? []

  return (
    <section className="py-20 sm:py-28 bg-[#0A0A0A]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="mb-12">
          <p className="text-xs tracking-[0.2em] text-[#D4AF37] mb-2 uppercase">Explore</p>
          <h2 className="font-display text-4xl sm:text-5xl tracking-wider">THE COLLECTION</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {displayCollections.map((collection, i) => (
            <Link
              key={collection.id}
              to={`/shop?collection=${collection.slug}`}
              className={`group relative overflow-hidden ${i === 0 ? 'md:row-span-2' : ''}`}
            >
              <div className={`relative ${i === 0 ? 'h-[400px] md:h-[600px]' : 'h-[200px] md:h-[296px]'} overflow-hidden`}>
                {collection.image && (
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-3xl tracking-wider text-white group-hover:text-[#D4AF37] transition-colors">
                    {collection.name.toUpperCase()}
                  </h3>
                  <div className="w-12 h-0.5 bg-[#D4AF37] mt-2 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Prayer Board ───────────────────────────────────────────
function PrayerBoard() {
  const { data: testimonials } = trpc.testimonial.list.useQuery({ status: 'approved' })

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.2em] text-[#D4AF37] mb-2 uppercase">Community</p>
          <h2 className="font-display text-4xl sm:text-5xl tracking-wider">THE PRAYER BOARD</h2>
          <p className="mt-3 text-sm text-white/50">Share your testimony. Inspire the community.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto" style={{ perspective: '1000px' }}>
          {testimonials?.map((t, i) => (
            <div
              key={t.id}
              className="bg-white text-black p-6 rounded-sm border-l-4 border-[#D4AF37] transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
              style={{
                transform: `rotateZ(${(i - 1) * 1}deg)`,
              }}
            >
              <p className="text-sm leading-relaxed text-black/80 italic font-serif">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-4 pt-4 border-t border-black/10 flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider">{t.name}</span>
                {t.verse && (
                  <span className="text-[10px] text-[#D4AF37] font-semibold tracking-wider">{t.verse}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/community"
            className="inline-flex items-center gap-2 px-8 py-3 border border-[#D4AF37] text-[#D4AF37] text-sm font-bold tracking-wider hover:bg-[#D4AF37] hover:text-black transition-colors"
          >
            SHARE YOUR STORY
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── Scripture Discovery Grid ───────────────────────────────
function ScriptureDiscovery() {
  const gridLetters = [
    ['B', 'U', 'I', 'L', 'T', 'B', 'Y', 'F'],
    ['A', 'T', 'R', 'U', 'S', 'T', 'G', 'O'],
    ['D', 'I', 'E', 'V', 'O', 'T', 'E', 'D'],
    ['K', 'E', 'E', 'P', 'G', 'O', 'I', 'N'],
    ['N', 'E', 'V', 'E', 'R', 'G', 'I', 'V'],
    ['E', 'U', 'P', 'H', 'O', 'L', 'D', 'U'],
    ['P', 'R', 'A', 'Y', 'E', 'R', 'F', 'U'],
    ['L', 'S', 'T', 'R', 'E', 'N', 'G', 'T'],
  ]

  const wordMap: Record<string, string> = {
    'TRUST': 'Trust in the Lord with all your heart. \u2014 Proverbs 3:5',
    'FAITH': 'Now faith is the substance of things hoped for. \u2014 Hebrews 11:1',
    'PRAYER': 'Pray without ceasing. \u2014 1 Thessalonians 5:17',
    'NEVERGIVEUP': 'Let us not grow weary in doing good. \u2014 Galatians 6:9',
    'STRENGTH': 'The Lord is my strength and my shield. \u2014 Psalm 28:7',
  }

  const wordPositions: Record<string, Array<[number, number]>> = {
    'TRUST': [[1,1],[1,2],[1,3],[1,4],[1,5]],
    'FAITH': [[0,5],[1,5],[2,5],[3,5],[4,5]],
    'PRAYER': [[6,0],[6,1],[6,2],[6,3],[6,4],[6,5]],
    'NEVERGIVEUP': [[4,0],[4,1],[4,2],[4,3],[4,4],[5,2],[5,3],[5,4],[5,5],[5,6],[5,7]],
    'STRENGTH': [[7,1],[7,2],[7,3],[7,4],[7,5],[7,6],[7,7]],
  }

  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set())
  const [foundVerse, setFoundVerse] = useState<string | null>(null)

  const toggleCell = useCallback((row: number, col: number) => {
    const key = `${row}-${col}`
    setSelectedCells(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }

      // Check for words
      const selectedArray = Array.from(next)
      for (const [word, positions] of Object.entries(wordPositions)) {
        if (positions.every(([r, c]) => selectedArray.includes(`${r}-${c}`))) {
          setFoundVerse(wordMap[word])
          break
        }
      }

      return next
    })
  }, [])

  const refresh = useCallback(() => {
    setSelectedCells(new Set())
    setFoundVerse(null)
  }, [])

  return (
    <section className="py-20 sm:py-28 bg-[#0A0A0A]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.2em] text-[#D4AF37] mb-2 uppercase">Interactive</p>
          <h2 className="font-display text-4xl sm:text-5xl tracking-wider text-[#D4AF37]">FIND YOUR MESSAGE</h2>
          <p className="mt-3 text-sm text-white/50">Tap the words that speak to you.</p>
        </div>

        <div className="flex flex-col items-center gap-8">
          {/* Grid */}
          <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
            {gridLetters.map((row, rowIndex) =>
              row.map((letter, colIndex) => {
                const key = `${rowIndex}-${colIndex}`
                const isSelected = selectedCells.has(key)
                return (
                  <button
                    key={key}
                    onClick={() => toggleCell(rowIndex, colIndex)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-sm sm:text-base font-bold transition-all duration-200 ${
                      isSelected
                        ? 'bg-[#D4AF37] text-black scale-110'
                        : 'bg-[#1A1A1A] text-white hover:bg-[#2A2A2A]'
                    }`}
                  >
                    {letter}
                  </button>
                )
              })
            )}
          </div>

          {/* Verse reveal */}
          {foundVerse && (
            <div className="max-w-lg text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="font-serif italic text-lg text-[#D4AF37] border-l-4 border-[#D4AF37] pl-4">
                {foundVerse}
              </p>
            </div>
          )}

          {/* Refresh */}
          <button
            onClick={refresh}
            className="flex items-center gap-2 px-6 py-2.5 border border-[#D4AF37]/50 text-[#D4AF37] text-sm hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            REFRESH PUZZLE
          </button>
        </div>
      </div>
    </section>
  )
}

// ── Main Home Page ─────────────────────────────────────────
export default function Home({ sessionId }: HomeProps) {
  return (
    <div>
      <HeroSection />
      <ManifestoBar />
      <FeaturedProducts sessionId={sessionId} />
      <CollectionsSection />
      <PrayerBoard />
      <ScriptureDiscovery />
    </div>
  )
}
