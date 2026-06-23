import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { ShoppingBag, Menu, X, Search, User, Heart } from 'lucide-react'
import { trpc } from '@/providers/trpc'
import { useAuth } from '@/hooks/useAuth'

interface HeaderProps {
  onCartClick: () => void
  sessionId: string
}

export default function Header({ onCartClick, sessionId }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { user, isAdmin } = useAuth()

  const { data: cartCount } = trpc.cart.getCount.useQuery(
    { sessionId },
    { refetchInterval: 5000 }
  )

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const isActive = (path: string) => location.pathname === path

  const navLinks = [
    { label: 'HOODIES', href: '/shop?collection=hoodies' },
    { label: 'TEES', href: '/shop?collection=tees' },
    { label: 'ACCESSORIES', href: '/shop?collection=caps' },
    { label: 'COLLECTIONS', href: '/shop' },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-black/90 backdrop-blur-md border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-10 max-w-[1440px] mx-auto">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 -ml-2"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link to="/" className="font-display text-2xl tracking-wider text-white hover:text-[#D4AF37] transition-colors">
            MESSAGE
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`text-xs font-semibold tracking-[0.15em] transition-colors ${
                  isActive(link.href) ? 'text-[#D4AF37]' : 'text-white/80 hover:text-[#D4AF37]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/shop" className="hidden sm:block p-2 hover:text-[#D4AF37] transition-colors">
              <Search className="w-4 h-4" />
            </Link>
            {user ? (
              <Link to={isAdmin ? '/admin' : '/'} className="hidden sm:block p-2 hover:text-[#D4AF37] transition-colors">
                <User className="w-4 h-4" />
              </Link>
            ) : (
              <a
                href={`/api/oauth/callback`}
                onClick={(e) => {
                  e.preventDefault()
                  const redirectUri = `${window.location.origin}/api/oauth/callback`
                  const state = btoa(redirectUri)
                  const authUrl = `${import.meta.env.VITE_KIMI_AUTH_URL}/api/oauth/authorize?client_id=${import.meta.env.VITE_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=profile&state=${state}`
                  window.location.href = authUrl
                }}
                className="hidden sm:block p-2 hover:text-[#D4AF37] transition-colors"
              >
                <User className="w-4 h-4" />
              </a>
            )}
            <Link to="/community" className="hidden sm:block p-2 hover:text-[#D4AF37] transition-colors">
              <Heart className="w-4 h-4" />
            </Link>
            <button
              onClick={onCartClick}
              className="relative p-2 hover:text-[#D4AF37] transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount ? (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#D4AF37] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8">
          {navLinks.map((link, i) => (
            <Link
              key={link.label}
              to={link.href}
              className="font-display text-4xl tracking-wider text-white hover:text-[#D4AF37] transition-colors"
              style={{ animationDelay: `${i * 50}ms` }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-6 mt-8">
            <Link to="/journal" className="text-sm text-white/60 hover:text-[#D4AF37]" onClick={() => setMobileMenuOpen(false)}>JOURNAL</Link>
            <Link to="/community" className="text-sm text-white/60 hover:text-[#D4AF37]" onClick={() => setMobileMenuOpen(false)}>COMMUNITY</Link>
            <Link to="/about" className="text-sm text-white/60 hover:text-[#D4AF37]" onClick={() => setMobileMenuOpen(false)}>ABOUT</Link>
            <Link to="/contact" className="text-sm text-white/60 hover:text-[#D4AF37]" onClick={() => setMobileMenuOpen(false)}>CONTACT</Link>
          </div>
        </div>
      )}
    </>
  )
}
