/*═══════════════════════════════════════════════════════════════
  WaqFi — Configuration & Constants
═══════════════════════════════════════════════════════════════*/

export const PILAR = Object.freeze({
  ASET_TETAP:      1,
  WAKAF_UANG:      2,
  MELALUI_UANG:    3,
  USAHA_PRODUKTIF: 4,
});

export const PILAR_NAMES  = Object.freeze(['', 'Aset Tetap', 'Wakaf Uang', 'Melalui Uang', 'Usaha Produktif']);
export const PILAR_COLORS = Object.freeze(['', '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6']);
export const PILAR_ICONS  = Object.freeze(['', '\u{1F3DB}\u{FE0F}', '\u{1F4B0}', '\u{1F91D}', '\u{1F33E}']);

export const PROJECT_NAMES = Object.freeze([
  'Masjid Al-Ikhlas Jakarta',
  'Sukuk Wakaf BSI Series A',
  'Pesantren Digital Bogor',
  'Kebun Produktif Cianjur',
  'RS Wakaf Surabaya',
  'Ruko Wakaf Bandung',
  'Deposito Syariah Wakaf',
  'Sawah Produktif Karawang',
]);

export const WAKIF_NAMES = Object.freeze([
  'Ahmad Fauzi', 'Siti Aminah', 'Budi Santoso', 'Fatimah Zahra',
  'Rizki Ramadhan', 'Nur Halimah', 'Irfan Hakim', 'Dewi Kartini',
  'Hasan Abdullah', 'Aisyah Putri',
]);

export const SEED_TRANSACTIONS = Object.freeze([
  { name: 'Siti Aminah',    pilar: 2, amount: 1_000_000, project: 'Sukuk Wakaf BSI Series A' },
  { name: 'Budi Santoso',   pilar: 1, amount: 5_000_000, project: 'Masjid Al-Ikhlas Jakarta' },
  { name: 'Fatimah Zahra',  pilar: 3, amount: 250_000,   project: 'Pesantren Digital Bogor' },
  { name: 'Rizki Ramadhan', pilar: 4, amount: 2_000_000, project: 'Kebun Produktif Cianjur' },
  { name: 'Nur Halimah',    pilar: 2, amount: 500_000,   project: 'Deposito Syariah Wakaf' },
]);

export const MIN_WAQF_AMOUNT    = 10_000;
export const TOKEN_UNIT         = 10_000;     // 1 WAQF = Rp 10.000
export const AUTO_TX_INTERVAL   = 8_000;      // ms between auto-generated txs
export const TOAST_DURATION     = 4_000;      // ms toast stays visible
export const AUTO_TX_AMOUNTS    = Object.freeze([100_000, 250_000, 500_000, 1_000_000, 2_500_000]);

export const CHART_DATA = Object.freeze({
  monthly: [
    { label: 'Jan', value: 1.2 }, { label: 'Feb', value: 2.1 },
    { label: 'Mar', value: 1.8 }, { label: 'Apr', value: 3.5 },
    { label: 'May', value: 4.2 }, { label: 'Jun', value: 5.8 },
    { label: 'Jul', value: 7.1 }, { label: 'Aug', value: 8.5 },
    { label: 'Sep', value: 9.2 }, { label: 'Oct', value: 11.3 },
    { label: 'Nov', value: 13.8 }, { label: 'Dec', value: 16.5 },
  ],
  pilarDistribution: [
    { label: 'Aset Tetap',      value: 35, color: '#10B981' },
    { label: 'Wakaf Uang',      value: 30, color: '#3B82F6' },
    { label: 'Melalui Uang',    value: 20, color: '#F59E0B' },
    { label: 'Usaha Produktif', value: 15, color: '#8B5CF6' },
  ],
});
