// src/utils/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

// Attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (role) {
    config.headers['X-User-Role'] = role
  }
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login = (data) => api.post('/login', data)
export const register = (data) => api.post('/register', data)

// ── Products ──────────────────────────────────────────────────────────────────
export const fetchProducts = () => api.get('/productlist')
export const fetchProductById = (id) => api.get(`/product/${id}`)
export const fetchProductsByCategory = (catId) => api.get(`/productlist/${catId}`)
export const searchProducts = (keyword) => api.get('/productsearch', { params: { keyword } })
export const addProduct = (formData) =>
  api.post('/addproduct', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateProduct = (formData) =>
  api.put('/updateproduct', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteProduct = (id) => api.delete(`/deleteproduct/${id}`)

// ── Categories ────────────────────────────────────────────────────────────────
export const fetchCategories = () => api.get('/categorylist')
export const fetchCategoryById = (id) => api.get(`/category/${id}`)
export const addCategory = (data) => api.post('/addcategory', data)
export const updateCategory = (data) => api.put('/updatecategory', data)
export const deleteCategory = (id) => api.delete(`/deletecategory/${id}`)

// ── Inventory ─────────────────────────────────────────────────────────────────
export const fetchInventoryList = () => api.get('/inventorylist')
export const fetchInventoryByProduct = (productId) => api.get(`/inventory/product/${productId}`)
export const addInventory = (data) => api.post('/addinventory', data)
export const updateInventory = (data) => api.put('/updateinventory', data)
export const deleteInventory = (id) => api.delete(`/deleteinventory/${id}`)

// ── Orders ────────────────────────────────────────────────────────────────────
export const fetchOrders = () => api.get('/orderlist')
export const fetchOrdersByUser = (userId) => api.get(`/order/user/${userId}`)
export const fetchOrderById = (id) => api.get(`/order/${id}`)
export const addOrder = (data) => api.post('/addorder', data)
export const updateOrder = (data) => api.put('/updateorder', data)
export const deleteOrder = (id) => api.delete(`/deleteorder/${id}`)

// ── Users ─────────────────────────────────────────────────────────────────────
export const fetchUsers = () => api.get('/userlist')
export const fetchUserById = (id) => api.get(`/user/${id}`)
export const updateUser = (data) => api.put('/updateuser', data)
export const deleteUser = (id) => api.delete(`/deleteuser/${id}`)

// ── Reviews ───────────────────────────────────────────────────────────────────
export const fetchAllReviews = () => api.get('/reviews')
export const fetchReviewsByProduct = (productId) => api.get(`/reviews/product/${productId}`)
export const fetchReviewsByUser = (userId) => api.get(`/reviews/user/${userId}`)
export const addReview = (data) => api.post('/reviews', data)
export const updateReview = (id, data) => api.put(`/reviews/${id}`, data)
export const deleteReview = (id) => api.delete(`/reviews/${id}`)

// ── Payments ──────────────────────────────────────────────────────────────────
export const createCheckoutSession = (data) => api.post('/payment/create-checkout-session', data)

// ── Cart ──────────────────────────────────────────────────────────────────────
export const fetchCartByUser = (userId) => api.get(`/cart/user/${userId}`)
export const addToCartApi = (data) => api.post('/cart/add', data)
export const updateCartItemApi = (id, data) => api.put(`/cart/update/${id}`, data)
export const removeCartItemApi = (id) => api.delete(`/cart/remove/${id}`)
export const clearCartApi = (userId) => api.delete(`/cart/clear/${userId}`)
