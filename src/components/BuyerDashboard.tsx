import { useState } from 'react'

type Shape = 'Classic' | 'Tapered' | 'Fluted'
type Size = 'S' | 'M' | 'L'
type Status = 'In Production' | 'Shipped'

interface CustomDesign {
  id: number
  shape: Shape
  size: Size
  glazeColor: string
  engraving: string
  price: number
  status: Status
  orderDate: string
  trackingSteps: {
    confirmed: boolean
    shaping: boolean
    firing: boolean
    glazing: boolean
    shipped: boolean
  }
}

const shapeImages: Record<Shape, string> = {
  Classic: '🏺',
  Tapered: '🫙',
  Fluted: '🫖'
}

function BuyerDashboard() {
  const [orders] = useState<CustomDesign[]>([
    {
      id: 1,
      shape: 'Classic',
      size: 'L',
      glazeColor: '#87A878',
      engraving: 'Om',
      price: 1050,
      status: 'In Production',
      orderDate: '2024-01-15',
      trackingSteps: {
        confirmed: true,
        shaping: true,
        firing: true,
        glazing: false,
        shipped: false
      }
    },
    {
      id: 2,
      shape: 'Fluted',
      size: 'M',
      glazeColor: '#4A7C94',
      engraving: 'Shanti',
      price: 950,
      status: 'Shipped',
      orderDate: '2024-01-10',
      trackingSteps: {
        confirmed: true,
        shaping: true,
        firing: true,
        glazing: true,
        shipped: true
      }
    },
    {
      id: 3,
      shape: 'Tapered',
      size: 'S',
      glazeColor: '#E2725B',
      engraving: 'Namaste',
      price: 900,
      status: 'In Production',
      orderDate: '2024-01-18',
      trackingSteps: {
        confirmed: true,
        shaping: false,
        firing: false,
        glazing: false,
        shipped: false
      }
    }
  ])

  const [selectedOrder, setSelectedOrder] = useState<CustomDesign | null>(orders[0])

  const getStatusColor = (status: Status) => {
    return status === 'In Production' 
      ? 'bg-yellow-100 text-yellow-800' 
      : 'bg-green-100 text-green-800'
  }

  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif text-[#2F4F4F] mb-4">My Custom Designs</h2>
        <p className="text-lg text-[#2F4F4F]/70">Track and manage your artisan pottery orders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#2F4F4F] mb-4">Orders ({orders.length})</h3>
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedOrder?.id === order.id
                      ? 'bg-[#E2725B]/10 border-2 border-[#E2725B]'
                      : 'bg-[#F4EFE6] hover:bg-[#E2725B]/5'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{shapeImages[order.shape]}</span>
                      <div>
                        <p className="font-medium text-[#2F4F4F]">
                          {order.shape} {order.size}
                        </p>
                        <p className="text-xs text-[#2F4F4F]/60">{order.orderDate}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  {order.engraving && (
                    <p className="text-sm text-[#2F4F4F]/70">
                      Engraving: "{order.engraving}"
                    </p>
                  )}
                  <p className="text-right font-bold text-[#E2725B] mt-2">${order.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Details & Tracking */}
        <div className="lg:col-span-2">
          {selectedOrder ? (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-[#2F4F4F]">
                    {selectedOrder.shape} {selectedOrder.size} Clay Pot
                  </h3>
                  <p className="text-[#2F4F4F]/70">Order #{selectedOrder.id} • {selectedOrder.orderDate}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-[#F4EFE6] rounded-lg p-4">
                  <p className="text-sm text-[#2F4F4F]/60 mb-1">Glaze Color</p>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-[#2F4F4F]"
                      style={{ backgroundColor: selectedOrder.glazeColor }}
                    />
                    <span className="font-medium">{selectedOrder.glazeColor}</span>
                  </div>
                </div>
                <div className="bg-[#F4EFE6] rounded-lg p-4">
                  <p className="text-sm text-[#2F4F4F]/60 mb-1">Engraving</p>
                  <span className="font-medium">{selectedOrder.engraving || 'None'}</span>
                </div>
                <div className="bg-[#F4EFE6] rounded-lg p-4">
                  <p className="text-sm text-[#2F4F4F]/60 mb-1">Total Price</p>
                  <span className="text-2xl font-bold text-[#E2725B]">${selectedOrder.price}</span>
                </div>
                <div className="bg-[#F4EFE6] rounded-lg p-4">
                  <p className="text-sm text-[#2F4F4F]/60 mb-1">Estimated Delivery</p>
                  <span className="font-medium">
                    {selectedOrder.status === 'Shipped' ? 'Delivered' : '2-3 weeks'}
                  </span>
                </div>
              </div>

              {/* Order Tracking Stepper */}
              <div className="border-t pt-8">
                <h4 className="text-xl font-semibold text-[#2F4F4F] mb-6">Order Tracking</h4>
                
                <div className="flex items-center justify-between relative">
                  {/* Progress Line */}
                  <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                    <div
                      className="h-full bg-[#E2725B] transition-all duration-500"
                      style={{
                        width: selectedOrder.trackingSteps.shaping
                          ? selectedOrder.trackingSteps.glazing
                            ? '100%'
                            : '60%'
                          : '20%'
                      }}
                    />
                  </div>

                  {/* Steps */}
                  {[
                    { key: 'confirmed', label: 'Confirmed', icon: '✓' },
                    { key: 'shaping', label: 'Shaping', icon: '🏺' },
                    { key: 'firing', label: 'Firing', icon: '🔥' },
                    { key: 'glazing', label: 'Glazing', icon: '🎨' },
                    { key: 'shipped', label: 'Shipped', icon: '📦' }
                  ].map((step, index) => {
                    const isCompleted = Object.values(selectedOrder.trackingSteps)[index]
                    return (
                      <div key={step.key} className="flex flex-col items-center relative z-10">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                            isCompleted
                              ? 'bg-[#E2725B] text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {step.icon}
                        </div>
                        <span className={`mt-2 text-xs ${isCompleted ? 'text-[#2F4F4F] font-medium' : 'text-gray-400'}`}>
                          {step.label}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Current Status Message */}
                <div className="mt-8 bg-[#E2725B]/10 rounded-lg p-4 text-center">
                  <p className="text-[#2F4F4F]">
                    {selectedOrder.trackingSteps.shipped
                      ? 'Your order has been shipped! Track it with the tracking number in your email.'
                      : selectedOrder.trackingSteps.glazing
                      ? 'Your pot is being glazed with precision!'
                      : selectedOrder.trackingSteps.firing
                      ? 'Your piece is being fired in the kiln at 1200°C'
                      : selectedOrder.trackingSteps.shaping
                      ? 'Our artisans are shaping your custom pot'
                      : 'Order confirmed! We\'ll start crafting soon.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <p className="text-[#2F4F4F]/60">Select an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BuyerDashboard

