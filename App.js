import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import LoginScreen from './screens/LoginScreen';
import SaleInvoiceScreen from './screens/SaleInvoiceScreen';

const DASHBOARD_CARDS = [
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
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);

  if (!loginData) {
    return (
      <LoginScreen
        onLoginSuccess={(data) => {
          setLoginData(data);
          setActiveScreen('dashboard');
          setSidebarOpen(false);
          setOpenGroup(null);
        }}
      />
    );
  }

  const user = loginData.user || loginData || {};

  const toggleGroup = (groupKey) => {
    setOpenGroup((prev) => (prev === groupKey ? null : groupKey));
  };

  const handleNavigate = (targetKey, label) => {
    setSidebarOpen(false);
    if (targetKey === 'dashboard') {
      setActiveScreen('dashboard');
      return;
    }
    if (
      targetKey === 'sale_invoice' ||
      targetKey === 'create_invoice' ||
      targetKey === 'view_invoices'
    ) {
      setActiveScreen('sale_invoice');
      return;
    }
    Alert.alert(label || targetKey, `${label || targetKey} जल्द ही जोड़ा जाएगा।`);
  };

  const handleLogout = () => {
    setSidebarOpen(false);
    setOpenGroup(null);
    setLoginData(null);
    setActiveScreen('dashboard');
  };

  const renderSidebar = () => (
    <Modal
      visible={sidebarOpen}
      transparent
      animationType="fade"
      onRequestClose={() => setSidebarOpen(false)}
    >
      <View style={styles.drawerOverlay}>
        <View style={styles.drawerPanel}>
          <View style={styles.drawerHeader}>
            <View>
              <Text style={styles.drawerBrand}>Enterpay Accounting</Text>
              <Text style={styles.drawerSub}>
                {user.shop_name || 'Samrat Group'} • {user.name || 'User'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setSidebarOpen(false)}>
              <Text style={styles.closeIcon}>&times;</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.drawerScroll}>
            <TouchableOpacity
              style={styles.menuLink}
              onPress={() => handleNavigate('dashboard', 'Dashboard')}
            >
              <Text style={styles.menuLinkText}>📊 Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuLink}
              onPress={() => handleNavigate('customers', 'Customer / Vendor')}
            >
              <Text style={styles.menuLinkText}>👥 Customer / Vendor</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuLink}
              onPress={() => handleNavigate('ledgers', 'Company Ledgers')}
            >
              <Text style={[styles.menuLinkText, styles.greenBold]}>
                📒 Company Ledgers
              </Text>
            </TouchableOpacity>

            {/* Products / Services Dropdown */}
            <TouchableOpacity
              style={styles.menuLink}
              onPress={() => toggleGroup('products')}
            >
              <Text style={styles.menuLinkText}>📦 Products / Services</Text>
              <Text style={styles.arrowText}>
                {openGroup === 'products' ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            {openGroup === 'products' && (
              <View style={styles.subMenuBox}>
                <TouchableOpacity
                  style={styles.subLink}
                  onPress={() => handleNavigate('products', 'Products / Services')}
                >
                  <Text style={styles.subLinkText}>Products / Services</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.subLink}
                  onPress={() => handleNavigate('product_group', 'Product Group')}
                >
                  <Text style={styles.subLinkText}>Product Group</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.subLink}
                  onPress={() => handleNavigate('barcode', 'Generate Barcode')}
                >
                  <Text style={styles.subLinkText}>Generate Barcode</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.subLink}
                  onPress={() => handleNavigate('price_list', 'Price List')}
                >
                  <Text style={styles.subLinkText}>Price List</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.subLink}
                  onPress={() => handleNavigate('combos', 'E-commerce Combos')}
                >
                  <Text style={[styles.subLinkText, styles.greenBold]}>
                    📦 E-commerce Combos
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.subLink}
                  onPress={() =>
                    handleNavigate('ecommerce_order_book', 'E-commerce Order Book')
                  }
                >
                  <Text style={[styles.subLinkText, styles.greenBold]}>
                    🛒 E-commerce Order Book
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.subLink}
                  onPress={() => handleNavigate('stock', 'Stock')}
                >
                  <Text style={styles.subLinkText}>Stock</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Sale Invoice Dropdown */}
            <TouchableOpacity
              style={styles.menuLink}
              onPress={() => toggleGroup('sale_invoice')}
            >
              <Text style={styles.menuLinkText}>📄 Sale Invoice</Text>
              <Text style={styles.arrowText}>
                {openGroup === 'sale_invoice' ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            {openGroup === 'sale_invoice' && (
              <View style={styles.subMenuBox}>
                <TouchableOpacity
                  style={styles.subLink}
                  onPress={() =>
                    handleNavigate('create_invoice', 'Create Sale Invoice')
                  }
                >
                  <Text style={styles.subLinkText}>Create Sale Invoice</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.subLink}
                  onPress={() =>
                    handleNavigate('view_invoices', 'View Sale Bills List')
                  }
                >
                  <Text style={[styles.subLinkText, styles.greenBold]}>
                    View Sale Bills List
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.subLink}
                  onPress={() =>
                    handleNavigate('quotation', 'Quotation Management')
                  }
                >
                  <Text style={styles.subLinkText}>Quotation Management</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={styles.menuLink}
              onPress={() => handleNavigate('job_work', 'Job Work & Material')}
            >
              <Text style={styles.menuLinkText}>🔨 Job Work &amp; Material</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuLink}
              onPress={() =>
                handleNavigate('mobile_service', 'Mobile Service Slip')
              }
            >
              <Text style={styles.menuLinkText}>📱 Mobile Service Slip</Text>
            </TouchableOpacity>

            {/* Purchase Invoice Dropdown */}
            <TouchableOpacity
              style={styles.menuLink}
              onPress={() => toggleGroup('purchase')}
            >
              <Text style={styles.menuLinkText}>🛒 Purchase Invoice</Text>
              <Text style={styles.arrowText}>
                {openGroup === 'purchase' ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            {openGroup === 'purchase' && (
              <View style={styles.subMenuBox}>
                <TouchableOpacity
                  style={styles.subLink}
                  onPress={() =>
                    handleNavigate('create_purchase', 'Create Purchase Invoice')
                  }
                >
                  <Text style={styles.subLinkText}>Create Purchase Invoice</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.subLink}
                  onPress={() =>
                    handleNavigate('purchase_invoice', 'View Purchase Bills List')
                  }
                >
                  <Text style={[styles.subLinkText, styles.greenBold]}>
                    View Purchase Bills List
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Payment Dropdown */}
            <TouchableOpacity
              style={styles.menuLink}
              onPress={() => toggleGroup('payment')}
            >
              <Text style={styles.menuLinkText}>💳 Payment</Text>
              <Text style={styles.arrowText}>
                {openGroup === 'payment' ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            {openGroup === 'payment' && (
              <View style={styles.subMenuBox}>
                <TouchableOpacity
                  style={styles.subLink}
                  onPress={() =>
                    handleNavigate('inward_payment', 'Inward Payment')
                  }
                >
                  <Text style={styles.subLinkText}>Inward Payment</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.subLink}
                  onPress={() =>
                    handleNavigate('outward_payment', 'Outward Payment')
                  }
                >
                  <Text style={styles.subLinkText}>Outward Payment</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.subLink}
                  onPress={() => handleNavigate('contra', 'Contra Entry')}
                >
                  <Text style={[styles.subLinkText, styles.greenBold]}>
                    🔄 Contra Entry
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.subLink}
                  onPress={() => handleNavigate('cheque', 'Cheque Book Entry')}
                >
                  <Text style={styles.subLinkText}>Cheque Book Entry</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.subLink}
                  onPress={() =>
                    handleNavigate('bank_accounts', 'Bank & Cash Accounts')
                  }
                >
                  <Text style={[styles.subLinkText, styles.greenBold]}>
                    🏦 Bank &amp; Cash Accounts
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.subLink}
                  onPress={() =>
                    handleNavigate('opening_balance', 'Opening Balance & FY')
                  }
                >
                  <Text style={[styles.subLinkText, styles.greenBold]}>
                    📌 Opening Balance &amp; FY
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={styles.menuLink}
              onPress={() => handleNavigate('expenses', 'Expense / Income')}
            >
              <Text style={styles.menuLinkText}>📈 Expense / Income</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuLink}
              onPress={() => handleNavigate('documents', 'Other Documents')}
            >
              <Text style={styles.menuLinkText}>📑 Other Documents</Text>
            </TouchableOpacity>

            {/* Report Dropdown */}
            <TouchableOpacity
              style={styles.menuLink}
              onPress={() => toggleGroup('report')}
            >
              <Text style={styles.menuLinkText}>📊 Report</Text>
              <Text style={styles.arrowText}>
                {openGroup === 'report' ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            {openGroup === 'report' && (
              <View style={styles.subMenuBox}>
                <TouchableOpacity
                  style={styles.subLink}
                  onPress={() =>
                    handleNavigate('company_ledger', 'Company Ledger & History')
                  }
                >
                  <Text style={[styles.subLinkText, styles.greenBold]}>
                    📊 Company Ledger &amp; History
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.subLink}
                  onPress={() => handleNavigate('daybook', 'Daybook')}
                >
                  <Text style={[styles.subLinkText, styles.greenBold]}>
                    Daybook
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.subLink}
                  onPress={() => handleNavigate('gst_reports', 'GST Reports')}
                >
                  <Text style={styles.subLinkText}>GST Reports</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={styles.menuLink}
              onPress={() => handleNavigate('settings', 'Settings')}
            >
              <Text style={styles.menuLinkText}>⚙️ Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuLink}
              onPress={() => handleNavigate('notification', 'Notification')}
            >
              <Text style={styles.menuLinkText}>🔔 Notification</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuLink}
              onPress={() => handleNavigate('refer', 'Refer a friend')}
            >
              <Text style={styles.menuLinkText}>🎁 Refer a friend</Text>
            </TouchableOpacity>

            <View style={styles.supportBox}>
              <Text style={styles.supportTitle}>Quick Support</Text>
              <Text style={styles.supportLine}>📞 +91 99888 99541</Text>
              <Text style={styles.supportLine}>✉️ help@enterpay.in</Text>
            </View>
          </ScrollView>

          <View style={styles.drawerFooter}>
            <TouchableOpacity style={styles.drawerLogoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.drawerBackdrop}
          activeOpacity={1}
          onPress={() => setSidebarOpen(false)}
        />
      </View>
    </Modal>
  );

  if (activeScreen === 'sale_invoice') {
    return (
      <View style={{ flex: 1 }}>
        <SaleInvoiceScreen
          user={user}
          onBack={() => setActiveScreen('dashboard')}
        />
        {renderSidebar()}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.topLeft}>
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => setSidebarOpen(true)}
          >
            <Text style={styles.menuBtnText}>☰</Text>
          </TouchableOpacity>

          <View>
            <Text style={styles.topTitle}>
              {user.shop_name || 'Samrat Group'}
            </Text>
            <Text style={styles.topSub}>
              {user.name || 'User'} ({user.role || 'User'})
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {DASHBOARD_CARDS.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => handleNavigate(item.key, item.title)}
            >
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {renderSidebar()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  topBar: {
    backgroundColor: '#00b074',
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  menuBtnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  topTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
  topSub: {
    color: '#d1fae5',
    fontSize: 12,
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
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
  drawerOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  drawerPanel: {
    width: '78%',
    maxWidth: 300,
    backgroundColor: '#ffffff',
    height: '100%',
    justifyContent: 'space-between',
  },
  drawerBackdrop: {
    flex: 1,
  },
  drawerHeader: {
    back