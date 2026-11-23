import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import LoginScreen from './screens/LoginScreen';

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBox}>
        <Text style={styles.badge}>Dashboard</Text>
        <Text style={styles.title}>स्वागत है, {user.name || 'User'}!</Text>
        <Text style={styles.subText}>अकाउंटिंग कंट्रोल पैनल से कनेक्टेड</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.info}>दुकान/फर्म: {user.shop_name || '-'}</Text>
        <Text style={styles.info}>ईमेल: {user.email || '-'}</Text>
        <Text style={styles.info}>रोल: {user.role || '-'}</Text>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => setLoginData(null)}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f5f9',
    justifyContent: 'center',
    padding: 20,
  },
  headerBox: {
    marginBottom: 14,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  subText: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 22,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  info: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 8,
  },
  logoutBtn: {
    marginTop: 18,
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
