// src/pages/admin/AdminUsers.jsx
import { useEffect, useState } from 'react'
import { fetchUsers, deleteUser } from '../../utils/api'
import toast from 'react-hot-toast'
import Loader from '../../components/Loader'
import { Users, Trash2, Shield, User } from 'lucide-react'

export default function AdminUsers() {
  const [usersList, setUsersList] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    fetchUsers()
      .then((res) => setUsersList(res.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      await deleteUser(id)
      toast.success('User deleted')
      load()
    } catch {
      toast.error('Failed to delete user')
    }
  }

  if (loading) return <Loader />

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl text-gray-900 mb-1">Users</h1>
        <p className="text-gray-500">Manage registered users and admins</p>
      </div>

      <div className="card p-0 overflow-x-auto bg-white border border-gray-200">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">User ID</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {usersList.map((u) => (
              <tr key={u.userId} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${u.role === 'ADMIN' ? 'bg-gradient-to-br from-red-500 to-pink-500' : 'bg-gradient-to-br from-green-500 to-emerald-500'}`}>
                      {u.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-gray-500">@{u.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${u.role === 'ADMIN' ? 'bg-red-900/30 text-red-400 border-red-700/50' : 'bg-green-900/30 text-green-400 border-green-700/50'}`}>
                    {u.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{u.email}</td>
                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{u.userId}</td>
                <td className="px-6 py-4 flex items-center justify-end gap-2">
                  <button onClick={() => handleDelete(u.userId)} className="p-2 text-red-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {usersList.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
