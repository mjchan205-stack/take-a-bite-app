// Cookie Menu Screen - Display available cookies with prices and images
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/globalStyles';
import { getCookies } from '../utils/storage';
import CookieCard from '../components/CookieCard';

const MenuScreen = ({ navigation }) => {
  const [cookies, setCookies] = useState([]);
  const [filteredCookies, setFilteredCookies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);

  // Categories for filtering
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
      setCookies(cookiesData);
    } catch (error) {
      console.error('Error loading cookies:', error);
      Alert.alert('Error', 'Failed to load menu items');
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

  const handleAddToCart = (cookie) => {
    Alert.alert(
      'Add to Cart',
      `Add ${cookie.name} to your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: () => {
            // Navigate to order form with selected cookie
            navigation.navigate('OrderForm', { selectedCookie: cookie });
          }
        }
      ]
    );
  };

  const renderCookieCard = ({ item }) => (
    <CookieCard
      cookie={item}
      onPress={handleAddToCart}
      showAddButton={true}
    />
  );

  const renderCategoryButton = (category) => (
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
        <Text style={commonStyles.headerTitle}>Cookie Menu 🍪</Text>
      </View>

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
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
        <Text style={[commonStyles.label, { marginBottom: 10 }]}>
          Categories:
        </Text>
        <FlatList
          data={categories}
          renderItem={({ item }) => renderCategoryButton(item)}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Menu Items */}
      <View style={{ flex: 1 }}>
        {filteredCookies.length > 0 ? (
          <>
            <Text style={[commonStyles.textSecondary, { 
              paddingHorizontal: 20, 
              marginBottom: 10,
              textAlign: 'center'
            }]}>
              {filteredCookies.length} cookie{filteredCookies.length !== 1 ? 's' : ''} available
            </Text>
            
            <FlatList
              data={filteredCookies}
              renderItem={renderCookieCard}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </>
        ) : (
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            paddingHorizontal: 40
          }}>
            <Text style={[commonStyles.emoji, { fontSize: 48, marginBottom: 20 }]}>
              🔍
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

      {/* Bottom Action Button */}
      <View style={{ 
        paddingHorizontal: 20, 
        paddingVertical: 15,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.border
      }}>
        <TouchableOpacity
          style={commonStyles.button}
          onPress={() => navigation.navigate('OrderForm')}
        >
          <Text style={commonStyles.buttonText}>
            Start Custom Order 🛒
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MenuScreen;