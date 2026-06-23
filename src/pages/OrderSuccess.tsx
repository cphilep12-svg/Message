import { Link, useSearchParams } from 'react-router'
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react'

export default function OrderSuccess() {
  const [searchParams] = useSearchParams()
  const orderNumber = searchParams.get('order')

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-[#D4AF37]" />
        </div>

        <h1 className="font-display text-4xl tracking-wider mb-2">ORDER CONFIRMED</h1>
        <p className="text-white/50 text-sm mb-6">
          Thank you for your order. Your faith-forward purchase is on its way.
        </p>

        {orderNumber && (
          <div className="bg-[#1A1A1A] rounded p-4 mb-8">
            <p className="text-xs text-white/40 uppercase tracking-wider">Order Number</p>
            <p className="text-lg font-semibold text-[#D4AF37] tracking-wider mt-1">{orderNumber}</p>
          </div>
        )}

        <p className="text-xs text-white/30 mb-8 font-serif italic">
          &ldquo;And we know that all things work together for good to those who love God.&rdquo; — Romans 8:28
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#D4AF37] text-black text-sm font-bold tracking-wider hover:bg-[#C4A030] transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            CONTINUE SHOPPING
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-white/10 text-white/60 text-sm tracking-wider hover:border-white/30 transition-colors"
          >
            HOME <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
