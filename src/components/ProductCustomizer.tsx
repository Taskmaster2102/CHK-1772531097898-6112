import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'

type Shape = 'Classic' | 'Tapered' | 'Fluted' | 'Bottle' | 'Bowl' | 'Vase'
type Size = 'S' | 'M' | 'L' | 'XL'
type Material = 'Terracotta' | 'Stoneware' | 'Porcelain' | 'Earthenware'
type Pattern = 'Plain' | 'Spiral' | 'Geometric' | 'Floral' | 'Rustic' | 'Minimal'

const glazeColors = [
  { name: 'Matte Black', value: '#1a1a1a', roughness: 0.9 },
  { name: 'Charcoal Gray', value: '#36454F', roughness: 0.7 },
  { name: 'Pearl White', value: '#F5F5F5', roughness: 0.3 },
  
  { name: 'Warm Gray', value: '#A89F91', roughness: 0.6 },
  { name: 'Slate', value: '#2F4F4F', roughness: 0.5 },
  { name: 'Taupe', value: '#8B8589', roughness: 0.5 },
  { name: 'Bronze', value: '#CD7F32', roughness: 0.4 },
  { name: 'Copper', value: '#B87333', roughness: 0.35 },
]

const materials: { name: Material; price: number; description: string; baseColor: string }[] = [
  { name: 'Terracotta', price: 0, description: 'Traditional clay with rustic charm', baseColor: '#C45C3E' },
  { name: 'Stoneware', price: 50, description: 'Durable and watertight', baseColor: '#6B6B6B' },
  { name: 'Porcelain', price: 100, description: 'Delicate and elegant', baseColor: '#F8F8F8' },
  { name: 'Earthenware', price: -30, description: 'Lightweight and porous', baseColor: '#D4A574' },
]

const patterns: { name: Pattern; price: number }[] = [
  { name: 'Plain', price: 0 },
  { name: 'Spiral', price: 25 },
  { name: 'Geometric', price: 35 },
  { name: 'Floral', price: 45 },
  { name: 'Rustic', price: 20 },
  { name: 'Minimal', price: 15 },
]

// Shape dimensions for realistic rendering
const shapeStyles: Record<Shape, { 
  container: string; 
  body: string; 
  rim: string;
  shadow: string;
}> = {
  Classic: {
    container: 'w-40 h-48',
    body: 'rounded-b-[40%] rounded-t-[15%]',
    rim: 'rounded-full',
    shadow: '0 15px 35px rgba(0,0,0,0.3)'
  },
  Tapered: {
    container: 'w-36 h-52',
    body: 'rounded-b-[30%] rounded-t-[5%]',
    rim: 'rounded-full',
    shadow: '0 20px 40px rgba(0,0,0,0.35)'
  },
  Fluted: {
    container: 'w-44 h-46',
    body: 'rounded-b-[35%] rounded-t-[20%]',
    rim: 'rounded-full',
    shadow: '0 15px 30px rgba(0,0,0,0.25)'
  },
  Bottle: {
    container: 'w-32 h-56',
    body: 'rounded-b-[25%] rounded-t-[40%]',
    rim: 'rounded-full',
    shadow: '0 20px 45px rgba(0,0,0,0.4)'
  },
  Bowl: {
    container: 'w-52 h-28',
    body: 'rounded-b-[50%] rounded-t-[10%]',
    rim: 'rounded-full',
    shadow: '0 10px 25px rgba(0,0,0,0.2)'
  },
  Vase: {
    container: 'w-38 h-54',
    body: 'rounded-b-[20%] rounded-t-[30%]',
    rim: 'rounded-full',
    shadow: '0 18px 38px rgba(0,0,0,0.35)'
  },
}

const sizeDimensions: Record<Size, { height: string; diameter: string; capacity: string; scale: number }> = {
  S: { height: '6"', diameter: '4"', capacity: '500ml', scale: 0.75 },
  M: { height: '9"', diameter: '6"', capacity: '1L', scale: 1 },
  L: { height: '12"', diameter: '8"', capacity: '2L', scale: 1.25 },
  XL: { height: '15"', diameter: '10"', capacity: '4L', scale: 1.5 },
}

