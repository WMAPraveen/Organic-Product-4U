// src/pages/admin/AdminOrders.jsx
import { useEffect, useState } from 'react'
import { fetchOrders, updateOrder, deleteOrder, fetchUsers, fetchProducts } from '../../utils/api'
import toast from 'react-hot-toast'
import Loader from '../../components/Loader'
import { ShoppingBag, Edit2, Trash2, X, Clock, CheckCircle, Package, XCircle } from 'lucide-react'

const statusConfig = {
  PENDING: { label: 'Pending', icon: Clock, cls: 'badge-yellow' },
  CONFIRMED: { label: 'Confirmed', icon: CheckCircle, cls: 'badge-green' },
  CANCELLED: { label: 'Cancelled', icon: XCircle, cls: 'badge-red' },
  DELIVERED: { label: 'Delivered', icon: Package, cls: 'badge-blue' },
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [usersList, setUsersList] = useState([])
  const [productsList, setProductsList] = useState([])

  const load = () => {
    Promise.all([fetchOrders(), fetchUsers(), fetchProducts()])
      .then(([ordRes, usrRes, prodRes]) => {
        setOrders(ordRes.data)
        setUsersList(usrRes.data)
        setProductsList(prodRes.data)
      })
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openEdit = (order) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this order entirely?')) return
    try {
      await deleteOrder(id)
      toast.success('Order deleted')
      load()
    } catch {
      toast.error('Failed to delete order')
    }
  }

  const handleUpdateStatus = async (e) => {
    e.preventDefault()
    try {
      await updateOrder({ ...selectedOrder, status: newStatus })
      toast.success('Order status updated')
      setModalOpen(false)
      load()
    } catch {
      toast.error('Failed to update status')
    }
  }

  const getUserName = (id) => {
    const u = usersList.find(x => x.userId === id)
    return u ? `${u.firstName} ${u.lastName}` : id
  }

  const getProductName = (id) => {
    const p = productsList.find(x => x.productId === id)
    return p ? p.productName : id
  }

  if (loading) return <Loader />

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl text-gray-900 mb-1">Orders</h1>
        <p className="text-gray-500">Manage customer orders and statuses</p>
      </div>

      <div className="card p-0 overflow-x-auto bg-white border border-gray-200">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Qty</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((o) => {
              const sc = statusConfig[o.status] || statusConfig.PENDING
              const StatusIcon = sc.icon
              return (
                <tr key={o.orderId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{o.orderId.substring(0, 8)}...</td>
                  <td className="px-6 py-4 text-gray-900 font-medium whitespace-nowrap">{getUserName(o.userId)}</td>
                  <td className="px-6 py-4 text-gray-900 whitespace-nowrap">{getProductName(o.productId)}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{o.quantity}</td>
                  <td className="px-6 py-4 text-green-600 font-medium">₹{Number(o.orderTotal || 0).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`${sc.cls} inline-flex items-center gap-1`}>
                      <StatusIcon className="w-3 h-3" /> {sc.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(o)} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(o.orderId)} className="p-2 text-red-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="card w-full max-w-sm border border-gray-200 bg-white shadow-2xl relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-heading font-bold text-xl mb-4 text-gray-900">Update Status</h2>
            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Order Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="input bg-white"
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-3 border-t border-gray-200 mt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
