// src/pages/Orders.jsx
import { useEffect, useState } from 'react'
import { fetchOrdersByUser, deleteOrder } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import Loader from '../components/Loader'
import { ShoppingBag, Trash2, Package, Clock, CheckCircle, XCircle } from 'lucide-react'

const statusConfig = {
  PENDING: { label: 'Pending', icon: Clock, cls: 'badge-yellow' },
  CONFIRMED: { label: 'Confirmed', icon: CheckCircle, cls: 'badge-green' },
  CANCELLED: { label: 'Cancelled', icon: XCircle, cls: 'badge-red' },
  DELIVERED: { label: 'Delivered', icon: Package, cls: 'badge-blue' },
}

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    fetchOrdersByUser(user.userId)
      .then((r) => setOrders(r.data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Cancel this order?')) return
    try {
      await deleteOrder(id)
      toast.success('Order cancelled')
      setOrders((prev) => prev.filter((o) => o.orderId !== id))
    } catch {
      toast.error('Failed to cancel order')
    }
  }

  if (loading) return <Loader />

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-green-900/40 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-2xl text-white">My Orders</h1>
            <p className="text-gray-500 text-sm">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="card text-center py-16">
            <ShoppingBag className="w-14 h-14 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">No orders yet</p>
            <p className="text-gray-600 text-sm mt-1">Shop organic products and your orders will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const sc = statusConfig[order.status] || statusConfig.PENDING
              const StatusIcon = sc.icon
              return (
                <div key={order.orderId} id={`order-${order.orderId}`} className="card hover:border-white/20 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`${sc.cls} flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {sc.label}
                        </span>
                        <span className="text-gray-600 text-xs font-mono">#{order.orderId?.slice(-8)}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">Product ID</p>
                          <p className="text-white font-medium font-mono text-xs">{order.productId}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">Quantity</p>
                          <p className="text-white font-medium">{order.quantity}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">Total</p>
                          <p className="text-green-400 font-bold">{order.orderTotal ? `₹${Number(order.orderTotal).toFixed(2)}` : '—'}</p>
                        </div>
                      </div>
                    </div>
                    {order.status === 'PENDING' && (
                      <button
                        id={`btn-cancel-order-${order.orderId}`}
                        onClick={() => handleDelete(order.orderId)}
                        className="shrink-0 flex items-center gap-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 px-3 py-2 rounded-lg transition-all cursor-pointer text-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
