// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ShoppingBag, LogOut, User, LayoutDashboard, Leaf } from 'lucide-react'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    signOut()
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/30 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-gradient">Organic4U</span>
          </Link>

          {/* Nav links (guest) */}
          {!user && (
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-600 hover:text-green-600 transition-colors text-sm font-medium">Home</Link>
              <Link to="/shop" className="text-gray-600 hover:text-green-600 transition-colors text-sm font-medium">Shop</Link>
            </div>
          )}

          {/* Right */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="sidebar-link py-2 text-sm">
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="hidden sm:block">Dashboard</span>
                  </Link>
                )}
                <Link to="/orders" className="sidebar-link py-2 text-sm">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:block">Orders</span>
                </Link>
                <Link to="/profile" className="sidebar-link py-2 text-sm">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:block">{user.username}</span>
                </Link>
                <button
                  id="btn-logout"
                  onClick={handleLogout}
                  className="btn-danger flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm py-2 px-5">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
