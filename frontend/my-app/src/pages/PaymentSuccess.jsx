import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { addOrder } from '../utils/api'
import toast from 'react-hot-toast'
import { CheckCircle, Package, ArrowRight, ShoppingBag, PartyPopper } from 'lucide-react'

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { clearCart } = useCart()
  const { user } = useAuth()
  const [status, setStatus] = useState('processing') // processing | success | error
  const [orderIds, setOrderIds] = useState([])
  const hasRun = useRef(false)

  useEffect(() => {
    // Prevent running twice in StrictMode
    if (hasRun.current) return
    hasRun.current = true

    const sessionId = searchParams.get('session_id')
    const pendingOrderRaw = sessionStorage.getItem('pendingOrder')

    if (!sessionId || !pendingOrderRaw) {
      setStatus('error')
      return
    }

    const placeOrders = async () => {
      try {
        const pendingOrder = JSON.parse(pendingOrderRaw)

        // Place one order per cart item
        const results = await Promise.all(
          pendingOrder.items.map(item =>
            addOrder({
              userId: pendingOrder.userId,
              productId: item.productId,
              quantity: item.quantity,
              orderTotal: item.price * item.quantity,
              status: 'PLACED',
            })
          )
        )

        // Collect order IDs
        const ids = results.map(r => r.data?.orderId).filter(Boolean)
        setOrderIds(ids)

        // Clean up
        sessionStorage.removeItem('pendingOrder')
        clearCart()
        setStatus('success')
        toast.success('Payment successful! Your order has been placed 🎉')
      } catch (err) {
        console.error('Failed to place order after payment:', err)
        setStatus('error')
        toast.error('Payment was received but order creation failed. Please contact support.')
      }
    }

    placeOrders()
  }, [])

  // Processing state
  if (status === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-16 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full border-4 border-green-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 animate-spin"></div>
            <div className="absolute inset-3 bg-green-50 rounded-full flex items-center justify-center">
              <Package className="w-7 h-7 text-green-500" />
            </div>
          </div>
          <h1 className="font-heading font-bold text-2xl text-gray-900 mb-2">Processing your order...</h1>
          <p className="text-gray-500 text-sm">Please wait while we confirm your payment and place your order.</p>
        </div>
      </div>
    )
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-16 flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-gray-500 text-sm mb-8">
            We couldn't process your order. If your payment was charged, please contact our support team and we'll resolve it immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/cart')}
              className="btn-secondary px-6 py-3 font-semibold"
            >
              Back to Cart
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="btn-primary px-6 py-3 font-semibold"
            >
              View My Orders
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16 flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 text-center">

        {/* Animated checkmark */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30"></div>
          <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-green-500/30">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="font-heading font-bold text-3xl text-gray-900 mb-3">
          Payment Successful!
        </h1>
        <p className="text-gray-500 text-base mb-8">
          Thank you for your purchase! Your order has been placed successfully and will be processed shortly.
        </p>

        {/* Order details card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8 text-left">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-heading font-bold text-gray-900 text-sm">Order Confirmed</p>
              <p className="text-xs text-gray-500">
                {orderIds.length} order{orderIds.length !== 1 ? 's' : ''} placed
              </p>
            </div>
          </div>

          {orderIds.length > 0 && (
            <div className="space-y-2 mb-4">
              {orderIds.map((id, i) => (
                <div key={id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5">
                  <span className="text-xs text-gray-500">Order #{i + 1}</span>
                  <span className="text-xs font-mono font-semibold text-gray-700">#{id.slice(-8)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <PartyPopper className="w-3.5 h-3.5 text-green-500" />
              <span>Your order status is <strong className="text-green-600">PLACED</strong>. The admin will update it to "Shipped" once dispatched.</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            id="btn-view-orders"
            onClick={() => navigate('/orders')}
            className="btn-primary px-8 py-3 font-semibold flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            View My Orders
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary px-8 py-3 font-semibold flex items-center justify-center gap-2"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  )
}
