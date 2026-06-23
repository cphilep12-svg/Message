import { Link } from 'react-router'
import { ArrowRight, BookOpen } from 'lucide-react'
import { trpc } from '@/providers/trpc'

const categoryColors: Record<string, string> = {
  faith: 'text-[#D4AF37]',
  purpose: 'text-purple-400',
  growth: 'text-green-400',
  streetwear: 'text-blue-400',
  lifestyle: 'text-pink-400',
}

export default function Journal() {
  const { data: posts, isLoading } = trpc.blog.list.useQuery()

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="py-20 sm:py-28 bg-gradient-to-b from-[#1A1A1A] to-black">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <p className="text-xs tracking-[0.2em] text-[#D4AF37] mb-2 uppercase">Read & Reflect</p>
          <h1 className="font-display text-5xl sm:text-7xl tracking-wider">THE JOURNAL</h1>
          <p className="mt-4 text-sm text-white/50 max-w-lg">
            Stories of faith, purpose, and the intersection of streetwear and spirituality.
          </p>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts?.map((post) => (
              <Link key={post.id} to={`/journal/${post.slug}`} className="group">
                <div className="aspect-[16/10] bg-[#1A1A1A] rounded-sm overflow-hidden mb-4">
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-[10px] font-bold tracking-wider uppercase ${categoryColors[post.category] ?? 'text-white/40'}`}>
                    {post.category}
                  </span>
                  <span className="text-[10px] text-white/20">|</span>
                  <span className="text-[10px] text-white/40">{post.author}</span>
                </div>
                <h3 className="font-display text-xl tracking-wider group-hover:text-[#D4AF37] transition-colors">
                  {post.title.toUpperCase()}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 text-sm text-white/40 line-clamp-2">{post.excerpt}</p>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-[#D4AF37] mt-3 group-hover:gap-2 transition-all">
                  READ MORE <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && (!posts || posts.length === 0) && (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/40">No articles yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
