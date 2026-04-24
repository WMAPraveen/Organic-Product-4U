import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { createCheckoutSession } from '../utils/api'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { 
  ShieldCheck, CreditCard, Lock, ArrowLeft, ChevronRight, 
  Leaf, Package, Truck, Shield 
} from 'lucide-react'

export default function Checkout() {
  const { cart, cartTotal } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [processing, setProcessing] = useState(false)

  // Redirect if cart is empty
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-16 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-green-300" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-gray-900 mb-2">Nothing to checkout</h1>
          <p className="text-gray-500 mb-8 text-sm">Your cart is empty. Add some products first!</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary px-8 py-3 font-semibold"
          >
            Browse Products
          </button>
        </div>
      </div>
    )
  }

  // Redirect if not logged in
  if (!user) {
    navigate('/login', { state: { from: '/checkout' } })
    return null
  }

  const handlePayment = async () => {
    setProcessing(true)
    try {
      // Amount in paisa for Stripe (e.g., ₹500.00 = 50000 paisa)
      const amountInPaisa = Math.round(cartTotal * 100)
      console.log('Cart Total (₹):', cartTotal, '| Amount in paisa:', amountInPaisa)

      const paymentData = {
        amount: amountInPaisa,
        currency: 'inr',
        description: `Organic Products Order - ${cart.length} item${cart.length > 1 ? 's' : ''}`,
      }

      const response = await createCheckoutSession(paymentData)
      const { sessionUrl } = response.data

      // Save cart data in sessionStorage so the Success page can place orders
      sessionStorage.setItem('pendingOrder', JSON.stringify({
        userId: user.userId,
        items: cart.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.productPrice,
        })),
        total: cartTotal,
      }))

      // Redirect the user to Stripe's hosted checkout page
      window.location.href = sessionUrl
    } catch (err) {
      console.error('Payment error:', err)
      toast.error(err.response?.data || 'Payment failed. Please try again.')
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 py-4">
          <button onClick={() => navigate('/')} className="hover:text-green-600 transition-colors cursor-pointer">Home</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => navigate('/cart')} className="hover:text-green-600 transition-colors cursor-pointer">Cart</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 font-medium">Checkout</span>
        </nav>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {/* Step 1: Cart */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-green-500/30">✓</div>
            <span className="text-sm font-semibold text-green-600 hidden sm:inline">Cart</span>
          </div>
          <div className="w-12 sm:w-20 h-0.5 bg-green-500 mx-1"></div>
          {/* Step 2: Checkout (current) */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-green-500/40 ring-4 ring-green-100">2</div>
            <span className="text-sm font-semibold text-green-700 hidden sm:inline">Checkout</span>
          </div>
          <div className="w-12 sm:w-20 h-0.5 bg-gray-200 mx-1"></div>
          {/* Step 3: Confirmation */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm font-bold">3</div>
            <span className="text-sm font-medium text-gray-400 hidden sm:inline">Confirmation</span>
          </div>
        </div>

        <h1 className="font-heading font-bold text-3xl text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column – Order Review */}
          <div className="lg:col-span-2 space-y-6">

            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="font-heading font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
                <Package className="w-5 h-5 text-green-600" />
                Order Review
              </h2>
              <div className="divide-y divide-gray-100">
                {cart.map(item => (
                  <div key={item.productId} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    {/* Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200 flex items-center justify-center">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                      ) : (
                        <Leaf className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{item.productName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    {/* Price */}
                    <div className="text-right shrink-0">
                      <p className="font-bold text-gray-900">₹{(item.productPrice * item.quantity).toFixed(2)}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-400">₹{Number(item.productPrice).toFixed(2)} each</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">SSL Encrypted</p>
                  <p className="text-[11px] text-gray-500">256-bit secure connection</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Buyer Protection</p>
                  <p className="text-[11px] text-gray-500">Full refund if items don't arrive</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Fast Delivery</p>
                  <p className="text-[11px] text-gray-500">Delivered within 3-5 days</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/cart')}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Cart
            </button>
          </div>

          {/* Right Column – Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-24">
              <h2 className="font-heading font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                Payment Summary
              </h2>

              <div className="space-y-3 mb-5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-medium text-gray-800">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-medium text-gray-800">Included</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-black text-xl text-green-600">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                id="btn-pay-now"
                onClick={handlePayment}
                disabled={processing}
                className="btn-primary w-full py-4 font-bold text-base flex justify-center items-center gap-2 shadow-xl shadow-green-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Redirecting to Stripe…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Pay ₹{cartTotal.toFixed(2)}
                  </>
                )}
              </button>

              {/* Stripe branding */}
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                <Lock className="w-3 h-3" />
                <span>Secured by <strong className="text-gray-500">Stripe</strong></span>
              </div>

              <p className="text-[11px] text-gray-400 text-center mt-3 leading-relaxed">
                You'll be redirected to Stripe's secure checkout page to complete your payment. 
                Your card details are never stored on our servers.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
