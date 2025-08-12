// Inventory Screen - Manage cookie stock levels
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  RefreshControl,
  TextInput,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/globalStyles';
import { getCookies, updateCookie } from '../utils/storage';
import CookieCard from '../components/CookieCard';

const InventoryScreen = ({ navigation }) => {
  const [cookies, setCookies] = useState([]);
  const [filteredCookies, setFilteredCookies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCookie, setSelectedCookie] = useState(null);
  const [editForm, setEditForm] = useState({
    stockCount: '',
    price: '',
    inStock: true
  });

  const categories = ['All', 'Classic', 'Premium', 'Healthy'];

  useEffect(() => {
    loadCookies();
  }, []);

  useEffect(() => {
    filterCookies();
  }, [cookies, selectedCategory, searchQuery]);

  const loadCookies = async () => {
    try {
      const cookiesData = await getCookies();
      // Sort by stock level (low stock first) then by name
      const sortedCookies = cookiesData.sort((a, b) => {
        if (a.inStock !== b.inStock) {
          return b.inStock - a.inStock; // In stock items first
        }
        if (a.stockCount !== b.stockCount) {
          return a.stockCount - b.stockCount; // Low stock first
        }
        return a.name.localeCompare(b.name);
      });
      setCookies(sortedCookies);
    } catch (error) {
      console.error('Error loading cookies:', error);
      Alert.alert('Error', 'Failed to load inventory');
    }
  };

  const filterCookies = () => {
    let filtered = cookies;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(cookie => cookie.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(cookie =>
        cookie.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cookie.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCookies(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCookies();
    setRefreshing(false);
  };

  const handleEditCookie = (cookie) => {
    setSelectedCookie(cookie);
    setEditForm({
      stockCount: cookie.stockCount.toString(),
      price: cookie.price.toString(),
      inStock: cookie.inStock
    });
    setEditModalVisible(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedCookie) return;

    const stockCount = parseInt(editForm.stockCount);
    const price = parseFloat(editForm.price);

    if (isNaN(stockCount) || stockCount < 0) {
      Alert.alert('Invalid Input', 'Please enter a valid stock count (0 or higher)');
      return;
    }

    if (isNaN(price) || price <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid price (greater than 0)');
      return;
    }

    try {
      const updatedCookie = {
        ...selectedCookie,
        stockCount,
        price,
        inStock: editForm.inStock && stockCount > 0
      };

      await updateCookie(updatedCookie);
      await loadCookies();
      setEditModalVisible(false);
      
      Alert.alert('Success', 'Cookie inventory updated successfully!');
    } catch (error) {
      console.error('Error updating cookie:', error);
      Alert.alert('Error', 'Failed to update inventory');
    }
  };

  const handleQuickStock = (cookie, amount) => {
    const newStockCount = Math.max(0, cookie.stockCount + amount);
    
    Alert.alert(
      'Update Stock',
      `Update ${cookie.name} stock from ${cookie.stockCount} to ${newStockCount}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: async () => {
            try {
              const updatedCookie = {
                ...cookie,
                stockCount: newStockCount,
                inStock: newStockCount > 0
              };
              await updateCookie(updatedCookie);
              await loadCookies();
            } catch (error) {
              console.error('Error updating stock:', error);
              Alert.alert('Error', 'Failed to update stock');
            }
          }
        }
      ]
    );
  };

  const getLowStockCount = () => {
    return cookies.filter(cookie => cookie.inStock && cookie.stockCount < 10).length;
  };

  const getOutOfStockCount = () => {
    return cookies.filter(cookie => !cookie.inStock || cookie.stockCount === 0).length;
  };

  const renderCookieItem = ({ item }) => (
    <View style={[commonStyles.card, { marginHorizontal: 16, marginVertical: 8 }]}>
      <View style={commonStyles.flexRowBetween}>
        <View style={{ flex: 1 }}>
          <View style={commonStyles.flexRow}>
            <Text style={[commonStyles.emoji, { marginRight: 12, fontSize: 32 }]}>
              {item.image}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={[commonStyles.subtitle, { marginBottom: 4 }]}>
                {item.name}
              </Text>
              <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
                {item.description}
              </Text>
              
              <View style={commonStyles.flexRow}>
                <View style={[
                  commonStyles.badge,
                  { 
                    backgroundColor: item.inStock && item.stockCount > 0 
                      ? (item.stockCount < 10 ? colors.warning : colors.success)
                      : colors.error,
                    marginRight: 8 
                  }
                ]}>
                  <Text style={commonStyles.badgeText}>
                    {item.inStock && item.stockCount > 0 
                      ? `${item.stockCount} left` 
                      : 'Out of Stock'}
                  </Text>
                </View>
                <View style={[commonStyles.badge, { backgroundColor: colors.info }]}>
                  <Text style={commonStyles.badgeText}>
                    {item.category}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[commonStyles.price, { marginBottom: 8 }]}>
            ${item.price.toFixed(2)}
          </Text>
          
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity 
              style={[commonStyles.buttonSecondary, { 
                marginRight: 8, 
                paddingVertical: 6, 
                paddingHorizontal: 10,
                minWidth: 35
              }]}
              onPress={() => handleQuickStock(item, -10)}
            >
              <Text style={[commonStyles.buttonSecondaryText, { fontSize: 12 }]}>
                -10
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[commonStyles.button, { 
                marginRight: 8, 
                paddingVertical: 6, 
                paddingHorizontal: 10,
                minWidth: 35
              }]}
              onPress={() => handleQuickStock(item, 10)}
            >
              <Text style={[commonStyles.buttonText, { fontSize: 12 }]}>
                +10
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[commonStyles.button, { 
                paddingVertical: 6, 
                paddingHorizontal: 8
              }]}
              onPress={() => handleEditCookie(item)}
            >
              <Text style={[commonStyles.buttonText, { fontSize: 12 }]}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderCategoryFilter = (category) => (
    <TouchableOpacity
      key={category}
      style={[
        commonStyles.button,
        {
          marginRight: 12,
          paddingVertical: 8,
          paddingHorizontal: 16,
          backgroundColor: selectedCategory === category ? colors.primary : colors.white,
          borderWidth: 1,
          borderColor: colors.primary,
        }
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        commonStyles.buttonText,
        {
          fontSize: 14,
          color: selectedCategory === category ? colors.white : colors.primary
        }
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      {/* Header */}
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>Inventory Management 📦</Text>
      </View>

      {/* Inventory Overview */}
      <View style={[commonStyles.card, { margin: 20, marginBottom: 10 }]}>
        <Text style={[commonStyles.subtitle, { textAlign: 'center', marginBottom: 15 }]}>
          Inventory Overview
        </Text>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={[commonStyles.price, { fontSize: 24, color: colors.info }]}>
              {cookies.length}
            </Text>
            <Text style={commonStyles.textSecondary}>Total Items</Text>
          </View>
          
          <View style={{ alignItems: 'center' }}>
            <Text style={[commonStyles.price, { fontSize: 24, color: colors.warning }]}>
              {getLowStockCount()}
            </Text>
            <Text style={commonStyles.textSecondary}>Low Stock</Text>
          </View>
          
          <View style={{ alignItems: 'center' }}>
            <Text style={[commonStyles.price, { fontSize: 24, color: colors.error }]}>
              {getOutOfStockCount()}
            </Text>
            <Text style={commonStyles.textSecondary}>Out of Stock</Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 20, marginBottom: 15 }}>
        <TextInput
          style={commonStyles.input}
          placeholder="Search cookies..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {/* Category Filter */}
      <View style={{ paddingHorizontal: 20, marginBottom: 15 }}>
        <FlatList
          data={categories}
          renderItem={({ item }) => renderCategoryFilter(item)}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Inventory List */}
      <View style={{ flex: 1 }}>
        {filteredCookies.length > 0 ? (
          <FlatList
            data={filteredCookies}
            renderItem={renderCookieItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
          />
        ) : (
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            paddingHorizontal: 40
          }}>
            <Text style={[commonStyles.emoji, { fontSize: 48, marginBottom: 20 }]}>
              📦
            </Text>
            <Text style={[commonStyles.text, { textAlign: 'center', marginBottom: 10 }]}>
              No cookies found
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
              Try adjusting your search or category filter
            </Text>
          </View>
        )}
      </View>

      {/* Edit Cookie Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={commonStyles.safeArea}>
          <View style={commonStyles.header}>
            <Text style={commonStyles.headerTitle}>
              Edit {selectedCookie?.name}
            </Text>
          </View>
          
          <View style={{ flex: 1, padding: 20 }}>
            <View style={commonStyles.card}>
              <Text style={[commonStyles.label, { marginBottom: 8 }]}>Stock Count</Text>
              <TextInput
                style={commonStyles.input}
                value={editForm.stockCount}
                onChangeText={(text) => setEditForm({...editForm, stockCount: text})}
                keyboardType="numeric"
                placeholder="Enter stock count"
                placeholderTextColor={colors.textSecondary}
              />
              
              <Text style={[commonStyles.label, { marginBottom: 8 }]}>Price ($)</Text>
              <TextInput
                style={commonStyles.input}
                value={editForm.price}
                onChangeText={(text) => setEditForm({...editForm, price: text})}
                keyboardType="decimal-pad"
                placeholder="Enter price"
                placeholderTextColor={colors.textSecondary}
              />
              
              <View style={{ marginTop: 15 }}>
                <Text style={[commonStyles.label, { marginBottom: 10 }]}>Availability</Text>
                <TouchableOpacity
                  style={[
                    commonStyles.button,
                    { 
                      backgroundColor: editForm.inStock ? colors.success : colors.error 
                    }
                  ]}
                  onPress={() => setEditForm({...editForm, inStock: !editForm.inStock})}
                >
                  <Text style={commonStyles.buttonText}>
                    {editForm.inStock ? '✅ Available' : '❌ Out of Stock'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={{ marginTop: 20 }}>
              <TouchableOpacity
                style={[commonStyles.button, { marginBottom: 15 }]}
                onPress={handleSaveChanges}
              >
                <Text style={commonStyles.buttonText}>
                  💾 Save Changes
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={commonStyles.buttonSecondary}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={commonStyles.buttonSecondaryText}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default InventoryScreen;