// src/pages/admin/AdminInventory.jsx
import { useEffect, useState } from 'react'
import { fetchInventoryList, addInventory, updateInventory, deleteInventory, fetchProducts } from '../../utils/api'
import toast from 'react-hot-toast'
import Loader from '../../components/Loader'
import { Boxes, Plus, Edit2, Trash2, X } from 'lucide-react'

export default function AdminInventory() {
  const [inventory, setInventory] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ inventoryId: null, productId: '', quantity: 0 })

  const load = () => {
    Promise.all([fetchInventoryList(), fetchProducts()])
      .then(([inv, prod]) => {
        setInventory(inv.data)
        setProducts(prod.data)
      })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setForm({ inventoryId: null, productId: '', quantity: 0 })
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setForm({ ...item })
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this inventory record?')) return
    try {
      await deleteInventory(id)
      toast.success('Inventory deleted')
      load()
    } catch {
      toast.error('Failed to delete inventory')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (form.inventoryId) {
        await updateInventory(form)
        toast.success('Inventory updated')
      } else {
        await addInventory(form)
        toast.success('Inventory added')
      }
      setModalOpen(false)
      load()
    } catch {
      toast.error('Failed to save inventory')
    }
  }

  const getProductName = (pid) => {
    const p = products.find(x => x.productId === pid)
    return p ? p.productName : pid
  }

  if (loading) return <Loader />

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-bold text-3xl text-gray-900 mb-1">Inventory</h1>
          <p className="text-gray-500">Manage stock levels</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Inventory
        </button>
      </div>

      <div className="card p-0 overflow-x-auto bg-white border border-gray-200">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inventory.map((item) => (
              <tr key={item.inventoryId} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{item.inventoryId}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{getProductName(item.productId)}</td>
                <td className="px-6 py-4 font-bold text-gray-900">{item.quantity}</td>
                <td className="px-6 py-4">
                  {item.quantity === 0 ? (
                    <span className="badge-red">Out of Stock</span>
                  ) : item.quantity < 10 ? (
                    <span className="badge-yellow">Low Stock</span>
                  ) : (
                    <span className="badge-green">In Stock</span>
                  )}
                </td>
                <td className="px-6 py-4 flex items-center justify-end gap-2">
                  <button onClick={() => openEdit(item)} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.inventoryId)} className="p-2 text-red-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {inventory.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No inventory records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="card w-full max-w-md border border-gray-200 bg-white shadow-2xl relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-heading font-bold text-xl mb-4 text-gray-900">
              {form.inventoryId ? 'Edit Inventory' : 'Add Inventory'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Product</label>
                <select
                  required
                  disabled={!!form.inventoryId} // Prevent changing product for existing entry
                  value={form.productId}
                  onChange={(e) => setForm({ ...form, productId: e.target.value })}
                  className="input appearance-none bg-white"
                >
                  <option value="" disabled>Select product</option>
                  {products.map(p => (
                    <option key={p.productId} value={p.productId}>{p.productName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity</label>
                <input
                  required
                  type="number"
                  min="0"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })}
                  className="input"
                />
              </div>
              <div className="pt-2 flex justify-end gap-3 border-t border-gray-200 mt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
