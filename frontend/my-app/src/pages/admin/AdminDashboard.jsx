// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react'
import { fetchProducts, fetchCategories, fetchInventoryList, fetchOrders, fetchUsers } from '../../utils/api'
import { Package, Tag, Boxes, ShoppingBag, Users, TrendingUp, AlertCircle } from 'lucide-react'
import Loader from '../../components/Loader'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [lowStock, setLowStock] = useState([])

  useEffect(() => {
    Promise.all([
      fetchProducts(), fetchCategories(), fetchInventoryList(), fetchOrders(), fetchUsers()
    ]).then(([p, c, inv, o, u]) => {
      setStats({
        products: p.data.length,
        categories: c.data.length,
        inventory: inv.data.length,
        orders: o.data.length,
        users: u.data.length,
        revenue: o.data.reduce((acc, ord) => acc + Number(ord.orderTotal || 0), 0),
      })
      setLowStock(inv.data.filter((it) => it.quantity < 10))
    }).catch(() => {})
  }, [])

  if (!stats) return <Loader />

  const cards = [
    { label: 'Products', value: stats.products, icon: Package, color: 'text-blue-400', bg: 'bg-blue-900/30' },
    { label: 'Categories', value: stats.categories, icon: Tag, color: 'text-purple-400', bg: 'bg-purple-900/30' },
    { label: 'Orders', value: stats.orders, icon: ShoppingBag, color: 'text-yellow-400', bg: 'bg-yellow-900/30' },
    { label: 'Revenue', value: `₹${stats.revenue.toFixed(0)}`, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-900/30' },
    { label: 'Inventory Entries', value: stats.inventory, icon: Boxes, color: 'text-orange-400', bg: 'bg-orange-900/30' },
    { label: 'Users', value: stats.users, icon: Users, color: 'text-pink-400', bg: 'bg-pink-900/30' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl text-gray-900 mb-1">Dashboard</h1>
        <p className="text-gray-500">Overview of your organic store</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card hover:border-gray-300 transition-all bg-white">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
            <p className={`font-heading font-bold text-3xl ${color}`}>{value}</p>
            <p className="text-gray-500 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Low stock warning */}
      {lowStock.length > 0 && (
        <div className="card border-yellow-200 bg-yellow-50 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <h2 className="font-semibold text-yellow-700">Low Stock Alert</h2>
            <span className="badge-yellow ml-auto">{lowStock.length} items</span>
          </div>
          <div className="space-y-2">
            {lowStock.map((item) => (
              <div key={item.inventoryId} className="flex items-center justify-between text-sm py-2 border-b border-yellow-200 last:border-0">
                <span className="text-gray-700 font-mono text-xs">Product: {item.productId}</span>
                <span className={`font-bold ${item.quantity === 0 ? 'text-red-500' : 'text-yellow-600'}`}>
                  {item.quantity === 0 ? 'OUT OF STOCK' : `${item.quantity} left`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
