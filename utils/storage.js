// Utility functions for AsyncStorage data management
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cookiesData } from '../data/cookiesData';
import { sampleOrders } from '../data/ordersData';

// Storage keys
const STORAGE_KEYS = {
  COOKIES: 'cookies_data',
  ORDERS: 'orders_data',
  BUSINESS_INFO: 'business_info',
  USER_PREFERENCES: 'user_preferences'
};

// Initialize app with sample data if first time
export const initializeApp = async () => {
  try {
    const existingCookies = await AsyncStorage.getItem(STORAGE_KEYS.COOKIES);
    if (!existingCookies) {
      await AsyncStorage.setItem(STORAGE_KEYS.COOKIES, JSON.stringify(cookiesData));
    }
    
    const existingOrders = await AsyncStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!existingOrders) {
      await AsyncStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(sampleOrders));
    }
  } catch (error) {
    console.error('Error initializing app data:', error);
  }
};

// Cookie management functions
export const getCookies = async () => {
  try {
    const cookiesJson = await AsyncStorage.getItem(STORAGE_KEYS.COOKIES);
    return cookiesJson ? JSON.parse(cookiesJson) : cookiesData;
  } catch (error) {
    console.error('Error getting cookies:', error);
    return cookiesData;
  }
};

export const updateCookie = async (updatedCookie) => {
  try {
    const cookies = await getCookies();
    const updatedCookies = cookies.map(cookie => 
      cookie.id === updatedCookie.id ? updatedCookie : cookie
    );
    await AsyncStorage.setItem(STORAGE_KEYS.COOKIES, JSON.stringify(updatedCookies));
    return updatedCookies;
  } catch (error) {
    console.error('Error updating cookie:', error);
    throw error;
  }
};

// Order management functions
export const getOrders = async () => {
  try {
    const ordersJson = await AsyncStorage.getItem(STORAGE_KEYS.ORDERS);
    if (ordersJson) {
      const orders = JSON.parse(ordersJson);
      // Convert date strings back to Date objects
      return orders.map(order => ({
        ...order,
        orderDate: new Date(order.orderDate),
        estimatedReady: new Date(order.estimatedReady),
        completedDate: order.completedDate ? new Date(order.completedDate) : null
      }));
    }
    return sampleOrders;
  } catch (error) {
    console.error('Error getting orders:', error);
    return sampleOrders;
  }
};

export const addOrder = async (newOrder) => {
  try {
    const orders = await getOrders();
    const orderWithId = {
      ...newOrder,
      id: generateOrderId(),
      orderDate: new Date(),
      estimatedReady: calculateEstimatedReady(newOrder.orderType)
    };
    const updatedOrders = [...orders, orderWithId];
    await AsyncStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));
    return orderWithId;
  } catch (error) {
    console.error('Error adding order:', error);
    throw error;
  }
};

export const updateOrder = async (updatedOrder) => {
  try {
    const orders = await getOrders();
    const updatedOrders = orders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    );
    await AsyncStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));
    return updatedOrders;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

// Helper functions
const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD${timestamp}${random}`;
};

const calculateEstimatedReady = (orderType) => {
  const now = new Date();
  const minutes = orderType === 'pickup' ? 15 : 30;
  return new Date(now.getTime() + minutes * 60000);
};

// Clear all data (for testing purposes)
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    console.log('All data cleared');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};