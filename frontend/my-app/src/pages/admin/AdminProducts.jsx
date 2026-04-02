// src/pages/admin/AdminProducts.jsx
import { useEffect, useState } from 'react'
import { fetchProducts, fetchCategories, addProduct, updateProduct, deleteProduct } from '../../utils/api'
import toast from 'react-hot-toast'
import Loader from '../../components/Loader'
import { Package, Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react'

// Base URL for rendering images mapping to API gateway or original service
const BASE = 'http://localhost:8080'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list') // 'list' | 'form'
  const [form, setForm] = useState({
    productId: null, productName: '', productDescription: '', productPrice: '', categoryId: ''
  })
  const [cardImages, setCardImages] = useState(null)
  const [detailImages, setDetailImages] = useState(null)
  
  const load = () => {
    Promise.all([fetchProducts(), fetchCategories()])
      .then(([p, c]) => {
        setProducts(p.data)
        setCategories(c.data)
      })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setForm({ productId: null, productName: '', productDescription: '', productPrice: '', categoryId: '' })
    setCardImages(null)
    setDetailImages(null)
    setView('form')
  }

  const openEdit = (p) => {
    setForm({
      productId: p.productId,
      productName: p.productName,
      productDescription: p.productDescription,
      productPrice: p.productPrice,
      categoryId: p.categoryId,
    })
    setCardImages(null)
    setDetailImages(null)
    setView('form')
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      toast.success('Product deleted')
      load()
    } catch {
      toast.error('Failed to delete product')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (detailImages && detailImages.length > 4) {
      toast.error('You can only upload up to 4 detail images')
      return;
    }
    
    try {
      const formData = new FormData()
      formData.append('productName', form.productName)
      formData.append('productDescription', form.productDescription)
      formData.append('productPrice', form.productPrice)
      formData.append('categoryId', form.categoryId)
      if (form.productId) formData.append('productId', form.productId)
      
      if (cardImages && cardImages.length > 0) {
        for (let i = 0; i < cardImages.length; i++) {
          formData.append('cardImages', cardImages[i])
        }
      }
      
      if (detailImages && detailImages.length > 0) {
        for (let i = 0; i < detailImages.length; i++) {
          formData.append('detailImages', detailImages[i])
        }
      }

      if (form.productId) {
        await updateProduct(formData)
        toast.success('Product updated')
      } else {
        await addProduct(formData)
        toast.success('Product created')
      }
      setView('list')
      load()
    } catch (err) {
      toast.error(err.response?.data || 'Failed to save product')
    }
  }

  if (loading) return <Loader />

  if (view === 'list') {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading font-bold text-3xl text-gray-900 mb-1">Products</h1>
            <p className="text-gray-500">Manage your catalog</p>
          </div>
          <button onClick={openAdd} className="btn-primary flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        <div className="card p-0 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((p) => (
                <tr key={p.productId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    {p.cardImageUrls && p.cardImageUrls.length > 0 ? (
                      <img src={p.cardImageUrls[0]} alt={p.productName} className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                        <ImageIcon className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{p.productName}</td>
                  <td className="px-6 py-4 text-gray-500">{p.categoryName || `ID: ${p.categoryId}`}</td>
                  <td className="px-6 py-4 text-green-600 font-medium">₹{Number(p.productPrice).toFixed(2)}</td>
                  <td className="px-6 py-4 flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(p)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p.productId)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 bg-white">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-2xl text-gray-900">
          {form.productId ? 'Edit Product' : 'Create New Product'}
        </h2>
        <button onClick={() => setView('list')} className="text-gray-500 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name</label>
              <input required type="text" placeholder="E.g., Organic Honey" value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} className="input" />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea required rows={4} placeholder="Detailed product description..." value={form.productDescription} onChange={(e) => setForm({ ...form, productDescription: e.target.value })} className="input resize-none" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (₹)</label>
              <input required type="number" step="0.01" placeholder="0.00" value={form.productPrice} onChange={(e) => setForm({ ...form, productPrice: e.target.value })} className="input" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
              <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="input bg-white text-gray-900 cursor-pointer">
                <option value="" disabled>Select category</option>
                {categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                ))}
              </select>
            </div>
            
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Card Image</label>
              <p className="text-xs text-gray-500 mb-3">Upload 1 image for the product thumbnail.</p>
              <input type="file" accept="image/*" onChange={(e) => setCardImages(e.target.files)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 cursor-pointer" />
              {cardImages && cardImages.length > 0 && (
                <div className="mt-4 flex gap-2 flex-wrap">
                  {Array.from(cardImages).map((file, idx) => (
                    <img key={idx} src={URL.createObjectURL(file)} alt="preview" className="w-20 h-20 object-cover rounded-lg border border-gray-300 shadow-sm" />
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <div className="flex justify-between items-start mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">Detail Images</label>
                {detailImages && detailImages.length > 0 && (
                  <button type="button" onClick={() => setDetailImages(null)} className="text-xs text-red-500 hover:underline">
                    Clear Selection
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mb-3">Upload up to 4 images for the product page gallery. Select multiple or add one by one.</p>
              <input type="file" multiple accept="image/*" onChange={(e) => {
                const newFiles = Array.from(e.target.files)
                setDetailImages(prev => {
                  const existing = prev ? Array.from(prev) : []
                  const combined = [...existing, ...newFiles]
                  if (combined.length > 4) {
                    toast.error('Maximum 4 images allowed. Only keeping the first 4.')
                    return combined.slice(0, 4)
                  }
                  return combined
                })
              }} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer" />
              {detailImages && detailImages.length > 0 && (
                <div className="mt-4 flex gap-2 flex-wrap">
                  {Array.from(detailImages).map((file, idx) => (
                    <img key={idx} src={URL.createObjectURL(file)} alt="preview" className="w-20 h-20 object-cover rounded-lg border border-gray-300 shadow-sm" />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-6 flex justify-end gap-4 border-t border-gray-200">
            <button type="button" onClick={() => setView('list')} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary flex items-center justify-center">Save Product</button>
          </div>
        </form>
      </div>
    </div>
  )
}
