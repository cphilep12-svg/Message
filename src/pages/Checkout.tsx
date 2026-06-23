import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { ArrowLeft, Truck } from 'lucide-react'
import { trpc } from '@/providers/trpc'

interface CheckoutProps {
  sessionId: string
}

export default function Checkout({ sessionId }: CheckoutProps) {
  const navigate = useNavigate()
  const { data: cart } = trpc.cart.get.useQuery({ sessionId })
  const createOrder = trpc.order.create.useMutation({
    onSuccess: (data) => {
      navigate(`/order-success?order=${data.orderNumber}`)
    },
  })
  const confirmPayment = trpc.payment.confirm.useMutation()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'yoco' as 'yoco' | 'payfast' | 'stripe',
  })

  const subtotal = cart?.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0) ?? 0
  const shipping = subtotal > 100 ? 0 : 15
  const total = subtotal + shipping

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) return

    createOrder.mutate(
      {
        sessionId,
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone || undefined,
        shippingAddress: {
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
        },
        shippingCost: shipping,
      },
      {
        onSuccess: (data) => {
          // Simulate payment confirmation
          setTimeout(() => {
            confirmPayment.mutate({
              orderId: data.orderId,
              paymentRef: `mock_${Date.now()}`,
            })
          }, 500)
        },
      }
    )
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="pt-16 min-h-screen flex flex-col items-center justify-center">
        <p className="text-white/40 mb-4">Your cart is empty</p>
        <Link to="/shop" className="text-[#D4AF37] hover:underline text-sm">Continue shopping</Link>
      </div>
    )
  }

  return (
    <div className="pt-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-[#D4AF37] transition-colors mb-8">
          <ArrowLeft className="w-3 h-3" />
          BACK TO SHOP
        </Link>

        <h1 className="font-display text-4xl sm:text-5xl tracking-wider mb-10">CHECKOUT</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact */}
            <div>
              <h3 className="font-display text-lg tracking-wider mb-4">CONTACT</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full name *"
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
                <input
                  type="tel"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Shipping */}
            <div>
              <h3 className="font-display text-lg tracking-wider mb-4">SHIPPING</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Address"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={form.postalCode}
                    onChange={e => setForm({ ...form, postalCode: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div>
              <h3 className="font-display text-lg tracking-wider mb-4">PAYMENT</h3>
              <div className="grid grid-cols-3 gap-3">
                {(['yoco', 'payfast', 'stripe'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setForm({ ...form, paymentMethod: method })}
                    className={`py-3 px-4 border text-xs font-semibold tracking-wider transition-colors ${
                      form.paymentMethod === method
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                        : 'border-white/10 text-white/60 hover:border-white/30'
                    }`}
                  >
                    {method.toUpperCase()}
                  </button>
                ))}
              </div>
              <p className="text-xs text-white/40 mt-3">
                This is a demo. No real payment will be processed.
              </p>
            </div>

            <button
              type="submit"
              disabled={createOrder.isPending}
              className="w-full py-4 bg-[#D4AF37] text-black text-sm font-bold tracking-wider hover:bg-[#C4A030] transition-colors disabled:opacity-50"
            >
              {createOrder.isPending ? 'PROCESSING...' : `COMPLETE ORDER - $${total.toFixed(2)}`}
            </button>
          </form>

          {/* Order summary */}
          <div className="bg-[#1A1A1A] rounded p-6 lg:p-8 h-fit">
            <h3 className="font-display text-lg tracking-wider mb-6">ORDER SUMMARY</h3>
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-[#2A2A2A] rounded overflow-hidden flex-shrink-0">
                    {item.product?.featuredImage && (
                      <img src={item.product.featuredImage} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product?.name}</p>
                    <p className="text-xs text-white/40">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-3 border-t border-white/5">
                <span>Total</span>
                <span className="text-[#D4AF37]">${total.toFixed(2)}</span>
              </div>
            </div>

            {shipping === 0 && (
              <p className="flex items-center gap-2 text-xs text-green-400 mt-4">
                <Truck className="w-3 h-3" />
                You qualify for free shipping!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
