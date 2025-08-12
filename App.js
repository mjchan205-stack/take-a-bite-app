// Main App Component - Take a Bite Cookie Business Mobile App
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Platform, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from './styles/globalStyles';
import { initializeApp } from './utils/storage';

// Import Customer Screens
import WelcomeScreen from './screens/WelcomeScreen';
import MenuScreen from './screens/MenuScreen';
import OrderFormScreen from './screens/OrderFormScreen';
import OrderConfirmationScreen from './screens/OrderConfirmationScreen';
import OrderTrackingScreen from './screens/OrderTrackingScreen';
import OrderDetailsScreen from './screens/OrderDetailsScreen';

// Import Admin Screens
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import AdminOrdersScreen from './screens/AdminOrdersScreen';
import InventoryScreen from './screens/InventoryScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Customer Tab Navigator
function CustomerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          paddingTop: 5,
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          height: Platform.OS === 'ios' ? 85 : 60,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen 
        name="Welcome" 
        component={WelcomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>
              {focused ? '🏠' : '🏠'}
            </Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Menu" 
        component={MenuScreen}
        options={{
          tabBarLabel: 'Menu',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>
              {focused ? '🍪' : '🍪'}
            </Text>
          ),
        }}
      />
      <Tab.Screen 
        name="OrderTracking" 
        component={OrderTrackingScreen}
        options={{
          tabBarLabel: 'Track Order',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>
              {focused ? '📱' : '📱'}
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Admin Tab Navigator
function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          paddingTop: 5,
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          height: Platform.OS === 'ios' ? 85 : 60,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen 
        name="AdminDashboard" 
        component={AdminDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>
              {focused ? '📊' : '📊'}
            </Text>
          ),
        }}
      />
      <Tab.Screen 
        name="AdminOrders" 
        component={AdminOrdersScreen}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>
              {focused ? '📋' : '📋'}
            </Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Inventory" 
        component={InventoryScreen}
        options={{
          tabBarLabel: 'Inventory',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>
              {focused ? '📦' : '📦'}
            </Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>
              {focused ? '⚙️' : '⚙️'}
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main Stack Navigator
function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      {/* Customer Flow */}
      <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
      <Stack.Screen name="OrderForm" component={OrderFormScreen} />
      <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      
      {/* Admin Flow */}
      <Stack.Screen name="AdminTabs" component={AdminTabs} />
      <Stack.Screen name="AdminOrderDetails" component={OrderDetailsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    // Initialize app data when app loads
    initializeApp();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" backgroundColor={colors.primary} />
        <MainStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
