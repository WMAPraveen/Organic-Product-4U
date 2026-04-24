import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { fetchCartByUser, addToCartApi, updateCartItemApi, removeCartItemApi, clearCartApi } from '../utils/api'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)

  // Load cart from backend when user logs in
  const loadCart = useCallback(async () => {
    if (!user?.userId) {
      setCart([])
      return
    }
    setLoading(true)
    try {
      const res = await fetchCartByUser(user.userId)
      setCart(res.data || [])
    } catch (err) {
      console.error('Failed to load cart:', err)
      setCart([])
    } finally {
      setLoading(false)
    }
  }, [user?.userId])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  const addToCart = async (product, quantity = 1) => {
    if (!user?.userId) return

    // Optimistic UI update
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.productId)
      if (existing) {
        return prev.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, {
        productId: product.productId,
        productName: product.productName,
        productPrice: product.productPrice,
        imageUrl: product.detailImageUrls?.[0] || product.cardImageUrls?.[0] || null,
        quantity,
      }]
    })

    try {
      await addToCartApi({
        userId: user.userId,
        productId: product.productId,
        productName: product.productName,
        productPrice: product.productPrice,
        imageUrl: product.detailImageUrls?.[0] || product.cardImageUrls?.[0] || null,
        quantity,
      })
      // Reload from backend to get proper cartItemIds
      await loadCart()
    } catch (err) {
      console.error('Failed to add to cart:', err)
      // Revert on failure
      await loadCart()
    }
  }

  const removeFromCart = async (productId) => {
    const item = cart.find(i => i.productId === productId)
    if (!item) return

    // Optimistic UI update
    setCart(prev => prev.filter(i => i.productId !== productId))

    try {
      if (item.cartItemId) {
        await removeCartItemApi(item.cartItemId)
      }
    } catch (err) {
      console.error('Failed to remove from cart:', err)
      await loadCart()
    }
  }

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return

    const item = cart.find(i => i.productId === productId)
    if (!item) return

    // Optimistic UI update
    setCart(prev =>
      prev.map(i =>
        i.productId === productId ? { ...i, quantity } : i
      )
    )

    try {
      if (item.cartItemId) {
        await updateCartItemApi(item.cartItemId, { quantity })
      }
    } catch (err) {
      console.error('Failed to update quantity:', err)
      await loadCart()
    }
  }

  const clearCart = async () => {
    setCart([])
    if (user?.userId) {
      try {
        await clearCartApi(user.userId)
      } catch (err) {
        console.error('Failed to clear cart:', err)
      }
    }
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + Number(item.productPrice || 0) * item.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal, loading }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
