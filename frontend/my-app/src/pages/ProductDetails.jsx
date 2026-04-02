import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchProductById, addOrder } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import Loader from '../components/Loader'
import { ArrowLeft, ShoppingCart, Leaf } from 'lucide-react'

const BASE = 'http://localhost:8080'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState(null)

  useEffect(() => {
    fetchProductById(id)
      .then((res) => {
        setProduct(res.data)
        const firstImg = res.data.detailImageUrls?.[0] || res.data.cardImageUrls?.[0]
        if (firstImg) setMainImage(firstImg)
      })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleOrder = async () => {
    if (!user) { navigate('/login'); return }
    try {
      await addOrder({ userId: user.userId, productId: product.productId, quantity: 1, status: 'PENDING' })
      toast.success(`"${product.productName}" added to your orders!`)
    } catch (err) {
      toast.error(err.response?.data || 'Could not place order')
    }
  }

  if (loading) return <Loader />
  if (!product) return <div className="pt-24 text-center text-gray-500">Product not found.</div>

  const allImages = [...(product.detailImageUrls || []), ...(product.cardImageUrls || [])]

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center relative shadow-sm">
              {mainImage ? (
                <img src={mainImage} className="w-full h-full object-cover" alt={product.productName} />
              ) : (
                <Leaf className="w-20 h-20 text-gray-300" />
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 px-1">
                {allImages.map((imgUrl, i) => (
                  <button 
                    key={i} 
                    onClick={() => setMainImage(imgUrl)}
                    className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shadow-sm ${mainImage === imgUrl ? 'border-green-500 shadow-green-500/20' : 'border-gray-200 opacity-70 hover:opacity-100'}`}
                  >
                    <img src={imgUrl} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
               {product.categoryName && <span className="badge-green px-3 py-1 text-sm bg-white border-green-200 shadow-sm">{product.categoryName}</span>}
            </div>
            <h1 className="font-heading font-bold text-4xl sm:text-5xl text-gray-900 mb-4 leading-tight">{product.productName}</h1>
            <p className="text-3xl font-bold text-green-600 mb-8">₹{Number(product.productPrice).toFixed(2)}</p>
            
            <div className="card bg-white mb-8 border-gray-200 shadow-sm">
              <h3 className="text-gray-900 font-bold mb-3 text-lg">Product Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {product.productDescription}
              </p>
            </div>

            <button 
              onClick={handleOrder}
              className="btn-primary w-full py-4 text-lg flex justify-center items-center gap-2 shadow-xl shadow-green-600/30 font-bold"
            >
              <ShoppingCart className="w-5 h-5" />
              Pre-Order Now
            </button>
            <p className="text-gray-500 text-xs text-center mt-4">Orders will be confirmed by administrators subject to inventory availability.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
