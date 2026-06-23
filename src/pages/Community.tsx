import { useState } from 'react'
import { Send, Instagram, MessageCircle, Users, Heart } from 'lucide-react'
import { trpc } from '@/providers/trpc'

export default function Community() {
  const { data: testimonials } = trpc.testimonial.list.useQuery({ status: 'approved' })
  const createTestimonial = trpc.testimonial.create.useMutation()
  const utils = trpc.useUtils()

  const [form, setForm] = useState({ name: '', email: '', text: '', verse: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.text) return
    createTestimonial.mutate(form, {
      onSuccess: () => {
        setSubmitted(true)
        setForm({ name: '', email: '', text: '', verse: '' })
        utils.testimonial.list.invalidate()
        setTimeout(() => setSubmitted(false), 5000)
      },
    })
  }

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="py-20 sm:py-28 bg-gradient-to-b from-[#1A1A1A] to-black">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <p className="text-xs tracking-[0.2em] text-[#D4AF37] mb-2 uppercase">The Body of Christ</p>
          <h1 className="font-display text-5xl sm:text-7xl tracking-wider">COMMUNITY</h1>
          <p className="mt-4 text-sm text-white/50 max-w-lg mx-auto">
            A space for believers to share testimonies, encourage one another, and wear their faith together.
          </p>
          <div className="flex justify-center gap-6 mt-8">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/60 hover:text-[#D4AF37] transition-colors">
              <Instagram className="w-4 h-4" /> Instagram
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/60 hover:text-[#D4AF37] transition-colors">
              <MessageCircle className="w-4 h-4" /> TikTok
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-y border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, label: 'Community Members', value: '2,400+' },
              { icon: Heart, label: 'Testimonies Shared', value: String(testimonials?.length ?? 0) },
              { icon: Instagram, label: 'Instagram Followers', value: '12K+' },
              { icon: MessageCircle, label: 'Countries Reached', value: '28' },
            ].map((stat) => (
              <div key={stat.label}>
                <stat.icon className="w-5 h-5 mx-auto text-[#D4AF37] mb-2" />
                <p className="font-display text-2xl tracking-wider">{stat.value}</p>
                <p className="text-[10px] text-white/40 tracking-wider mt-1">{stat.label.toUpperCase()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16">
        <h2 className="font-display text-3xl tracking-wider text-center mb-12">TESTIMONIES</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials?.map((t) => (
            <div key={t.id} className="bg-[#1A1A1A] p-6 rounded-sm border-l-4 border-[#D4AF37]">
              <p className="font-serif italic text-white/80 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-sm font-semibold">{t.name}</span>
                {t.verse && <span className="text-[10px] text-[#D4AF37] font-semibold tracking-wider">{t.verse}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit form */}
      <div className="bg-[#0A0A0A] py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl tracking-wider text-center mb-2">SHARE YOUR STORY</h2>
          <p className="text-sm text-white/50 text-center mb-8">
            Your testimony could be the encouragement someone needs today.
          </p>

          {submitted ? (
            <div className="text-center py-8 bg-[#1A1A1A] rounded">
              <Heart className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
              <p className="text-white/80">Thank you for sharing your testimony!</p>
              <p className="text-xs text-white/40 mt-1">It will be reviewed and posted soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name *"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <textarea
                placeholder="Your testimony *"
                value={form.text}
                onChange={e => setForm({ ...form, text: e.target.value })}
                required
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37] resize-none"
              />
              <input
                type="text"
                placeholder="Favorite Bible verse (optional)"
                value={form.verse}
                onChange={e => setForm({ ...form, verse: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                disabled={createTestimonial.isPending}
                className="w-full py-3.5 bg-[#D4AF37] text-black text-sm font-bold tracking-wider hover:bg-[#C4A030] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {createTestimonial.isPending ? 'SENDING...' : 'SUBMIT TESTIMONY'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
