// src/pages/Home.jsx
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchProducts, fetchCategories, addOrder, fetchAllReviews } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import Loader from '../components/Loader'
import { Search, ShoppingCart, Star, ArrowRight, Leaf, Shield, Truck, Award, Tag } from 'lucide-react'

const BASE = 'http://localhost:8080'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [reviews, setReviews] = useState([])
  const [selected, setSelected] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchProducts(), 
      fetchCategories(),
      fetchAllReviews().catch(() => ({ data: [] }))
    ])
      .then(([p, c, r]) => { 
        setProducts(p.data); 
        setCategories(c.data);
        setReviews(r.data);
      })
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter((p) => {
    const matchCat = selected === null || p.categoryId === selected
    const matchSearch = !keyword || p.productName.toLowerCase().includes(keyword.toLowerCase())
    return matchCat && matchSearch
  })

  const handleOrder = async (product) => {
    if (!user) { navigate('/login'); return }
    try {
      await addOrder({ userId: user.userId, productId: product.productId, quantity: 1, status: 'PENDING' })
      toast.success(`"${product.productName}" added to your orders!`)
    } catch (err) {
      toast.error(err.response?.data || 'Could not place order')
    }
  }

  if (loading) return <Loader />

  return (
    <div className="pt-16">
      {/* HERO BANNER */}
      <section className="relative w-full mb-20">
        <div className="relative w-full bg-black h-[calc(100vh-4rem)] flex items-center justify-center">
          {/* This will try to load from the public folder. It won't crash Vite if missing. */}
          <img 
             src="/hero-banner.png" 
             alt="Ceylon Earth Organics" 
             className="w-full h-full object-cover" 
             onError={(e) => {
               e.target.onerror = null; 
               e.target.src = "https://via.placeholder.com/1200x500/f3f4f6/9ca3af?text=Please+place+hero-banner.png+in+public+folder";
             }} 
          />
          
          {/* Transparent Dark Overlay */}
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          
          {/* Floating Shop Button */}
          <div className="absolute bottom-10 md:bottom-24 left-1/2 -translate-x-1/2 flex flex-col sm:flex-row gap-4 justify-center w-full px-4 z-10">
            <a href="#shop" className="btn-primary shadow-xl shadow-green-900/20 text-lg py-3 px-10 transition-transform hover:-translate-y-1">
              Shop Our Collection
            </a>
            {!user && (
              <Link to="/register" className="btn-secondary shadow-lg bg-white/90 backdrop-blur text-lg py-3 px-10 transition-transform hover:-translate-y-1">
                Join Now Free
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* SHOP SECTION */}
      <section id="shop" className="max-w-7xl mx-auto px-4 pb-20">
        {/* Search + filter bar */}
        <div className="flex flex-col gap-5 mb-10">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              id="input-search"
              type="text"
              placeholder="Search products..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="input pl-11 shadow-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              id="btn-cat-all"
              onClick={() => setSelected(null)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${selected === null ? 'bg-green-600 text-white shadow-md shadow-green-600/20' : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900 shadow-sm'}`}
            >
              <Tag className="w-3.5 h-3.5" /> All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.categoryId}
                id={`btn-cat-${cat.categoryId}`}
                onClick={() => setSelected(cat.categoryId)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${selected === cat.categoryId ? 'bg-green-600 text-white shadow-md shadow-green-600/20' : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900 shadow-sm'}`}
              >
                {cat.categoryName}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Leaf className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.productId} product={product} onOrder={handleOrder} reviews={reviews} />
            ))}
          </div>
        )}
      </section>

      {/* REVIEWS CAROUSEL SECTION */}
      {reviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-24">
          <div className="text-center mb-10">
            <h2 className="font-heading font-bold text-3xl text-gray-900 mb-2">What Our Customers Say</h2>
            <p className="text-gray-500">Real reviews from verified buyers</p>
          </div>
          
          <div 
            className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {reviews.map((review) => {
              const productObj = products.find(p => p.productId === review.productId);
              const productName = productObj ? productObj.productName : "Our Product";
              
              return (
                <div key={review.reviewId} className="snap-center shrink-0 w-80 md:w-96 bg-white p-6 rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/40">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-green-500 to-emerald-400 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm">
                        {(review.userName || 'U').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex text-yellow-400 mb-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-yellow-400' : 'text-gray-200'}`} />
                          ))}
                        </div>
                        <p className="text-sm font-semibold text-gray-900 leading-tight">
                          {review.userName ? `@${review.userName}` : 'Verified Buyer'}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">Purchased: <span className="font-medium text-gray-600">{productName}</span></p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm italic">"{review.comment}"</p>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  )
}

function ProductCard({ product, onOrder, reviews = [] }) {
  const imgSrc = product.cardImageUrls?.[0] || null
  const productReviews = reviews.filter((r) => r.productId === product.productId)
  const avgRating = productReviews.length > 0 
    ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length 
    : 0

  return (
    <Link
      to={`/product/${product.productId}`}
      id={`product-card-${product.productId}`}
      className="card group hover:border-green-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-900/5 p-0 overflow-hidden block cursor-pointer flex flex-col h-full"
    >
      {/* Image */}
      <div className="h-64 bg-white relative overflow-hidden border-b border-gray-100 p-2">
        {imgSrc ? (
          <img src={imgSrc} alt={product.productName} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Leaf className="w-12 h-12 text-gray-300" />
          </div>
        )}
        {product.categoryName && (
          <div className="absolute top-3 left-3">
            <span className="badge-green text-xs shadow-sm shadow-green-900/10 bg-white border-green-200">{product.categoryName}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 text-base leading-snug mb-1 line-clamp-1">{product.productName}</h3>
        
        {/* Rating Section */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <Star className={`w-3.5 h-3.5 ${productReviews.length > 0 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
          <span className="text-xs font-semibold text-gray-700">
            {productReviews.length > 0 ? avgRating.toFixed(1) : 'No rating'}
          </span>
          {productReviews.length > 0 && (
            <span className="text-[10px] text-gray-400">({productReviews.length})</span>
          )}
        </div>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{product.productDescription}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-green-600 text-lg">₹{Number(product.productPrice).toFixed(2)}</span>
          <button
            id={`btn-order-${product.productId}`}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onOrder(product); }}
            className="flex items-center gap-1.5 bg-green-50 hover:bg-green-600 text-green-700 hover:text-white text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Order
          </button>
        </div>
      </div>
    </Link>
  )
}
