import { AuthProvider } from './features/auth/AuthContext'
import { AddressProvider } from './features/address/AddressContext'
import { CartProvider } from './features/cart/CartContext'
import { WishlistProvider } from './features/wishlist/WishlistContext'
import { AppRouter } from './routes/AppRouter'

function App() {
  return (
    <AuthProvider>
      <AddressProvider>
        <CartProvider>
          <WishlistProvider>
            <AppRouter />
          </WishlistProvider>
        </CartProvider>
      </AddressProvider>
    </AuthProvider>
  )
}

export default App
