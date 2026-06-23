import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router'
import { trpc } from '@/providers/trpc'
import { useState } from 'react'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
  sessionId: string
}

export default function CartDrawer({ open, onClose, sessionId }: CartDrawerProps) {
  const utils = trpc.useUtils()
  const { data: cart, isLoading } = trpc.cart.get.useQuery({ sessionId })
  const updateItem = trpc.cart.updateItem.useMutation({ onSuccess: () => utils.cart.get.invalidate() })
  const removeItem = trpc.cart.removeItem.useMutation({ onSuccess: () => utils.cart.get.invalidate() })
  const [removingId, setRemovingId] = useState<number | null>(null)

  const subtotal = cart?.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0) ?? 0

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-[420px] bg-[#1A1A1A] z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <h2 className="font-display text-xl tracking-wider">YOUR CART</h2>
          <button onClick={onClose} className="p-1 hover:text-[#D4AF37] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !cart?.items || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-12 h-12 text-white/20 mb-4" />
              <p className="text-white/50 text-sm">Your cart is empty</p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 border border-[#D4AF37] text-[#D4AF37] text-sm font-semibold hover:bg-[#D4AF37] hover:text-black transition-colors"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className={`flex gap-4 p-3 bg-white/3 rounded-lg transition-all duration-300 ${
                    removingId === item.id ? 'opacity-0 translate-x-full' : 'opacity-100'
                  }`}
                >
                  <div className="w-20 h-20 bg-[#2A2A2A] rounded overflow-hidden flex-shrink-0">
                    {item.product?.featuredImage && (
                      <img
                        src={item.product.featuredImage}
                        alt={item.product?.name ?? ''}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product?.name}</p>
                    <p className="text-xs text-white/40 mt-0.5">${Number(item.price).toFixed(2)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (item.quantity <= 1) {
                              setRemovingId(item.id)
                              setTimeout(() => removeItem.mutate({ itemId: item.id }), 300)
                            } else {
                              updateItem.mutate({ itemId: item.id, quantity: item.quantity - 1 })
                            }
                          }}
                          className="w-6 h-6 rounded bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateItem.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                          className="w-6 h-6 rounded bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          setRemovingId(item.id)
                          setTimeout(() => removeItem.mutate({ itemId: item.id }), 300)
                        }}
                        className="p-1 text-white/30 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart?.items && cart.items.length > 0 && (
          <div className="px-6 py-5 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/50">Subtotal</span>
              <span className="text-lg font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-white/30 mb-4">Shipping calculated at checkout</p>
            <Link
              to="/checkout"
              onClick={onClose}
              className="block w-full py-3.5 bg-[#D4AF37] text-black text-center text-sm font-bold tracking-wider hover:bg-[#C4A030] transition-colors"
            >
              CHECKOUT
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
