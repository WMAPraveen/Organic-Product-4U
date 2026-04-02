// src/pages/Profile.jsx
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateUser } from '../utils/api'
import toast from 'react-hot-toast'
import { User, Save, Shield, Mail, AlignLeft } from 'lucide-react'

export default function Profile() {
  const { user, signIn } = useAuth()
  const [form, setForm] = useState({
    userId: user?.userId || '',
    username: user?.username || '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form }
      if (!payload.password) delete payload.password
      const res = await updateUser(payload)
      signIn({ ...user, username: res.data.username })
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-green-900/40 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-2xl text-white">My Profile</h1>
            <p className="text-gray-500 text-sm">Update your personal information</p>
          </div>
        </div>

        {/* Role badge */}
        <div className="card mb-6 flex items-center gap-3 p-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-500 rounded-full flex items-center justify-center font-bold text-xl">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-white">@{user?.username}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Shield className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400 font-medium">{user?.role}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5 flex items-center gap-1.5">
                  <AlignLeft className="w-3.5 h-3.5" /> First Name
                </label>
                <input id="input-firstName" name="firstName" type="text" value={form.firstName} onChange={handleChange} placeholder="John" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Last Name</label>
                <input id="input-lastName" name="lastName" type="text" value={form.lastName} onChange={handleChange} placeholder="Doe" className="input" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Username
              </label>
              <input id="input-username" name="username" type="text" value={form.username} onChange={handleChange} placeholder="Username" className="input" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email
              </label>
              <input id="input-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" className="input" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                New Password <span className="text-gray-600">(leave blank to keep current)</span>
              </label>
              <input id="input-password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" className="input" />
            </div>

            <button id="btn-save-profile" type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2">
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
