// src/pages/admin/AdminCategories.jsx
import { useEffect, useState } from 'react'
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../../utils/api'
import toast from 'react-hot-toast'
import Loader from '../../components/Loader'
import { Tag, Plus, Edit2, Trash2, X } from 'lucide-react'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ categoryId: null, categoryName: '', categoryDescription: '' })

  const load = () => {
    fetchCategories()
      .then((res) => setCategories(res.data))
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setForm({ categoryId: null, categoryName: '', categoryDescription: '' })
    setModalOpen(true)
  }

  const openEdit = (cat) => {
    setForm({ ...cat })
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    try {
      await deleteCategory(id)
      toast.success('Category deleted')
      load()
    } catch {
      toast.error('Failed to delete category')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (form.categoryId) {
        await updateCategory(form)
        toast.success('Category updated')
      } else {
        await addCategory(form)
        toast.success('Category created')
      }
      setModalOpen(false)
      load()
    } catch {
      toast.error('Failed to save category')
    }
  }

  if (loading) return <Loader />

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-bold text-3xl text-gray-900 mb-1">Categories</h1>
          <p className="text-gray-500">Manage product categories</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.categoryId} className="card bg-white border border-gray-200 hover:border-gray-300 transition-all flex flex-col items-start shadow-sm">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
              <Tag className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">{cat.categoryName}</h3>
            <p className="text-gray-500 text-sm flex-1 mb-4">{cat.categoryDescription}</p>
            
            <div className="flex items-center gap-2 w-full pt-4 border-t border-gray-200">
              <button
                onClick={() => openEdit(cat)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => handleDelete(cat.categoryId)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-sm text-red-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-gray-500 col-span-full">No categories found.</p>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="card w-full max-w-md border border-gray-200 bg-white shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-heading font-bold text-xl mb-4 text-gray-900">
              {form.categoryId ? 'Edit Category' : 'New Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                <input
                  required
                  type="text"
                  value={form.categoryName}
                  onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
                  className="input"
                  placeholder="e.g. Vegetables"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.categoryDescription}
                  onChange={(e) => setForm({ ...form, categoryDescription: e.target.value })}
                  className="input resize-none"
                  placeholder="Fresh organic vegetables..."
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