// Realistic Pot Component
const RealisticPot = ({ 
  shape, 
  size, 
  glazeColor, 
  pattern,
  material 
}: { 
  shape: Shape; 
  size: Size; 
  glazeColor: string; 
  pattern: Pattern;
  material: Material;
}) => {
  const currentGlaze = glazeColors.find(c => c.value === glazeColor) || glazeColors[0]
  const shapeStyle = shapeStyles[shape]
  const sizeScale = sizeDimensions[size].scale

  // Generate pattern overlay styles - more visible and realistic
  const getPatternStyles = () => {
    const encodedColor = encodeURIComponent(glazeColor)
    switch(pattern) {
      case 'Spiral':
        return {
          background: `repeating-conic-gradient(from 0deg at 50% 50%, ${glazeColor}40 0deg, ${glazeColor}60 2deg, ${glazeColor}30 4deg, transparent 4deg, transparent 8deg)`,
          backgroundSize: '100% 100%',
          mixBlendMode: 'multiply'
        }
      case 'Geometric':
        return {
          background: `repeating-linear-gradient(45deg, transparent, transparent 6px, ${glazeColor}35 6px, ${glazeColor}50 12px),
                       repeating-linear-gradient(-45deg, transparent, transparent 6px, ${glazeColor}35 6px, ${glazeColor}50 12px),
                       linear-gradient(90deg, ${glazeColor}20 50%, transparent 50%),
                       linear-gradient(${glazeColor}20 50%, transparent 50%)`,
          backgroundSize: '24px 24px, 24px 24px, 48px 48px, 48px 48px',
          backgroundPosition: '0 0, 12px 12px, 0 0, 12px 12px',
          mixBlendMode: 'multiply'
        }
      case 'Floral':
        return {
          background: `
            radial-gradient(circle at 20% 25%, ${glazeColor}50 3px, transparent 3px),
            radial-gradient(circle at 60% 35%, ${glazeColor}45 2.5px, transparent 2.5px),
            radial-gradient(circle at 80% 60%, ${glazeColor}50 3px, transparent 3px),
            radial-gradient(circle at 35% 70%, ${glazeColor}40 2px, transparent 2px),
            radial-gradient(circle at 15% 55%, ${glazeColor}35 2px, transparent 2px),
            radial-gradient(circle at 70% 80%, ${glazeColor}45 2.5px, transparent 2.5px),
            radial-gradient(circle at 45% 45%, ${glazeColor}40 2px, transparent 2px),
            radial-gradient(circle at 25% 85%, ${glazeColor}35 2px, transparent 2px)
          `,
          backgroundSize: '50px 50px',
          mixBlendMode: 'multiply'
        }
      case 'Rustic':
        return {
          background: `
            radial-gradient(circle at 50% 50%, ${glazeColor}45 1px, transparent 1px),
            radial-gradient(circle at 25% 25%, ${glazeColor}40 1.5px, transparent 1.5px),
            radial-gradient(circle at 75% 75%, ${glazeColor}40 1.5px, transparent 1.5px),
            radial-gradient(circle at 10% 60%, ${glazeColor}35 1px, transparent 1px),
            radial-gradient(circle at 90% 40%, ${glazeColor}35 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          mixBlendMode: 'multiply'
        }
      case 'Minimal':
        return {
          background: `
            linear-gradient(90deg, transparent 0%, transparent 48%, ${glazeColor}30 48%, ${glazeColor}30 52%, transparent 52%,),
            linear-gradient(0deg, transparent 0%, transparent 48%, transparent 100% ${glazeColor}30 48%, ${glazeColor}30 52%, transparent 52%, transparent 100%)
          `,
          backgroundSize: '40px 40px',
          mixBlendMode: 'multiply'
        }
      default:
        return {}
    }
  }

  // Calculate glossiness based on material and glaze
  const glossiness = (1 - currentGlaze.roughness) * (material === 'Porcelain' ? 1.2 : material === 'Stoneware' ? 0.8 : 0.5)

  return (
    <div 
      className="relative"
      style={{ 
        transform: `scale(${sizeScale})`,
        transformOrigin: 'center bottom'
      }}
    >
      {/* Pot container with 3D effect */}
      <div className="relative">
        {/* Main pot body */}
        <div 
          className={`${shapeStyle.body} relative overflow-hidden`}
          style={{
            width: '160px',
            height: '200px',
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(255,255,255,${glossiness * 0.4}) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(0,0,0,0.2) 0%, transparent 40%),
              linear-gradient(180deg, 
                ${glazeColor} 0%, 
                ${glazeColor}dd 30%, 
                ${glazeColor}aa 60%, 
                ${glazeColor}88 100%
              )
            `,
            boxShadow: `
              ${shapeStyle.shadow},
              inset -25px -25px 50px rgba(0,0,0,0.3),
              inset 15px 15px 30px rgba(255,255,255,${glossiness * 0.15})
            `,
          }}
        >
          {/* Pattern overlay */}
          {pattern !== 'Plain' && (
            <div 
              className="absolute inset-0"
              style={getPatternStyles()}
            />
          )}
          
          {/* Surface texture for realism */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay'
            }}
          />
        </div>

        {/* Rim/lip of the pot */}
        <div 
          className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 ${shapeStyle.rim}`}
          style={{
            width: '80px',
            height: '20px',
            background: `
              radial-gradient(ellipse at 50% 30%, rgba(255,255,255,${glossiness * 0.5}) 0%, transparent 60%),
              linear-gradient(180deg, ${glazeColor}ee 0%, ${glazeColor} 100%)
            `,
            boxShadow: `0 2px 8px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3)`
          }}
        />

        {/* Highlight reflection */}
        <div 
          className="absolute rounded-full"
          style={{
            width: '30px',
            height: '60px',
            top: '25px',
            left: '25px',
            background: `linear-gradient(180deg, 
              rgba(255,255,255,${glossiness * 0.35}) 0%, 
              rgba(255,255,255,${glossiness * 0.15}) 50%,
              transparent 100%
            )`,
            filter: 'blur(3px)',
            transform: 'rotate(-15deg)'
          }}
        />

        {/* Bottom shadow/depth */}
        <div 
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: '100px',
            height: '15px',
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%)',
            filter: 'blur(4px)'
          }}
        />
      </div>

      {/* Size indicator label */}
      <div className="text-center mt-4 text-gray-500 text-xs">
        {sizeDimensions[size].height} × {sizeDimensions[size].diameter}
      </div>
    </div>
  )
}

// Mini pot preview for buttons
const MiniPotPreview = ({ shape, glazeColor, isSelected }: { shape: Shape; glazeColor: string; isSelected: boolean }) => {
  const shapeStyle = shapeStyles[shape]
  
  return (
    <div 
      className="relative w-12 h-14"
    >
      <div 
        className={`${shapeStyle.body} w-full h-full`}
        style={{
          background: `linear-gradient(180deg, ${glazeColor} 0%, ${glazeColor}cc 60%, ${glazeColor}88 100%)`,
          boxShadow: isSelected 
            ? '0 0 0 2px white, 0 0 0 4px #1a1a1a, inset -3px -3px 8px rgba(0,0,0,0.3), inset 2px 2px 5px rgba(255,255,255,0.1)'
            : 'inset -3px -3px 8px rgba(0,0,0,0.3), inset 2px 2px 5px rgba(255,255,255,0.1)',
        }}
      />
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0.5 rounded-full"
        style={{
          width: '20px',
          height: '5px',
          background: `linear-gradient(180deg, ${glazeColor}ee 0%, ${glazeColor} 100%)`,
        }}
      />
    </div>
  )
}

function ProductCustomizer() {
  const navigate = useNavigate()
  const { addItem } = useCart()
  
  const [shape, setShape] = useState<Shape>('Classic')
  const [size, setSize] = useState<Size>('M')
  const [material, setMaterial] = useState<Material>('Terracotta')
  const [glazeColor, setGlazeColor] = useState(glazeColors[0].value)
  const [pattern, setPattern] = useState<Pattern>('Plain')
  const [engraving, setEngraving] = useState('')
  const [showAddedMessage, setShowAddedMessage] = useState(false)

  // Dynamic price calculator
  const price = useMemo(() => {
    const basePrice = 850
    
    // Size add-ons
    const sizeAddOn = size === 'S' ? -100 : size === 'L' ? 150 : size === 'XL' ? 300 : 0
    
    // Material add-on
    const materialAddOn = materials.find(m => m.name === material)?.price || 0
    
    // Pattern add-on
    const patternAddOn = patterns.find(p => p.name === pattern)?.price || 0
    
    // Engraving add-on
    const engravingAddOn = engraving.trim() ? 100 : 0
    
    return basePrice + sizeAddOn + materialAddOn + patternAddOn + engravingAddOn
  }, [size, material, pattern, engraving])

  const handleAddToCart = () => {
    addItem({
      name: `${material} ${shape} Pot`,
      shape,
      size,
      glazeColor: glazeColors.find(c => c.value === glazeColor)?.name || glazeColor,
      engraving,
      price,
      image: glazeColor
    })
    setShowAddedMessage(true)
    setTimeout(() => setShowAddedMessage(false), 2000)
  }

  const handleSubmitCustomOrder = () => {
    alert('Custom design submitted! Check your dashboard for progress.')
    navigate('/buyer-dashboard')
  }

  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-black mb-4">Design Your Perfect Piece</h2>
        <p className="text-lg text-gray-500">Handcrafted with precision and care</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Customization Options */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Shape Selection */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <label className="block text-lg font-semibold text-black mb-4">Select Form</label>
            <div className="grid grid-cols-3 gap-3">
              {(['Classic', 'Tapered', 'Fluted', 'Bottle', 'Bowl', 'Vase'] as Shape[]).map((s, i) => (
                <motion.button
                  key={s}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShape(s)}
                  className={`py-4 px-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    shape === s
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <MiniPotPreview shape={s} glazeColor={glazeColor} isSelected={shape === s} />
                  <span className="text-xs font-medium">{s}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Material Selection */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <label className="block text-lg font-semibold text-black mb-4">Material</label>
            <div className="grid grid-cols-2 gap-3">
              {materials.map((m, i) => (
                <motion.button
                  key={m.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setMaterial(m.name)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    material === m.name
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="font-semibold">{m.name}</div>
                  <div className={`text-xs ${material === m.name ? 'text-gray-300' : 'text-gray-500'}`}>
                    {m.description}
                  </div>
                  <div className={`text-sm font-bold mt-1 ${material === m.name ? 'text-white' : 'text-black'}`}>
                    {m.price === 0 ? 'Included' : m.price > 0 ? `+$${m.price}` : `-$${Math.abs(m.price)}`}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <label className="block text-lg font-semibold text-black mb-4">Dimensions</label>
            <div className="grid grid-cols-4 gap-3">
              {(['S', 'M', 'L', 'XL'] as Size[]).map((s, i) => (
                <motion.button
                  key={s}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSize(s)}
                  className={`py-4 rounded-lg border-2 transition-all ${
                    size === s
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="font-bold">{s}</div>
                  <div className={`text-xs ${size === s ? 'text-gray-400' : 'text-gray-500'}`}>
                    {sizeDimensions[s].height}
                  </div>
                </motion.button>
              ))}
            </div>
            <motion.div 
              key={size}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-sm text-gray-500"
            >
              {sizeDimensions[size].diameter} diameter • {sizeDimensions[size].capacity} capacity
            </motion.div>
          </div>

          {/* Glaze Color Selection */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <label className="block text-lg font-semibold text-black mb-4">Glaze Finish</label>
            <div className="flex flex-wrap gap-3">
              {glazeColors.map((color, i) => (
                <motion.button
                  key={color.value}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * i }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setGlazeColor(color.value)}
                  className={`w-12 h-12 rounded-full border-4 transition-all ${
                    glazeColor === color.value ? 'border-black scale-110' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
            <motion.p 
              key={glazeColor}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-sm text-gray-600 font-medium"
            >
              {glazeColors.find(c => c.value === glazeColor)?.name}
            </motion.p>
          </div>

          {/* Pattern Selection */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <label className="block text-lg font-semibold text-black mb-4">Surface Pattern</label>
            <div className="grid grid-cols-3 gap-3">
              {patterns.map((p, i) => (
                <motion.button
                  key={p.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * i }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPattern(p.name)}
                  className={`py-2 px-3 rounded-lg border-2 text-sm transition-all ${
                    pattern === p.name
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {p.name} {p.price > 0 && `+$${p.price}`}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Custom Engraving */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <label className="block text-lg font-semibold text-black mb-4">
              Personal Engraving <span className="text-gray-400 font-normal">+$100</span>
            </label>
            <input
              type="text"
              value={engraving}
              onChange={(e) => setEngraving(e.target.value)}
              placeholder="Name, mantra, or special message"
              maxLength={25}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-all"
            />
            <p className="mt-2 text-xs text-gray-400">{engraving.length}/25 characters</p>
          </div>
        </motion.div>

        {/* Preview & Summary */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl p-8 shadow-lg sticky top-24"
          >
            <h3 className="text-2xl font-bold text-black mb-6">Your Creation</h3>
            
            {/* Static Product Preview - No entrance animations for realistic look */}
            <div className="relative mb-8 flex justify-center items-end" style={{ minHeight: '280px' }}>
              {/* Product photo background environment */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg" style={{ maxWidth: '320px', margin: '0 auto' }}></div>
              
              <RealisticPot 
                shape={shape} 
                size={size} 
                glazeColor={glazeColor} 
                pattern={pattern}
                material={material}
              />

              {/* Engraving preview */}
              <AnimatePresence>
                {engraving && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/10 px-4 py-2 rounded"
                  >
                    <span className="text-sm font-cursive text-black">{engraving}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-400">Form</div>
                <div className="font-semibold text-black">{shape}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-400">Size</div>
                <div className="font-semibold text-black">{size} ({sizeDimensions[size].height})</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-400">Material</div>
                <div className="font-semibold text-black">{material}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-400">Finish</div>
                <div className="font-semibold text-black">{glazeColors.find(c => c.value === glazeColor)?.name}</div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Base Price</span>
                  <span>$850</span>
                </div>
                {size !== 'M' && (
                  <div className="flex justify-between text-gray-500">
                    <span>Size ({size})</span>
                    <span>{size === 'S' ? '-$100' : size === 'L' ? '+$150' : '+$300'}</span>
                  </div>
                )}
                {material !== 'Terracotta' && (
                  <div className="flex justify-between text-gray-500">
                    <span>{material}</span>
                    <span>{materials.find(m => m.name === material)?.price! > 0 ? `+$${materials.find(m => m.name === material)?.price}` : `-$${Math.abs(materials.find(m => m.name === material)?.price || 0)}`}</span>
                  </div>
                )}
                {pattern !== 'Plain' && (
                  <div className="flex justify-between text-gray-500">
                    <span>{pattern} Pattern</span>
                    <span>+${patterns.find(p => p.name === pattern)?.price}</span>
                  </div>
                )}
                {engraving.trim() && (
                  <div className="flex justify-between text-gray-500">
                    <span>Personal Engraving</span>
                    <span>+$100</span>
                  </div>
                )}
                <motion.div 
                  className="flex justify-between text-xl font-bold pt-2 border-t border-gray-200"
                  key={price}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                >
                  <span>Total</span>
                  <span className="text-black">${price}</span>
                </motion.div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="w-full btn-float-solid"
              >
                Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmitCustomOrder}
                className="w-full btn-float"
              >
                Request Custom Order
              </motion.button>
            </div>

            {/* Added to Cart Message */}
            <AnimatePresence>
              {showAddedMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute inset-x-4 bottom-20 bg-black text-white text-center py-2 rounded-lg"
                >
                  ✓ Added to cart!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProductCustomizer

