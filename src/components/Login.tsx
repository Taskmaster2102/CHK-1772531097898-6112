import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface LoginProps {
  onLogin: (role: 'buyer' | 'seller') => void
}

function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    setTimeout(() => {
      if (email && password) {
        onLogin(role)
        if (role === 'buyer') {
          navigate('/buyer-dashboard')
        } else {
          navigate('/seller-dashboard')
        }
      } else {
        setError('Please fill in all fields')
      }
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="text-6xl mb-4"
          >
            🏺
          </motion.div>
          <h1 className="text-4xl font-bold text-black mb-2">Craftify</h1>
          <p className="text-gray-500">Handcrafted Marketplace</p>
        </div>

        {/* Login Form */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-black text-center mb-6">Welcome Back</h2>
          
          <form onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-black mb-3">I am a</label>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`flex-1 py-4 px-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    role === 'buyer'
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <span className="text-2xl">🛒</span>
                  <span className="text-sm font-medium">Buyer</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setRole('seller')}
                  className={`flex-1 py-4 px-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    role === 'seller'
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <span className="text-2xl">🏺</span>
                  <span className="text-sm font-medium">Seller / Artisan</span>
                </motion.button>
              </div>
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-black mb-2">Email</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'buyer' ? 'your@email.com' : 'artisan@workshop.com'}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-black mb-2">Password</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-all"
              />
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                `Sign in as ${role === 'buyer' ? 'Buyer' : 'Seller'}`
              )}
            </motion.button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center mb-3">Quick Demo Access</p>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setRole('buyer')
                  setEmail('buyer@demo.com')
                  setPassword('demo123')
                }}
                className="text-xs p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <div className="font-semibold text-black">👤 Buyer</div>
                <div className="text-gray-500">buyer@demo.com</div>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setRole('seller')
                  setEmail('artisan@demo.com')
                  setPassword('demo123')
                }}
                className="text-xs p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <div className="font-semibold text-black">🏺 Seller</div>
                <div className="text-gray-500">artisan@demo.com</div>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Back to Shop */}
        <div className="text-center mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-black transition-colors"
          >
            ← Back to Shop
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default Login

