import { useState } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { CartProvider, useCart } from './context/CartContext'
import { AnimatePresence, motion } from 'framer-motion'
import Shop from './components/Shop'
import ProductCustomizer from './components/ProductCustomizer'
import BuyerDashboard from './components/BuyerDashboard'
import SellerDashboard from './components/SellerDashboard'
import Login from './components/Login'
import Cart from './components/Cart'

type UserRole = 'buyer' | 'seller' | null

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { totalItems, setIsCartOpen } = useCart()

  const handleLogin = (role: 'buyer' | 'seller') => {
    setUserRole(role)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setUserRole(null)
    setIsLoggedIn(false)
    navigate('/')
  }

  const getNavLinks = () => {
    const links = [
      { path: '/', label: 'Shop' },
      { path: '/customize', label: 'Customize' },
    ]

    if (isLoggedIn) {
      if (userRole === 'buyer') {
        links.push({ path: '/buyer-dashboard', label: 'My Dashboard' })
      } else if (userRole === 'seller') {
        links.push({ path: '/seller-dashboard', label: 'Production' })
      }
    } else {
      links.push({ path: '/login', label: 'Login' })
    }

    return links
  }

  const navLinks = getNavLinks()

  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🏺</span>
              <h1 className="text-2xl font-bold tracking-tight text-black">
                Chakravyuh
              </h1>
            </Link>
            {isLoggedIn && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  userRole === 'buyer' ? 'bg-black text-white' : 'bg-gray-500 text-white'
                }`}
              >
                {userRole === 'buyer' ? '🛒 Buyer' : '🏺 Seller'}
              </motion.span>
            )}
          </div>
          
          <div className="flex gap-6 items-center">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={link.path}
                  className={`text-sm font-medium transition-all relative py-1 ${
                    location.pathname === link.path 
                      ? 'text-black' 
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {link.label}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black"
                    />
                  )}
                </Link>
              </motion.div>
            ))}
            
            {/* Cart Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-black hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </motion.button>

            {isLoggedIn && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleLogout}
                className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
              >
                Logout
              </motion.button>
            )}
          </div>
        </div>
      </nav>

      <Cart />

      <main className="max-w-7xl mx-auto p-6">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={
              <motion.div
                key="shop"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Shop />
              </motion.div>
            } />
            <Route path="/customize" element={
              <motion.div
                key="customize"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCustomizer />
              </motion.div>
            } />
            <Route 
              path="/buyer-dashboard" 
              element={
                isLoggedIn && userRole === 'buyer' ? (
                  <motion.div
                    key="buyer-dashboard"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BuyerDashboard />
                  </motion.div>
                ) : (
                  <motion.div
                    key="access-denied-buyer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                  >
                    <h2 className="text-3xl font-bold text-black mb-4">Access Denied</h2>
                    <p className="text-gray-500 mb-6">Please login as a buyer to view this page.</p>
                    <Link to="/login" className="btn-float-solid">
                      Login as Buyer
                    </Link>
                  </motion.div>
                )
              } 
            />
            <Route 
              path="/seller-dashboard" 
              element={
                isLoggedIn && userRole === 'seller' ? (
                  <motion.div
                    key="seller-dashboard"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SellerDashboard />
                  </motion.div>
                ) : (
                  <motion.div
                    key="access-denied-seller"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                  >
                    <h2 className="text-3xl font-bold text-black mb-4">Access Denied</h2>
                    <p className="text-gray-500 mb-6">Please login as a seller/artisan to view this page.</p>
                    <Link to="/login" className="btn-float-solid">
                      Login as Seller
                    </Link>
                  </motion.div>
                )
              } 
            />
            <Route 
              path="/login" 
              element={
                <motion.div
                  key="login"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  {isLoggedIn ? (
                    userRole === 'buyer' ? <BuyerDashboard /> : <SellerDashboard />
                  ) : (
                    <Login onLogin={handleLogin} />
                  )}
                </motion.div>
              } 
            />
          </Routes>
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-gray-200 text-center py-6 mt-12">
        <p className="text-sm text-gray-500">© 2024 Chakravyuh Artisan Marketplace. Handcrafted with love.</p>
      </footer>
    </>
  )
}

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Navbar />
      </div>
    </CartProvider>
  )
}

export default App

