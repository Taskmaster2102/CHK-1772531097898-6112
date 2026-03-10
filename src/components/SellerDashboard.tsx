import { useState } from 'react'

type Shape = 'Classic' | 'Tapered' | 'Fluted'
type Size = 'S' | 'M' | 'L'
type ProductionStatus = 'Shaping' | 'Firing' | 'Glazing' | 'Ready'

interface CustomOrder {
  id: number
  customerName: string
  shape: Shape
  size: Size
  glazeColor: string
  engraving: string
  price: number
  orderDate: string
  status: ProductionStatus
  notes: string
}

const shapeImages: Record<Shape, string> = {
  Classic: '🏺',
  Tapered: '🫙',
  Fluted: '🫖'
}

const glazeColorNames: Record<string, string> = {
  '#E2725B': 'Terracotta',
  '#87A878': 'Sage Green',
  '#4A7C94': 'Ocean Blue',
  '#D4A574': 'Warm Sand',
  '#2F4F4F': 'Slate Gray',
  '#F4EFE6': 'Cream White'
}

function SellerDashboard() {
  const [orders, setOrders] = useState<CustomOrder[]>([
    {
      id: 1,
      customerName: 'John Smith',
      shape: 'Classic',
      size: 'L',
      glazeColor: '#87A878',
      engraving: 'Om',
      price: 1050,
      orderDate: '2024-01-15',
      status: 'Firing',
      notes: 'Gift for anniversary'
    },
    {
      id: 2,
      customerName: 'Sarah Johnson',
      shape: 'Fluted',
      size: 'M',
      glazeColor: '#4A7C94',
      engraving: 'Shanti',
      price: 950,
      orderDate: '2024-01-10',
      status: 'Glazing',
      notes: 'Handle with care'
    },
    {
      id: 3,
      customerName: 'Mike Davis',
      shape: 'Tapered',
      size: 'S',
      glazeColor: '#E2725B',
      engraving: 'Namaste',
      price: 900,
      orderDate: '2024-01-18',
      status: 'Shaping',
      notes: 'First custom order'
    },
    {
      id: 4,
      customerName: 'Emily Chen',
      shape: 'Classic',
      size: 'M',
      glazeColor: '#D4A574',
      engraving: 'Peace',
      price: 950,
      orderDate: '2024-01-12',
      status: 'Ready',
      notes: 'Rush order'
    }
  ])

  const [selectedOrder, setSelectedOrder] = useState<CustomOrder | null>(null)

  const updateStatus = (orderId: number, newStatus: ProductionStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  const getStatusBadge = (status: ProductionStatus) => {
    const badges: Record<ProductionStatus, { bg: string; text: string }> = {
      'Shaping': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'Firing': { bg: 'bg-orange-100', text: 'text-orange-800' },
      'Glazing': { bg: 'bg-purple-100', text: 'text-purple-800' },
      'Ready': { bg: 'bg-green-100', text: 'text-green-800' }
    }
    return badges[status]
  }

  const getProgressValue = (status: ProductionStatus) => {
    const values: Record<ProductionStatus, number> = {
      'Shaping': 25,
      'Firing': 50,
      'Glazing': 75,
      'Ready': 100
    }
    return values[status]
  }

  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif text-[#2F4F4F] mb-4">Production Pipeline</h2>
        <p className="text-lg text-[#2F4F4F]/70">Manage incoming custom design orders</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {(['Shaping', 'Firing', 'Glazing', 'Ready'] as ProductionStatus[]).map((status) => {
          const count = orders.filter(o => o.status === status).length
          const badge = getStatusBadge(status)
          return (
            <div key={status} className="bg-white rounded-lg shadow p-4 text-center">
              <div className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
                {status}
              </div>
              <p className="text-3xl font-bold text-[#2F4F4F] mt-2">{count}</p>
            </div>
          )
        })}
      </div>

      {/* Production Pipeline Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#2F4F4F] text-white">
              <tr>
                <th className="px-6 py-4 text-left">Order</th>
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Design Details</th>
                <th className="px-6 py-4 text-left">Specifications</th>
                <th className="px-6 py-4 text-left">Progress</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => {
                const badge = getStatusBadge(order.status)
                return (
                  <tr 
                    key={order.id} 
                    className={`hover:bg-[#F4EFE6] transition-colors ${selectedOrder?.id === order.id ? 'bg-[#F4EFE6]' : ''}`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{shapeImages[order.shape]}</span>
                        <div>
                          <p className="font-medium text-[#2F4F4F]">#{order.id}</p>
                          <p className="text-sm text-[#2F4F4F]/60">{order.orderDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#2F4F4F]">{order.customerName}</p>
                      <p className="text-sm text-[#2F4F4F]/60">${order.price}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[#2F4F4F]">{order.shape} {order.size}</p>
                      {order.engraving && (
                        <p className="text-sm text-[#2F4F4F]/60">Engraving: "{order.engraving}"</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border border-[#2F4F4F]"
                          style={{ backgroundColor: order.glazeColor }}
                        />
                        <span className="text-sm">{glazeColorNames[order.glazeColor] || order.glazeColor}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 w-48">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#E2725B] transition-all"
                            style={{ width: `${getProgressValue(order.status)}%` }}
                          />
                        </div>
                        <span className="text-xs text-[#2F4F4F]/60">{getProgressValue(order.status)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => {
                          e.stopPropagation()
                          updateStatus(order.id, e.target.value as ProductionStatus)
                        }}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:border-[#E2725B] focus:outline-none"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="Shaping">Shaping</option>
                        <option value="Firing">Firing</option>
                        <option value="Glazing">Glazing</option>
                        <option value="Ready">Ready</option>
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Order Details */}
      {selectedOrder && (
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-[#2F4F4F] mb-4">
            Order #{selectedOrder.id} Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-[#2F4F4F]/60">Customer</p>
              <p className="font-medium">{selectedOrder.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-[#2F4F4F]/60">Design</p>
              <p className="font-medium">{selectedOrder.shape} {selectedOrder.size}</p>
            </div>
            <div>
              <p className="text-sm text-[#2F4F4F]/60">Glaze</p>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border border-[#2F4F4F]"
                  style={{ backgroundColor: selectedOrder.glazeColor }}
                />
                <span className="font-medium">{glazeColorNames[selectedOrder.glazeColor] || selectedOrder.glazeColor}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-[#2F4F4F]/60">Price</p>
              <p className="font-medium text-[#E2725B]">${selectedOrder.price}</p>
            </div>
            {selectedOrder.engraving && (
              <div className="col-span-2">
                <p className="text-sm text-[#2F4F4F]/60">Engraving</p>
                <p className="font-medium">"{selectedOrder.engraving}"</p>
              </div>
            )}
            {selectedOrder.notes && (
              <div className="col-span-2">
                <p className="text-sm text-[#2F4F4F]/60">Notes</p>
                <p className="font-medium">{selectedOrder.notes}</p>
              </div>
            )}
          </div>
          
          {/* Production Progress */}
          <div className="mt-6 pt-6 border-t">
            <h4 className="text-lg font-medium text-[#2F4F4F] mb-4">Production Progress</h4>
            <div className="flex items-center gap-4">
              {(['Shaping', 'Firing', 'Glazing', 'Ready'] as ProductionStatus[]).map((stage, index) => {
                const isCompleted = getProgressValue(selectedOrder.status) >= getProgressValue(stage)
                const isCurrent = selectedOrder.status === stage
                return (
                  <div key={stage} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-colors ${
                          isCompleted 
                            ? 'bg-[#E2725B] text-white' 
                            : 'bg-gray-200 text-gray-500'
                        } ${isCurrent ? 'ring-4 ring-[#E2725B]/30' : ''}`}
                      >
                        {index + 1}
                      </div>
                      <span className={`mt-2 text-sm ${isCompleted ? 'text-[#2F4F4F] font-medium' : 'text-gray-400'}`}>
                        {stage}
                      </span>
                    </div>
                    {index < 3 && (
                      <div className={`w-16 h-1 mx-2 ${isCompleted ? 'bg-[#E2725B]' : 'bg-gray-200'}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SellerDashboard

