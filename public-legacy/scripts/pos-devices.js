// Sahla Multi-POS & Bound Devices Manager (إدارة شبكة نقاط البيع والأجهزة المرتبطة)

class PosDevicesManager {
  constructor() {
    this.storageKey = 'sahla_devices_data';
    this.devices = this.loadDevices();
    this.activePairingCode = null;
    this.pairingExpiry = null;
  }

  loadDevices() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load bound devices from localStorage');
    }
    const def = (typeof DEFAULT_BOUND_DEVICES !== 'undefined') ? DEFAULT_BOUND_DEVICES : (window.DEFAULT_BOUND_DEVICES || []);
    return JSON.parse(JSON.stringify(def));
  }

  saveDevices() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.devices));
      window.dispatchEvent(new CustomEvent('sahla:devices-updated', { detail: this.devices }));
    } catch (e) {
      console.error('Failed to save devices', e);
    }
  }

  getDevices() {
    return this.devices;
  }

  getDeviceById(id) {
    return this.devices.find(d => d.id === id);
  }

  addDevice({ name, type, role, ipAddress, permissions }) {
    const roleTitles = {
      OWNER: 'المالك / المدير العام',
      CASHIER: 'عامل الكاونتر والخدمات',
      PRINT_OPERATOR: 'خادم ومحطة الطباعة',
      KIOSK_TERMINAL: 'شاشة الخدمة الذاتية'
    };

    const newDevice = {
      id: 'dev_' + Date.now().toString(36),
      name: name || 'طرفية جديدة',
      type: type || 'DESKTOP',
      ipAddress: ipAddress || '192.168.1.' + Math.floor(Math.random() * 150 + 100),
      role: role || 'CASHIER',
      roleTitle: roleTitles[role] || 'عامل كاونتر',
      status: 'ONLINE',
      lastActive: 'الآن (تم الاقتران حديثاً)',
      isCurrent: false,
      permissions: permissions || {
        canGenerateDocs: true,
        canPrint: true,
        canViewAccounting: false,
        canRechargeWallet: false,
        canManageDevices: false
      }
    };

    this.devices.push(newDevice);
    this.saveDevices();
    return newDevice;
  }

  removeDevice(id) {
    const dev = this.getDeviceById(id);
    if (!dev) return false;
    if (dev.isCurrent) {
      alert('لا يمكنك إلغاء اقتران الجهاز الحالي الذي تعمل منه الآن!');
      return false;
    }
    this.devices = this.devices.filter(d => d.id !== id);
    this.saveDevices();
    return true;
  }

  togglePermission(deviceId, permKey) {
    const dev = this.getDeviceById(deviceId);
    if (!dev) return;
    if (dev.role === 'OWNER') return; // Owner always has all permissions
    dev.permissions[permKey] = !dev.permissions[permKey];
    this.saveDevices();
  }

  generatePairingPin() {
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    this.activePairingCode = pin;
    this.pairingExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    return {
      pin,
      expiresInMinutes: 10
    };
  }

  // محاكاة مزامنة العمليات بين مختلف أجهزة المحل
  simulateBroadcastSync(actionDescription) {
    const randomCounter = ['POS 2 (كاونتر الإنجاز)', 'هاتف المحل (سامسونغ)', 'محطة الطباعة (Epson)'][Math.floor(Math.random() * 3)];
    const syncEvent = {
      terminal: randomCounter,
      description: actionDescription,
      timestamp: new Date().toLocaleTimeString('ar-DZ')
    };

    window.dispatchEvent(new CustomEvent('sahla:pos-sync-received', { detail: syncEvent }));
    return syncEvent;
  }
}

window.sahlaPosDevices = new PosDevicesManager();
