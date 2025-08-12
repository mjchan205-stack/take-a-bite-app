// Sample orders data and order status constants
export const orderStatuses = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Sample orders for demo purposes
export const sampleOrders = [
  {
    id: 'ORD001',
    customerName: 'John Smith',
    customerPhone: '(555) 123-4567',
    customerEmail: 'john@example.com',
    items: [
      { cookieId: 1, cookieName: 'Chocolate Chip Classic', quantity: 12, price: 2.50 },
      { cookieId: 3, cookieName: 'Sugar Cookie Delight', quantity: 6, price: 2.25 }
    ],
    totalAmount: 43.50,
    orderType: 'pickup',
    status: orderStatuses.PREPARING,
    specialInstructions: 'Please pack separately',
    orderDate: new Date('2024-01-15T10:30:00'),
    estimatedReady: new Date('2024-01-15T11:00:00'),
    completedDate: null
  },
  {
    id: 'ORD002',
    customerName: 'Sarah Johnson',
    customerPhone: '(555) 987-6543',
    customerEmail: 'sarah@example.com',
    items: [
      { cookieId: 2, cookieName: 'Double Chocolate Fudge', quantity: 24, price: 3.00 }
    ],
    totalAmount: 72.00,
    orderType: 'delivery',
    deliveryAddress: '456 Main Street, Sweet City, SC 12345',
    status: orderStatuses.READY,
    specialInstructions: 'Ring doorbell twice',
    orderDate: new Date('2024-01-15T09:15:00'),
    estimatedReady: new Date('2024-01-15T10:15:00'),
    completedDate: null
  },
  {
    id: 'ORD003',
    customerName: 'Mike Davis',
    customerPhone: '(555) 456-7890',
    customerEmail: 'mike@example.com',
    items: [
      { cookieId: 4, cookieName: 'Oatmeal Raisin', quantity: 6, price: 2.75 },
      { cookieId: 5, cookieName: 'Peanut Butter Crunch', quantity: 12, price: 2.75 },
      { cookieId: 8, cookieName: 'Red Velvet Cream', quantity: 6, price: 3.50 }
    ],
    totalAmount: 70.50,
    orderType: 'pickup',
    status: orderStatuses.COMPLETED,
    specialInstructions: '',
    orderDate: new Date('2024-01-14T14:20:00'),
    estimatedReady: new Date('2024-01-14T14:50:00'),
    completedDate: new Date('2024-01-14T14:45:00')
  }
];