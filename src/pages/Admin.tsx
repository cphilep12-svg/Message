import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { DollarSign, Package, ShoppingCart, Users, ArrowUpRight } from 'lucide-react'
import { trpc } from '@/providers/trpc'
import { useAuth } from '@/hooks/useAuth'

export default function Admin() {
  const navigate = useNavigate()
  const { user, isLoading, isAdmin } = useAuth()
  const { data: stats } = trpc.admin.getStats.useQuery(undefined, { enabled: isAdmin })

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/')
    }
  }, [isLoading, user, isAdmin, navigate])

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAdmin) return null

  const statCards = [
    {
      title: 'Total Revenue',
      value: stats ? `$${stats.totalRevenue.toFixed(2)}` : '$0.00',
      icon: DollarSign,
      trend: '+12%',
      color: 'text-green-400',
    },
    {
      title: 'Products',
      value: String(stats?.totalProducts ?? 0),
      icon: Package,
      trend: '+3',
      color: 'text-blue-400',
    },
    {
      title: 'Orders',
      value: String(stats?.totalOrders ?? 0),
      icon: ShoppingCart,
      trend: '+8',
      color: 'text-purple-400',
    },
    {
      title: 'Customers',
      value: String(stats?.totalCustomers ?? 0),
      icon: Users,
      trend: '+15',
      color: 'text-[#D4AF37]',
    },
  ]

  return (
    <div className="pt-16 min-h-screen bg-[#0A0A0A]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display text-3xl tracking-wider">ADMIN DASHBOARD</h1>
            <p className="text-sm text-white/40 mt-1">Welcome back, {user?.name ?? 'Admin'}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((stat) => (
            <div key={stat.title} className="bg-[#1A1A1A] rounded-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-5 h-5 text-[#D4AF37]" />
                <span className={`flex items-center gap-0.5 text-xs ${stat.color}`}>
                  {stat.trend} <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
              <p className="font-display text-2xl tracking-wider">{stat.value}</p>
              <p className="text-xs text-white/40 mt-1">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Charts placeholder + Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales chart placeholder */}
          <div className="lg:col-span-2 bg-[#1A1A1A] rounded-sm p-6">
            <h3 className="font-display text-lg tracking-wider mb-6">SALES OVERVIEW</h3>
            <div className="h-64 flex items-end justify-between gap-2 px-4">
              {[65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95, 70].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-[#D4AF37]/30 rounded-t-sm transition-all hover:bg-[#D4AF37]/50"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[9px] text-white/30">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent orders */}
          <div className="bg-[#1A1A1A] rounded-sm p-6">
            <h3 className="font-display text-lg tracking-wider mb-6">RECENT ORDERS</h3>
            <div className="space-y-4">
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b border-white/5">
                    <div>
                      <p className="text-sm font-semibold">{order.orderNumber}</p>
                      <p className="text-[10px] text-white/40">{order.customerName ?? 'Guest'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">${Number(order.total).toFixed(2)}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded ${
                        order.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                        order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-white/5 text-white/40'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="w-8 h-8 text-white/20 mx-auto mb-2" />
                  <p className="text-sm text-white/40">No orders yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-6 bg-[#1A1A1A] rounded-sm p-6">
          <h3 className="font-display text-lg tracking-wider mb-4">QUICK ACTIONS</h3>
          <div className="flex flex-wrap gap-3">
            {['Add Product', 'Manage Collections', 'View All Orders', 'Moderate Testimonials', 'Manage Blog'].map((action) => (
              <button
                key={action}
                className="px-5 py-2.5 bg-white/5 border border-white/10 text-sm hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
              >
                {action.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
