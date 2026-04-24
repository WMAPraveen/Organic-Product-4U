import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { ShoppingCart, Trash2, Leaf, ArrowLeft, LogIn, Package, ChevronRight } from 'lucide-react'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [checkingOut, setCheckingOut] = useState(false)

  const handleCheckout = () => {
    // Require login at checkout
    if (!user) {
      toast.error('Please log in to complete your purchase.')
      navigate('/login', { state: { from: '/cart' } })
      return
    }
    navigate('/checkout')
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-16 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-green-300" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-8 text-sm">Add some organic products to get started!</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary px-8 py-3 font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 py-4">
          <button onClick={() => navigate('/')} className="hover:text-green-600 transition-colors cursor-pointer">Home</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 font-medium">Shopping Cart</span>
        </nav>

        <h1 className="font-heading font-bold text-3xl text-gray-900 mb-8">
          Shopping Cart
          <span className="ml-3 text-lg font-normal text-gray-400">({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.productId} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex gap-4 items-start hover:shadow-md transition-shadow duration-300">
                {/* Product image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200 flex items-center justify-center">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                  ) : (
                    <Leaf className="w-8 h-8 text-gray-300" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold text-gray-900 text-sm sm:text-base truncate cursor-pointer hover:text-green-600 transition-colors"
                    onClick={() => navigate(`/product/${item.productId}`)}
                  >
                    {item.productName}
                  </p>
                  <p className="text-green-600 font-bold text-lg mt-1">₹{Number(item.productPrice).toFixed(2)}</p>

                  {/* Quantity + Remove */}
                  <div className="flex items-center gap-4 mt-3">
                    {/* Qty stepper */}
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer font-bold"
                      >−</button>
                      <span className="w-10 h-9 flex items-center justify-center text-sm font-semibold text-gray-900 bg-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer font-bold"
                      >+</button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-medium transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>

                {/* Line total */}
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-400">Subtotal</p>
                  <p className="font-bold text-gray-900">₹{(item.productPrice * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}

            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors cursor-pointer mt-2"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-24">
              <h2 className="font-heading font-bold text-gray-900 text-lg mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5 text-sm">
                {cart.map(item => (
                  <div key={item.productId} className="flex justify-between text-gray-600">
                    <span className="truncate max-w-[140px]">{item.productName} × {item.quantity}</span>
                    <span className="font-medium text-gray-800 ml-2">₹{(item.productPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-black text-xl text-green-600">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Login notice for guests */}
              {!user && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2 text-xs text-amber-700 mb-4">
                  <LogIn className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>You'll need to <strong>log in</strong> to complete your purchase.</span>
                </div>
              )}

              <button
                id="btn-checkout"
                onClick={handleCheckout}
                disabled={checkingOut}
                className="btn-primary w-full py-4 font-bold text-base flex justify-center items-center gap-2 shadow-xl shadow-green-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Package className="w-5 h-5" />
                {checkingOut ? 'Placing Order…' : 'Proceed to Checkout'}
              </button>

              <p className="text-xs text-gray-400 text-center mt-4">
                Orders are confirmed by admins subject to stock availability.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
