import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchProductById, fetchReviewsByProduct, addReview } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import Loader from '../components/Loader'
import { useCart } from '../context/CartContext'
import {
  ArrowLeft, ShoppingCart, Leaf, Star, UserCircle,
  Truck, RefreshCw, MessageCircle, Shield, Award, Package, ChevronRight
} from 'lucide-react'

const BASE = 'http://localhost:8080'

const TABS = ['Description', 'Additional Information', 'Shipping']

const TRUST_BADGES = [
  {
    icon: Award,
    title: 'Great Value',
    desc: "You won't find a better price online for similar products with the same quality.",
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    desc: 'Enjoy peace of mind with our secure payment options and top-tier encryption.',
  },
  {
    icon: Award,
    title: 'Satisfaction Guaranteed',
    desc: 'We work hard to keep the quality of our products and services as high as possible.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Orders are carefully checked, packed, and dispatched within 1–3 working days.',
  },
]

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState(null)
  const [activeTab, setActiveTab] = useState('Description')
  const [quantity, setQuantity] = useState(1)
  const { addToCart, cart } = useCart()

  // Reviews state
  const [reviews, setReviews] = useState([])
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)

  useEffect(() => {
    Promise.all([
      fetchProductById(id),
      fetchReviewsByProduct(id).catch(() => ({ data: [] }))
    ])
      .then(([prodRes, reviewRes]) => {
        setProduct(prodRes.data)
        setReviews(reviewRes.data)
        const firstImg = prodRes.data.detailImageUrls?.[0] || prodRes.data.cardImageUrls?.[0]
        if (firstImg) setMainImage(firstImg)
      })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please log in to add items to cart.')
      navigate('/login', { state: { from: `/product/${id}` } })
      return
    }
    addToCart(product, quantity)
    toast.success(`"${product.productName}" added to cart!`, {
      icon: '🛒',
    })
  }

  const isInCart = cart.some(item => item.productId === product?.productId)

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    if (!reviewComment.trim()) return
    setSubmittingReview(true)
    try {
      const resp = await addReview({
        productId: product.productId,
        userId: user.userId,
        userName: user.username,
        rating: reviewRating,
        comment: reviewComment
      })
      setReviews(prev => [...prev, resp.data])
      setReviewComment('')
      setReviewRating(5)
      toast.success('Review added successfully!')
    } catch (err) {
      toast.error(err.response?.data || 'Could not post review')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) return <Loader />
  if (!product) return <div className="pt-24 text-center text-gray-500">Product not found.</div>

  const allImages = [...(product.detailImageUrls || []), ...(product.cardImageUrls || [])]
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate('/')} className="hover:text-green-600 transition-colors cursor-pointer">Home</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => navigate(-1)} className="hover:text-green-600 transition-colors cursor-pointer">Shop</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 font-medium truncate max-w-xs">{product.productName}</span>
        </nav>
      </div>

      {/* ─── Main Product Section ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

          {/* Left – Image Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center group">
              {mainImage ? (
                <img
                  src={mainImage}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={product.productName}
                />
              ) : (
                <Leaf className="w-24 h-24 text-gray-300" />
              )}
              {/* Organic badge */}
              <span className="absolute top-4 left-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                100% Organic
              </span>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {allImages.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(imgUrl)}
                    className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                      mainImage === imgUrl
                        ? 'border-green-500 shadow-md shadow-green-200'
                        : 'border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-300'
                    }`}
                  >
                    <img src={imgUrl} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right – Product Info */}
          <div className="flex flex-col">
            {/* Category badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              {product.categoryName && (
                <span className="badge-green">{product.categoryName}</span>
              )}
              <span className="badge-green">Best Selling</span>
            </div>

            {/* Title */}
            <h1 className="font-heading font-bold text-3xl sm:text-4xl text-gray-900 leading-tight mb-3">
              {product.productName}
            </h1>

            {/* Rating summary */}
            {avgRating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.round(avgRating) ? 'fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">{avgRating}</span>
                <span className="text-sm text-gray-400">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-green-600">₹{Number(product.productPrice).toFixed(2)}</span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 mb-6" />

            {/* Quantity selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center gap-0 w-fit border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer font-bold text-lg"
                >−</button>
                <span className="w-12 h-10 flex items-center justify-center font-semibold text-gray-900 bg-white text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer font-bold text-lg"
                >+</button>
              </div>
            </div>

            {/* CTA Button */}
            <button
              id="btn-add-to-cart"
              onClick={handleAddToCart}
              className={`btn-primary w-full py-4 text-base flex justify-center items-center gap-2.5 shadow-xl shadow-green-600/30 font-bold mb-6 tracking-wide ${
                isInCart ? 'from-emerald-500 to-green-400' : ''
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {isInCart ? 'Add More to Cart' : 'Add to Cart'}
            </button>

            {/* Info links */}
            <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-6">
              <span className="flex items-center gap-1 hover:text-green-600 cursor-pointer transition-colors">
                <Truck className="w-3.5 h-3.5" /> Shipping Info
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1 hover:text-green-600 cursor-pointer transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> Delivery &amp; Return
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1 hover:text-green-600 cursor-pointer transition-colors">
                <MessageCircle className="w-3.5 h-3.5" /> Ask a Question
              </span>
            </div>

            {/* Stock urgency */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-amber-700 font-medium mb-2">
              <Package className="w-4 h-4 shrink-0" />
              Hurry! Limited stock available — order before it sells out.
            </div>
          </div>
        </div>

        {/* ─── Tabs Section ─── */}
        <div className="mt-14">
          {/* Tab bar */}
          <div className="flex border-b border-gray-200 gap-0 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3.5 text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'border-green-500 text-green-700 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="bg-white rounded-b-2xl rounded-tr-2xl border border-t-0 border-gray-200 p-6 sm:p-8 shadow-sm">
            {activeTab === 'Description' && (
              <div className="prose prose-green max-w-none text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {product.productDescription || 'No description available for this product.'}
              </div>
            )}

            {activeTab === 'Additional Information' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <tbody className="divide-y divide-gray-100">
                    {[
                      ['Product Name', product.productName],
                      ['Category', product.categoryName || '—'],
                      ['Price', `₹${Number(product.productPrice).toFixed(2)}`],
                      ['Origin', 'Sri Lanka / Ceylon'],
                      ['Type', '100% Organic'],
                      ['Availability', 'Pre-Order'],
                    ].map(([label, value]) => (
                      <tr key={label}>
                        <td className="py-3 pr-8 font-semibold text-gray-600 w-48">{label}</td>
                        <td className="py-3 text-gray-800">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'Shipping' && (
              <div className="space-y-6 text-sm text-gray-700">
                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-1">Processing Time</h3>
                  <p>All items are carefully checked, packed, and prepared for shipment within <strong>1–5 working days</strong>.</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-2">Shipping Methods</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: 'Standard Delivery', time: '5–10 working days', fee: 'Free on orders over ₹999' },
                      { name: 'Express Delivery', time: '2–3 working days', fee: '₹150 flat rate' },
                    ].map(m => (
                      <div key={m.name} className="border border-gray-200 rounded-xl p-4">
                        <p className="font-semibold text-gray-900 mb-1">{m.name}</p>
                        <p className="text-gray-500">Transit: {m.time}</p>
                        <p className="text-green-600 font-medium mt-1">{m.fee}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-1">Returns</h3>
                  <p>We accept returns within 7 days of delivery for unopened, sealed products. Please contact our support team to initiate a return.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Trust Badges ─── */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-5">
          {TRUST_BADGES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col items-center text-center gap-3 hover:shadow-md hover:border-green-200 transition-all duration-300">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <Icon className="w-6 h-6 text-green-600" />
              </div>
              <p className="font-bold text-gray-900 text-sm">{title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* ─── Reviews Section ─── */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading font-bold text-2xl text-gray-900">
              Customer Reviews
              {reviews.length > 0 && (
                <span className="ml-3 text-base font-normal text-gray-400">({reviews.length})</span>
              )}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Review list */}
            <div className="lg:col-span-2 space-y-5">
              {/* Rating summary bar */}
              {reviews.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6 flex flex-col sm:flex-row items-center gap-6">
                  <div className="text-center">
                    <p className="text-6xl font-black text-gray-900">{avgRating}</p>
                    <div className="flex justify-center text-yellow-400 my-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < Math.round(avgRating) ? 'fill-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    {[5, 4, 3, 2, 1].map(star => {
                      const count = reviews.filter(r => r.rating === star).length
                      const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                      return (
                        <div key={star} className="flex items-center gap-3 text-sm">
                          <span className="text-gray-500 w-4 text-right">{star}</span>
                          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 shrink-0" />
                          <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-gray-400 w-6 text-right">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {reviews.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
                  <Star className="w-14 h-14 text-gray-200 mx-auto mb-3" />
                  <p className="font-semibold text-gray-600 mb-1">No reviews yet</p>
                  <p className="text-sm text-gray-400">Be the first to review this product!</p>
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review.reviewId} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center font-bold text-white text-sm shrink-0">
                        {(review.userName || review.userId || 'U').substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {review.userName ? `@${review.userName}` : `User ${review.userId?.substring(0, 8)}...`}
                        </p>
                        <div className="flex text-yellow-400 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 shrink-0">
                        {new Date(review.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm sticky top-24">
                <h3 className="font-heading font-bold text-gray-900 text-lg mb-5">Write a Review</h3>

                {!user ? (
                  <div className="text-center py-6">
                    <UserCircle className="w-14 h-14 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-4">Please log in to share your thoughts.</p>
                    <button
                      onClick={() => navigate('/login')}
                      className="btn-primary py-2.5 px-6 w-full text-sm"
                    >
                      Log in to Review
                    </button>
                  </div>
                ) : user.role === 'ADMIN' ? (
                  <div className="text-center py-6">
                    <Shield className="w-14 h-14 text-gray-200 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-700 mb-2">Admin Account</h4>
                    <p className="text-sm text-gray-400">Administrators are not permitted to submit product reviews.</p>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    {/* Star rating input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(num => (
                          <button
                            type="button"
                            key={num}
                            onClick={() => setReviewRating(num)}
                            onMouseEnter={() => setHoverRating(num)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none cursor-pointer transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-8 h-8 transition-colors duration-150 ${
                                num <= (hoverRating || reviewRating)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="review-comment" className="block text-sm font-semibold text-gray-700 mb-2">Your Review</label>
                      <textarea
                        id="review-comment"
                        rows="4"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none resize-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        placeholder="What do you think about this product?"
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="btn-primary w-full py-3 font-semibold disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                    >
                      {submittingReview ? 'Submitting…' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
