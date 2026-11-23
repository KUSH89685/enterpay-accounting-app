import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function DashboardScreen({ user, onLogout }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Dashboard</Text>
      <Text style={styles.welcome}>
        स्वागत है, {user?.name || user?.email || 'User'}
      </Text>

      <View style={styles.box}>
        <Text style={styles.boxTitle}>
          {user?.shop_name || 'Enterpay Accounting'}
        </Text>
        <Text style={styles.boxText}>
          कंट्रोल पैनल से लॉगिन सफल हो गया है। यहाँ आप आगे अकाउंटिंग फीचर्स या रिपोर्ट्स जोड़ सकते हैं।
        </Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 20,
    paddingTop: 50,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  welcome: {
    fontSize: 16,
    color: '#334155',
    marginTop: 6,
    marginBottom: 20,
  },
  box: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 24,
  },
  boxTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1d4ed8',
    marginBottom: 6,
  },
  boxText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  logoutBtn: {
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
