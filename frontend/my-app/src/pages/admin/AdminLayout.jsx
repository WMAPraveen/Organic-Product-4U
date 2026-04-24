// src/pages/admin/AdminLayout.jsx
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Package, Tag, Boxes, ShoppingBag, Users, Leaf, ChevronRight, MessageSquare
} from 'lucide-react'

const links = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/inventory', label: 'Inventory', icon: Boxes },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
]

export default function AdminLayout() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen pt-16 flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 fixed left-0 top-16 bottom-0 glass border-r border-gray-200 p-4 overflow-y-auto hidden md:flex flex-col z-40">
        <div className="flex items-center gap-2.5 px-2 mb-8 mt-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-400 rounded-lg flex items-center justify-center shadow-sm">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900">Admin Panel</p>
            <p className="text-xs text-gray-500">@{user?.username}</p>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              id={`sidebar-${label.toLowerCase()}`}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-gray-700 font-medium">{label}</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-40 text-gray-400" />
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-gray-200 flex md:hidden z-40">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2.5 gap-1 text-xs font-medium transition-colors ${isActive ? 'text-green-600' : 'text-gray-500'}`
            }
          >
            <Icon className="w-4 h-4" />
            <span className="text-[10px]">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Content */}
      <main className="flex-1 md:ml-64 px-4 sm:px-8 py-8 pb-24 md:pb-8">
        <Outlet />
      </main>
    </div>
  )
}
