import { Link } from 'react-router'
import { Instagram, MessageCircle } from 'lucide-react'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="bg-[#1A1A1A] border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="font-display text-4xl tracking-wider text-white">
              MESSAGE
            </Link>
            <p className="mt-4 text-sm text-white/50 leading-relaxed">
              Luxury Christian streetwear that speaks truth. Wear your faith. Start the conversation.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4AF37]/20 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4AF37]/20 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg tracking-wider text-white mb-6">SHOP</h4>
            <ul className="space-y-3">
              {['Hoodies', 'T-Shirts', 'Caps', 'Accessories', 'Collections'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/shop${item === 'Collections' ? '' : `?collection=${item.toLowerCase().replace('-shirts', 's')}`}`}
                    className="text-sm text-white/50 hover:text-[#D4AF37] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display text-lg tracking-wider text-white mb-6">COMPANY</h4>
            <ul className="space-y-3">
              {[
                { label: 'About', href: '/about' },
                { label: 'Journal', href: '/journal' },
                { label: 'Community', href: '/community' },
                { label: 'Contact', href: '/contact' },
                { label: 'Shipping', href: '/contact' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-sm text-white/50 hover:text-[#D4AF37] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display text-lg tracking-wider text-white mb-6">JOIN THE FAMILY</h4>
            <p className="text-sm text-white/50 mb-4">Subscribe for new releases and exclusive offers.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 bg-white/5 border border-white/10 rounded px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#D4AF37] text-black text-sm font-semibold rounded hover:bg-[#C4A030] transition-colors"
              >
                {subscribed ? 'DONE' : 'JOIN'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} MESSAGE. All rights reserved. Find What God Is Saying.
          </p>
          <div className="flex gap-6">
            <Link to="/contact" className="text-xs text-white/30 hover:text-white/60 transition-colors">Privacy</Link>
            <Link to="/contact" className="text-xs text-white/30 hover:text-white/60 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
