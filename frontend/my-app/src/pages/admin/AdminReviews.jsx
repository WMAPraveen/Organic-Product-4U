// src/pages/admin/AdminReviews.jsx
import { useEffect, useState } from 'react'
import { fetchAllReviews, deleteReview, fetchUsers, fetchProducts } from '../../utils/api'
import toast from 'react-hot-toast'
import Loader from '../../components/Loader'
import { MessageSquare, Trash2, Star, User, Package } from 'lucide-react'

export default function AdminReviews() {
  const [reviewsList, setReviewsList] = useState([])
  const [usersMap, setUsersMap] = useState({})
  const [productsMap, setProductsMap] = useState({})
  const [loading, setLoading] = useState(true)

  const load = () => {
    Promise.all([
      fetchAllReviews(),
      fetchUsers().catch(() => ({ data: [] })),
      fetchProducts().catch(() => ({ data: [] }))
    ])
      .then(([resReviews, resUsers, resProducts]) => {
        setReviewsList(resReviews.data)
        
        const uMap = {}
        if (resUsers?.data && Array.isArray(resUsers.data)) {
          resUsers.data.forEach(u => uMap[u.userId] = u.username || u.firstName)
        }
        setUsersMap(uMap)

        const pMap = {}
        if (resProducts?.data && Array.isArray(resProducts.data)) {
          resProducts.data.forEach(p => pMap[p.productId] = p.productName)
        }
        setProductsMap(pMap)
      })
      .catch(() => toast.error('Failed to load reviews data'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this review?')) return
    try {
      await deleteReview(id)
      toast.success('Review deleted')
      load()
    } catch {
      toast.error('Failed to delete review')
    }
  }

  if (loading) return <Loader />

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl text-gray-900 mb-1">Reviews</h1>
        <p className="text-gray-500">Manage customer reviews and ratings</p>
      </div>

      <div className="card p-0 overflow-x-auto bg-white border border-gray-200">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Comment</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reviewsList.map((r) => (
              <tr key={r.reviewId} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{productsMap[r.productId] || r.productId}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                      {(usersMap[r.userId] || 'U')[0].toUpperCase()}
                    </div>
                    <span className="text-gray-600">@{usersMap[r.userId] || r.userId}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border bg-yellow-50 text-yellow-600 border-yellow-200">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {r.rating} / 5
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 truncate max-w-xs" title={r.comment}>
                  {r.comment}
                </td>
                <td className="px-6 py-4 flex items-center justify-end gap-2">
                  <button onClick={() => handleDelete(r.reviewId)} className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {reviewsList.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No reviews found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
