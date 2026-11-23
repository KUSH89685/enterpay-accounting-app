import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';

const INVOICES_API_URL = 'https://accounting.enterpay.in/api/invoices.php';

export default function SaleInvoiceScreen({ user, onBack }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const userId = user?.id;

  const fetchInvoices = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${INVOICES_API_URL}?user_id=${userId}`);
      const data = await response.json();
      if (response.ok && data.status) {
        setInvoices(Array.isArray(data.invoices) ? data.invoices : []);
      } else {
        Alert.alert('सूचना', data.message || 'Invoices लोड नहीं हो पाए।');
      }
    } catch (err) {
      Alert.alert('नेटवर्क एरर', 'Invoices सर्वर से कनेक्ट नहीं हो पाया।');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleDelete = (item) => {
    Alert.alert(
      'Delete Invoice',
      `क्या आप Invoice #${item.id} (${item.customer_name || ''}) को हटाना चाहते हैं?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(
                `${INVOICES_API_URL}?delete_id=${item.id}&user_id=${userId}`,
                { method: 'DELETE' }
              );
              const data = await res.json();
              if (res.ok && data.status) {
                setInvoices((prev) => prev.filter((row) => row.id !== item.id));
                Alert.alert('सफल', data.message || 'Invoice deleted successfully!');
              } else {
                Alert.alert('एरर', data.message || 'Delete नहीं हो सका।');
              }
            } catch (e) {
              Alert.alert('नेटवर्क एरर', 'Delete करते समय सर्वर से कनेक्ट नहीं हो पाया।');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const amount = Number(item.grand_total || 0).toFixed(2);
    return (
      <View style={styles.card}>
        <View style={styles.rowTop}>
          <Text style={styles.invNo}>Invoice #{item.id}</Text>
          <Text style={styles.dateText}>{item.invoice_date || '-'}</Text>
        </View>

        <Text style={styles.customerName}>{item.customer_name || '-'}</Text>

        <View style={styles.rowBottom}>
          <View style={styles.amountWrap}>
            <Text style={styles.amountText}>₹{amount}</Text>
            <Text style={styles.payBadge}>{item.payment_type || '-'}</Text>
          </View>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item)}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sale Invoices List</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Invoices लोड हो रहे हैं...</Text>
        </View>
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchInvoices();
              }}
            />
          }
          ListEmptyComponent={
            <View style={styles.centerBox}>
              <Text style={styles.emptyText}>कोई Sale Invoice नहीं मिला।</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  header: {
    backgroundColor: '#059669',
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
  },
  backText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
  listContent: {
    padding: 12,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  invNo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
  dateText: {
    fontSize: 12,
    color: '#64748b',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 10,
  },
  rowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amountText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  payBadge: {
    backgroundColor: '#fef3c7',
    color: '#d97706',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  deleteBtn: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '700',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 10,
    color: '#475569',
    fontSize: 14,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
  },
});
              
