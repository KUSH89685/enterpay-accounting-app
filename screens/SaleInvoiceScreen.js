import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Modal,
} from 'react-native';

const INVOICES_API_URL = 'https://accounting.enterpay.in/api/invoices.php';

const PAYMENT_TYPES = ['CREDIT', 'CASH', 'CHEQUE', 'ONLINE'];

const getTodayDate = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export default function SaleInvoiceScreen({ user, onBack }) {
  const [mode, setMode] = useState('list');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(getTodayDate());
  const [paymentType, setPaymentType] = useState('CREDIT');
  const [items, setItems] = useState([
    { product_name: '', qty: '1', price: '' },
  ]);
  const [saving, setSaving] = useState(false);

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

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

  const grandTotal = useMemo(() => {
    return items.reduce((sum, row) => {
      const q = parseFloat(row.qty) || 0;
      const p = parseFloat(row.price) || 0;
      return sum + q * p;
    }, 0);
  }, [items]);

  const resetCreateForm = () => {
    setCustomerName('');
    setInvoiceDate(getTodayDate());
    setPaymentType('CREDIT');
    setItems([{ product_name: '', qty: '1', price: '' }]);
  };

  const handleAddItemRow = () => {
    setItems((prev) => [...prev, { product_name: '', qty: '1', price: '' }]);
  };

  const handleRemoveItemRow = (index) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((row, idx) => (idx === index ? { ...row, [field]: value } : row))
    );
  };

  const handleSaveInvoice = async () => {
    const cleanCustomer = customerName.trim();
    const cleanItems = items
      .map((row) => ({
        product_name: (row.product_name || '').trim(),
        qty: parseFloat(row.qty) || 0,
        price: parseFloat(row.price) || 0,
      }))
      .filter((row) => row.product_name !== '');

    if (!cleanCustomer || cleanItems.length === 0) {
      Alert.alert(
        'सूचना',
        'कृपया Customer Name और कम से कम एक Product/Service भरें।'
      );
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(INVOICES_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          customer_name: cleanCustomer,
          invoice_date: invoiceDate.trim() || getTodayDate(),
          payment_type: paymentType,
          items: cleanItems,
        }),
      });
      const data = await res.json();
      if (res.ok && data.status) {
        Alert.alert('सफल', data.message || 'Sale Invoice saved successfully!');
        resetCreateForm();
        setMode('list');
        setLoading(true);
        fetchInvoices();
      } else {
        Alert.alert('एरर', data.message || 'Invoice सेव नहीं हो सका।');
      }
    } catch (err) {
      Alert.alert('नेटवर्क एरर', 'Invoice सेव करते समय सर्वर से कनेक्ट नहीं हो पाया।');
    } finally {
      setSaving(false);
    }
  };

  const handleViewInvoice = async (item) => {
    setSelectedInvoice({ ...item, items: [] });
    setViewLoading(true);
    try {
      const res = await fetch(
        `${INVOICES_API_URL}?id=${item.id}&user_id=${userId}`
      );
      const data = await res.json();
      if (res.ok && data.status && data.invoice) {
        setSelectedInvoice(data.invoice);
      }
    } catch (e) {
      // Modal already displays available invoice fields
    } finally {
      setViewLoading(false);
    }
  };

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

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.viewBtn}
              onPress={() => handleViewInvoice(item)}
            >
              <Text style={styles.viewText}>View</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(item)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            if (mode === 'create') {
              setMode('list');
            } else {
              onBack();
            }
          }}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {mode === 'create' ? 'Create Sale Invoice' : 'Sale Invoices List'}
        </Text>

        {mode === 'list' ? (
          <TouchableOpacity
            style={styles.newBtn}
            onPress={() => {
              resetCreateForm();
              setMode('create');
            }}
          >
            <Text style={styles.newBtnText}>+ New Bill</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 68 }} />
        )}
      </View>

      {mode === 'create' ? (
        <ScrollView contentContainerStyle={styles.formScroll}>
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Customer Info</Text>

            <Text style={styles.label}>Customer Name*</Text>
            <TextInput
              style={styles.input}
              placeholder="Customer name likhein"
              value={customerName}
              onChangeText={setCustomerName}
            />

            <Text style={styles.label}>Invoice Date (YYYY-MM-DD)*</Text>
            <TextInput
              style={styles.input}
              placeholder="2026-11-24"
              value={invoiceDate}
              onChangeText={setInvoiceDate}
            />
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Product / Service Items</Text>

            {items.map((row, idx) => (
              <View key={idx} style={styles.itemBox}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemLabel}>Item #{idx + 1}</Text>
                  {items.length > 1 && (
                    <TouchableOpacity onPress={() => handleRemoveItemRow(idx)}>
                      <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <Text style={styles.label}>Product / Service Name*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Item name likhein"
                  value={row.product_name}
                  onChangeText={(val) =>
                    handleItemChange(idx, 'product_name', val)
                  }
                />

                <View style={styles.twoCol}>
                  <View style={styles.halfCol}>
                    <Text style={styles.label}>Qty</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="decimal-pad"
                      value={row.qty}
                      onChangeText={(val) => handleItemChange(idx, 'qty', val)}
                    />
                  </View>
                  <View style={styles.halfCol}>
                    <Text style={styles.label}>Price (₹)</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="decimal-pad"
                      placeholder="0.00"
                      value={row.price}
                      onChangeText={(val) => handleItemChange(idx, 'price', val)}
                    />
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.addRowBtn} onPress={handleAddItemRow}>
              <Text style={styles.addRowText}>+ Add More Item</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Grand Total (₹)</Text>
            <View style={styles.totalBox}>
              <Text style={styles.totalText}>₹{grandTotal.toFixed(2)}</Text>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 14 }]}>
              Payment Type*
            </Text>
            <View style={styles.payGrid}>
              {PAYMENT_TYPES.map((type) => {
                const active = paymentType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.payChip, active && styles.payChipActive]}
                    onPress={() => setPaymentType(type)}
                  >
                    <Text
                      style={[
                        styles.payChipText,
                        active && styles.payChipTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, saving && { opacity: 0.7 }]}
            onPress={handleSaveInvoice}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.saveBtnText}>💾 Save Invoice</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      ) : loading ? (
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
              <Text style={styles.emptyText}>
                कोई Sale Invoice नहीं मिला। ऊपर "+ New Bill" दबाकर bill बनाएँ।
              </Text>
            </View>
          }
        />
      )}

      <Modal
        visible={!!selectedInvoice}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedInvoice(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Invoice #{selectedInvoice?.id || ''}
            </Text>
            <Text style={styles.modalLine}>
              Customer: {selectedInvoice?.customer_name || '-'}
            </Text>
            <Text style={styles.modalLine}>
              Date: {selectedInvoice?.invoice_date || '-'}
            </Text>
            <Text style={styles.modalLine}>
              Payment Type: {selectedInvoice?.payment_type || '-'}
            </Text>

            <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Items</Text>
            {viewLoading ? (
              <ActivityIndicator size="small" color="#059669" />
            ) : Array.isArray(selectedInvoice?.items) &&
              selectedInvoice.items.length > 0 ? (
              selectedInvoice.items.map((it, i) => (
                <View key={i} style={styles.modalItemRow}>
                  <Text style={styles.modalItemName}>
                    {it.product_name} ({it.qty} × ₹{Number(it.price || 0).toFixed(2)})
                  </Text>
                  <Text style={styles.modalItemAmt}>
                    ₹{Number(it.total || 0).toFixed(2)}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.modalLine}>Items विवरण उपलब्ध नहीं है।</Text>
            )}

            <View style={styles.modalTotalRow}>
              <Text style={styles.modalTotalLabel}>Grand Total</Text>
              <Text style={styles.modalTotalVal}>
                ₹{Number(selectedInvoice?.grand_total || 0).toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setSelectedInvoice(null)}
            >
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 12,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    paddingVertical: 5,
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
    fontSize: 16,
    fontWeight: '700',
  },
  newBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderRadius: 6,
  },
  newBtnText: {
    color: '#059669',
    fontSize: 12,
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
  actionRow: {
    flexDirection: 'row',
    gap: 6,
  },
  viewBtn: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewText: {
    color: '#0284c7',
    fontSize: 12,
    fontWeight: '700',
  },
  deleteBtn: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '700',
  },
  formScroll: {
    padding: 12,
    paddingBottom: 30,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#f8fafc',
    marginBottom: 10,
    color: '#0f172a',
  },
  itemBox: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itemLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  removeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#dc2626',
  },
  twoCol: {
    flexDirection: 'row',
    gap: 10,
  },
  halfCol: {
    flex: 1,
  },
  addRowBtn: {
    borderWidth: 1,
    borderColor: '#059669',
    backgroundColor: '#ecfdf5',
    borderRadius: 7,
    paddingVertical: 9,
    alignItems: 'center',
  },
  addRowText: {
    color: '#059669',
    fontSize: 13,
    fontWeight: '700',
  },
  totalBox: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 8,
    padding: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  payGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  payChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
  },
  payChipActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  payChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  payChipTextActive: {
