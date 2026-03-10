import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
}

const products: Product[] = [
  {
    id: 1,
    name: 'Classic Terracotta Pot',
    description: 'Handcrafted traditional clay pot with authentic finish',
    price: 850,
    image: '🏺'
  },
  {
    id: 2,
    name: 'Fluted Artisanal Vessel',
    description: 'Elegant fluted design with natural glazing',
    price: 950,
    image: '🫖'
  },
  {
    id: 3,
    name: 'Tapered Earthen Jar',
    description: 'Modern tapered shape for contemporary spaces',
    price: 900,
    image: '🫙'
  },
  {
    id: 4,
    name: 'Bottle Grace',
    description: 'Sleek bottle form perfect for dried arrangements',
    price: 780,
    image: '🍾'
  },
  {
    id: 5,
    name: 'Rustic Bowl',
    description: 'Wide-rimmed bowl ideal for centerpiece displays',
    price: 650,
    image: '🥣'
  },
  {
    id: 6,
    name: 'Vase Statement',
    description: 'Tall vase statement piece for dramatic floral displays',
    price: 1100,
    image: '🏜️'
  }
]

function Shop() {
  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-black mb-4">Our Collection</h2>
        <p className="text-lg text-gray-500">Handcrafted clay pottery from master artisans</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover"
          >
            <div className="h-56 bg-gray-50 flex items-center justify-center text-7xl relative overflow-hidden group">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                {product.image}
              </motion.div>
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-black mb-2">{product.name}</h3>
              <p className="text-gray-500 mb-4">{product.description}</p>
              <div className="flex items-center justify-between">
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className="text-2xl font-bold text-black"
                >
                  ${product.price}
                </motion.span>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/customize"
                    className="btn-float text-sm"
                  >
                    Customize
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-16 bg-black text-white rounded-2xl p-12 text-center"
      >
        <motion.h3 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-3xl font-bold mb-4"
        >
          Want Something Unique?
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-gray-400 mb-8 max-w-lg mx-auto"
        >
          Create your own custom-designed clay pottery with our artisan customization service. Choose your shape, size, material, and finish.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link
            to="/customize"
            className="inline-block bg-white text-black px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Start Customizing
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Shop

