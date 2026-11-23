import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import LoginScreen from './screens/LoginScreen';

const MENU_ITEMS = [
  { key: 'sale_invoice', title: 'Sale Invoice', icon: '📄' },
  { key: 'purchase_invoice', title: 'Purchase Invoice', icon: '🛒' },
  { key: 'quotation', title: 'Quotation', icon: '📋' },
  { key: 'delivery_challan', title: 'Delivery Challan', icon: '🚚' },
  { key: 'proforma', title: 'Proforma', icon: '📝' },
  { key: 'purchase_order', title: 'Purchase Order', icon: '🛍️' },
  { key: 'sale_order', title: 'Sale Order', icon: '📦' },
  { key: 'job_work', title: 'Job Work', icon: '💼' },
  { key: 'credit_note', title: 'Credit Note', icon: '📑' },
  { key: 'debit_note', title: 'Debit Note', icon: '🧾' },
  { key: 'service_request', title: 'Service Request', icon: '🔧' },
  { key: 'inward_payment', title: 'Inward Payment', icon: '📥' },
  { key: 'outward_payment', title: 'Outward Payment', icon: '📤' },
  { key: 'combo', title: 'Combo', icon: '🎁' },
  { key: 'ecommerce_order_book', title: 'E-commerce Order Book', icon: '🛒' },
];

export default function App() {
  const [loginData, setLoginData] = useState(null);

  if (!loginData) {
    return (
      <LoginScreen
        onLoginSuccess={(data) => {
          setLoginData(data);
        }}
      />
    );
  }

  const user = loginData.user || loginData || {};

  const handleCardPress = (item) => {
    Alert.alert(item.title, `${item.title} सेक्शन जल्द ही जोड़ा जाएगा।`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.topTitle}>{user.shop_name || 'Samrat Group'}</Text>
          <Text style={styles.topSub}>
            {user.name || 'User'} ({user.role || 'User'})
          </Text>
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => setLoginData(null)}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => handleCardPress(item)}
            >
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  topBar: {
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  topSub: {
    color: '#d1fae5',
    fontSize: 12,
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '31.8%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  icon: {
    fontSize: 24,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
});
