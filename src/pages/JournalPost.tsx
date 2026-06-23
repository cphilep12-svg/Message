import { useParams, Link } from 'react-router'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import { trpc } from '@/providers/trpc'

export default function JournalPost() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery({ slug: slug ?? '' })

  if (isLoading) {
    return (
      <div className="pt-16 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="pt-16 flex flex-col items-center justify-center min-h-screen">
        <p className="text-white/40 mb-4">Article not found</p>
        <Link to="/journal" className="text-[#D4AF37] hover:underline">Back to journal</Link>
      </div>
    )
  }

  return (
    <div className="pt-16">
      {/* Hero image */}
      {post.image && (
        <div className="w-full h-[40vh] sm:h-[50vh] bg-[#1A1A1A] overflow-hidden">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link to="/journal" className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-[#D4AF37] transition-colors mb-8">
          <ArrowLeft className="w-3 h-3" />
          BACK TO JOURNAL
        </Link>

        <span className="text-[10px] font-bold tracking-wider uppercase text-[#D4AF37]">
          {post.category}
        </span>

        <h1 className="font-display text-3xl sm:text-5xl tracking-wider mt-3 mb-6">
          {post.title.toUpperCase()}
        </h1>

        <div className="flex items-center gap-4 text-xs text-white/40 mb-8 pb-8 border-b border-white/5">
          <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
          {post.publishedAt && (
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.publishedAt).toLocaleDateString()}</span>
          )}
        </div>

        <div
          className="prose prose-invert prose-lg max-w-none font-body leading-relaxed text-white/80"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  )
}
