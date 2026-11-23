import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

const API_URL = 'https://accounting.enterpay.in/api/login.php';

export default function LoginScreen({ onLoginSuccess }) {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!loginId.trim() || !password.trim()) {
      Alert.alert('सूचना', 'कृपया Email/Phone और Password लिखें।');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: loginId.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status) {
        onLoginSuccess(data);
      } else {
        Alert.alert('Login असफल', data.message || 'गलत login ID या password।');
      }
    } catch (error) {
      Alert.alert('नेटवर्क एरर', 'कंट्रोल पैनल से कनेक्ट नहीं हो पाया।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Accounting App</Text>
        <Text style={styles.subtitle}>अपने अकाउंट में लॉगिन करें</Text>

        <Text style={styles.label}>Email या Mobile Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Email या फ़ोन नंबर लिखें"
          value={loginId}
          onChangeText={setLoginId}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="पासवर्ड लिखें"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 22,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#64748b',
    marginTop: 4,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    fontSize: 15,
    backgroundColor: '#f8fafc',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
