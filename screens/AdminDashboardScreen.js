// Admin Dashboard Screen - Overview of daily orders and sales
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/globalStyles';
import { getOrders, getCookies } from '../utils/storage';
import { orderStatuses } from '../data/ordersData';

const AdminDashboardScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [cookies, setCookies] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    todayOrders: 0,
    todaySales: 0,
    pendingOrders: 0,
    completedToday: 0,
    totalRevenue: 0,
    mostPopularCookie: '',
    lowStockItems: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ordersData, cookiesData] = await Promise.all([
        getOrders(),
        getCookies()
      ]);
      
      setOrders(ordersData);
      setCookies(cookiesData);
      calculateDashboardData(ordersData, cookiesData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const calculateDashboardData = (ordersData, cookiesData) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Filter today's orders
    const todayOrders = ordersData.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= today && orderDate < tomorrow;
    });

    // Calculate metrics
    const todaySales = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = ordersData.filter(order => 
      [orderStatuses.PENDING, orderStatuses.CONFIRMED, orderStatuses.PREPARING, orderStatuses.READY]
      .includes(order.status)
    ).length;
    
    const completedToday = todayOrders.filter(order => 
      order.status === orderStatuses.COMPLETED
    ).length;
    
    const totalRevenue = ordersData
      .filter(order => order.status === orderStatuses.COMPLETED)
      .reduce((sum, order) => sum + order.totalAmount, 0);

    // Find most popular cookie
    const cookiePopularity = {};
    ordersData.forEach(order => {
      order.items.forEach(item => {
        cookiePopularity[item.cookieName] = 
          (cookiePopularity[item.cookieName] || 0) + item.quantity;
      });
    });
    
    const mostPopularCookie = Object.keys(cookiePopularity).reduce((a, b) => 
      cookiePopularity[a] > cookiePopularity[b] ? a : b, ''
    );

    // Count low stock items (less than 10)
    const lowStockItems = cookiesData.filter(cookie => 
      cookie.inStock && cookie.stockCount < 10
    ).length;

    setDashboardData({
      todayOrders: todayOrders.length,
      todaySales,
      pendingOrders,
      completedToday,
      totalRevenue,
      mostPopularCookie,
      lowStockItems
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const StatCard = ({ title, value, subtitle, color = colors.primary, icon = '' }) => (
    <View style={[commonStyles.card, { 
      flex: 1, 
      margin: 8, 
      alignItems: 'center',
      backgroundColor: colors.white
    }]}>
      {icon && <Text style={[commonStyles.emoji, { fontSize: 32, marginBottom: 8 }]}>{icon}</Text>}
      <Text style={[commonStyles.price, { fontSize: 24, color, marginBottom: 4 }]}>
        {typeof value === 'number' && title.toLowerCase().includes('sales') || title.toLowerCase().includes('revenue') 
          ? `$${value.toFixed(2)}` 
          : value}
      </Text>
      <Text style={[commonStyles.text, { fontWeight: '600', textAlign: 'center', marginBottom: 4 }]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[commonStyles.textSecondary, { fontSize: 12, textAlign: 'center' }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      {/* Header */}
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>Admin Dashboard 📊</Text>
      </View>

      <ScrollView 
        style={commonStyles.container}
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Welcome Message */}
        <View style={[commonStyles.card, { 
          marginTop: 20,
          backgroundColor: colors.primary,
          alignItems: 'center'
        }]}>
          <Text style={[commonStyles.title, { color: colors.white, marginBottom: 8 }]}>
            Welcome Back! 👋
          </Text>
          <Text style={[commonStyles.text, { color: colors.white, textAlign: 'center' }]}>
            Here's how your cookie business is doing today
          </Text>
        </View>

        {/* Today's Overview */}
        <View style={[commonStyles.card, { marginBottom: 10 }]}>
          <Text style={[commonStyles.subtitle, { textAlign: 'center', marginBottom: 15 }]}>
            Today's Performance 📈
          </Text>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 }}>
            <StatCard
              title="Orders Today"
              value={dashboardData.todayOrders}
              icon="📝"
              color={colors.info}
            />
            <StatCard
              title="Today's Sales"
              value={dashboardData.todaySales}
              icon="💰"
              color={colors.success}
            />
          </View>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 }}>
            <StatCard
              title="Completed"
              value={dashboardData.completedToday}
              subtitle="orders today"
              icon="✅"
              color={colors.success}
            />
            <StatCard
              title="Pending"
              value={dashboardData.pendingOrders}
              subtitle="orders total"
              icon="⏳"
              color={colors.warning}
            />
          </View>
        </View>

        {/* Business Overview */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { marginBottom: 15 }]}>
            Business Overview 🏪
          </Text>
          
          <View style={{ marginBottom: 15 }}>
            <View style={commonStyles.flexRowBetween}>
              <Text style={commonStyles.text}>Total Revenue:</Text>
              <Text style={[commonStyles.price, { fontSize: 18 }]}>
                ${dashboardData.totalRevenue.toFixed(2)}
              </Text>
            </View>
          </View>
          
          <View style={{ marginBottom: 15 }}>
            <View style={commonStyles.flexRowBetween}>
              <Text style={commonStyles.text}>Most Popular Cookie:</Text>
              <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                🍪 {dashboardData.mostPopularCookie || 'N/A'}
              </Text>
            </View>
          </View>
          
          <View>
            <View style={commonStyles.flexRowBetween}>
              <Text style={commonStyles.text}>Low Stock Alert:</Text>
              <Text style={[
                commonStyles.text, 
                { 
                  fontWeight: '600',
                  color: dashboardData.lowStockItems > 0 ? colors.error : colors.success
                }
              ]}>
                {dashboardData.lowStockItems > 0 
                  ? `⚠️ ${dashboardData.lowStockItems} items`
                  : '✅ All good'
                }
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { marginBottom: 15 }]}>
            Quick Actions ⚡
          </Text>
          
          <TouchableOpacity
            style={[commonStyles.button, { marginBottom: 12 }]}
            onPress={() => navigation.navigate('AdminOrders')}
          >
            <Text style={commonStyles.buttonText}>
              📋 Manage Orders
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[commonStyles.button, { marginBottom: 12 }]}
            onPress={() => navigation.navigate('Inventory')}
          >
            <Text style={commonStyles.buttonText}>
              📦 Manage Inventory
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={commonStyles.buttonSecondary}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={commonStyles.buttonSecondaryText}>
              ⚙️ Business Settings
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { marginBottom: 15 }]}>
            Recent Activity 🔔
          </Text>
          
          {orders.slice(0, 5).map((order, index) => (
            <TouchableOpacity
              key={order.id}
              style={{
                paddingVertical: 8,
                borderBottomWidth: index < 4 ? 1 : 0,
                borderBottomColor: colors.border
              }}
              onPress={() => navigation.navigate('AdminOrderDetails', { order })}
            >
              <View style={commonStyles.flexRowBetween}>
                <Text style={[commonStyles.text, { flex: 1 }]}>
                  Order #{order.id} - {order.customerName}
                </Text>
                <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                  {order.orderDate.toLocaleDateString()}
                </Text>
              </View>
              <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                {order.status.toUpperCase()} • ${order.totalAmount.toFixed(2)}
              </Text>
            </TouchableOpacity>
          ))}
          
          {orders.length === 0 && (
            <Text style={[commonStyles.textSecondary, { textAlign: 'center', fontStyle: 'italic' }]}>
              No orders yet
            </Text>
          )}
        </View>

        {/* Help Section */}
        <View style={[commonStyles.card, { backgroundColor: colors.accent }]}>
          <Text style={[commonStyles.text, { textAlign: 'center', marginBottom: 10 }]}>
            💡 Pro Tip
          </Text>
          <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
            Keep an eye on your pending orders and low stock items to ensure smooth operations!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminDashboardScreen;