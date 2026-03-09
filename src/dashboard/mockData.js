// ─────────────────────────────────────────────────────────────────
// mockData.js  —  Renew Part Bank Dashboard Mock Data
// Replace with Firebase reads when ready
// ─────────────────────────────────────────────────────────────────

export const CURRENT_USER = {
  uid: "usr_001",
  firstName: "Elliana",
  lastName: "Wilson",
  email: "elliana.wilson@email.com",
  phone: "+1 (555) 204-8811",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&q=80",
  dob: "1990-04-15",
  gender: "Female",
  religion: "Christianity",
  address: "47 Maple Ridge Avenue, Apt 3B",
  city: "New York",
  state: "NY",
  zipcode: "10021",
  country: "United States",
  joinDate: "2018-09-20",
  kycStatus: "verified",   // "verified" | "pending" | "unverified"
};

export const ACCOUNT = {
  id: "acc_001",
  accountNumber: "1042054190",
  routingNumber: "021000021",
  type: "Personal Checking",
  currency: "USD",
  balance: 10200000.00,
  btcBalance: 0.0000000,
  btcUsd: 0.00,
  status: "active",   // "active" | "suspended" | "closed"
  iban: "US29NWBK60161331926819",
  swift: "RENEWUS33",
  openedDate: "2018-09-20",
};

export const TRANSACTIONS = [

  // ── 2019 ─────────────────────────────────────────────────────────
  {
    id: "txn_001",
    account: "1042054190",
    description: "Initial Wire Deposit",
    amount: 5000000.00,
    type: "credit",
    category: "Deposit",
    date: "2019-03-12",
    time: "10:15:44",
    status: "completed",
    reference: "DEP2019031201",
    recipient: "Self",
    recipientBank: "Renew Part Bank",
  },
  {
    id: "txn_002",
    account: "1042054190",
    description: "Utility Bill Payment",
    amount: -230.50,
    type: "debit",
    category: "Bills",
    date: "2019-06-18",
    time: "14:22:33",
    status: "completed",
    reference: "BILL201906180",
    recipient: "Con Edison",
    recipientBank: "N/A",
  },

  // ── 2020 ─────────────────────────────────────────────────────────
  {
    id: "txn_003",
    account: "1042054190",
    description: "Business Investment Credit",
    amount: 2500000.00,
    type: "credit",
    category: "Deposit",
    date: "2020-02-05",
    time: "09:00:00",
    status: "completed",
    reference: "DEP2020020501",
    recipient: "Self",
    recipientBank: "Goldman Sachs",
  },
  {
    id: "txn_004",
    account: "1042054190",
    description: "ATM Withdrawal",
    amount: -500.00,
    type: "debit",
    category: "Withdrawal",
    date: "2020-08-22",
    time: "09:32:10",
    status: "completed",
    reference: "ATM2020082201",
    recipient: "ATM #4421",
    recipientBank: "Renew Part Bank",
  },

  // ── 2021 ─────────────────────────────────────────────────────────
  {
    id: "txn_005",
    account: "1042054190",
    description: "Real Estate Proceeds",
    amount: 1800000.00,
    type: "credit",
    category: "Deposit",
    date: "2021-04-30",
    time: "11:48:02",
    status: "completed",
    reference: "DEP2021043001",
    recipient: "Self",
    recipientBank: "JPMorgan Chase",
  },

  // ── 2022 ─────────────────────────────────────────────────────────
  {
    id: "txn_006",
    account: "1042054190",
    description: "Portfolio Dividend Payout",
    amount: 750000.00,
    type: "credit",
    category: "Income",
    date: "2022-01-17",
    time: "08:30:00",
    status: "completed",
    reference: "DIV2022011701",
    recipient: "Self",
    recipientBank: "Fidelity Investments",
  },
  {
    id: "txn_007",
    account: "1042054190",
    description: "Outgoing Wire Transfer",
    amount: -20000.00,
    type: "debit",
    category: "Transfer",
    date: "2022-09-14",
    time: "11:14:21",
    status: "completed",
    reference: "WTF2022091401",
    recipient: "James Whitfield",
    recipientBank: "Chase Bank",
  },

  // ── 2023 ─────────────────────────────────────────────────────────
  {
    id: "txn_008",
    account: "1042054190",
    description: "Online Transfer Received",
    amount: 170730.50,
    type: "credit",
    category: "Transfer",
    date: "2023-05-09",
    time: "16:45:00",
    status: "completed",
    reference: "TRF2023050901",
    recipient: "Self",
    recipientBank: "Bank of America",
  },

];

// ── Running balance verification (dev check) ──────────────────────
// Credits : 5,000,000 + 2,500,000 + 1,800,000 + 750,000 + 170,730.50 = 10,220,730.50
// Debits  :      230.50 +     500 +  20,000                           =     20,730.50
// Balance : 10,220,730.50 − 20,730.50                                 = 10,200,000.00 ✓

export const CARDS = [
  {
    id: "card_001",
    type: "Visa",
    label: "Primary Debit Card",
    holder: "ELLIANA WILSON",
    number: "4532 •••• •••• 7821",
    numberFull: "4532187645627821",
    expiry: "09/28",
    cvv: "•••",
    color: ["#1a1a5e", "#2a3aa0"],
    status: "active",
    limit: 50000,
    spent: 20500,
    contactless: true,
    virtual: false,
  },
  {
    id: "card_002",
    type: "Mastercard",
    label: "Business Credit Card",
    holder: "ELLIANA WILSON",
    number: "5412 •••• •••• 3306",
    numberFull: "5412783920443306",
    expiry: "12/27",
    cvv: "•••",
    color: ["#c8a951", "#a07820"],
    status: "active",
    limit: 100000,
    spent: 34200,
    contactless: true,
    virtual: false,
  },
  {
    id: "card_003",
    type: "Visa",
    label: "Virtual Card",
    holder: "ELLIANA WILSON",
    number: "4916 •••• •••• 0044",
    numberFull: "4916223300440044",
    expiry: "03/26",
    cvv: "•••",
    color: ["#1a6e4a", "#2aa070"],
    status: "frozen",
    limit: 5000,
    spent: 120,
    contactless: false,
    virtual: true,
  },
];

export const LOANS = [
  {
    id: "loan_001",
    type: "Personal Loan",
    amount: 50000,
    outstanding: 32400,
    monthlyPayment: 980,
    interestRate: 6.5,
    nextPaymentDate: "2026-04-01",
    startDate: "2023-04-01",
    endDate: "2028-04-01",
    status: "active",
  },
  {
    id: "loan_002",
    type: "Home Mortgage",
    amount: 450000,
    outstanding: 398000,
    monthlyPayment: 2340,
    interestRate: 4.2,
    nextPaymentDate: "2026-04-05",
    startDate: "2022-04-05",
    endDate: "2052-04-05",
    status: "active",
  },
];

export const NOTIFICATIONS = [
  {
    id: "ntf_001",
    type: "credit",
    title: "Transfer Received",
    message: "You received $1,500.00 from Bank of America.",
    date: "2025-06-05",
    read: false,
  },
  {
    id: "ntf_002",
    type: "alert",
    title: "Login from New Device",
    message: "A new login was detected from Chrome on Windows.",
    date: "2025-09-21",
    read: false,
  },
  {
    id: "ntf_003",
    type: "info",
    title: "Statement Ready",
    message: "Your August 2025 account statement is ready to view.",
    date: "2025-09-01",
    read: true,
  },
  {
    id: "ntf_004",
    type: "debit",
    title: "Debit Alert",
    message: "A debit of $20,000.00 was made from your account.",
    date: "2025-09-20",
    read: true,
  },
];

export const QUICK_ACTIONS = [
  { id: "account-info", label: "Account Info",  icon: "account" },
  { id: "transfer",     label: "Transfer",       icon: "transfer" },
  { id: "card",         label: "Card",           icon: "card" },
  { id: "statement",    label: "Statement",      icon: "statement" },
];

export const NAV_ITEMS = [
  { id: "dashboard",  label: "Dashboard",  icon: "dashboard",  path: "dashboard" },
  {
    id: "security", label: "Security", icon: "security", path: "security",
    sub: [
      { id: "change-password", label: "Change Password", path: "change-password" },
      { id: "two-factor",      label: "2FA Settings",    path: "two-factor" },
    ],
  },
  {
    id: "transfer", label: "Transfer", icon: "transfer", path: "transfer",
    sub: [
      { id: "send",    label: "Send Money",    path: "send" },
      { id: "receive", label: "Receive Money", path: "receive" },
      { id: "history", label: "Transfer History", path: "transfer-history" },
    ],
  },
  {
    id: "monetary", label: "Monetary", icon: "monetary", path: "monetary",
    sub: [
      { id: "deposit",    label: "Deposit",    path: "deposit" },
      { id: "withdrawal", label: "Withdrawal", path: "withdrawal" },
    ],
  },
  {
    id: "loan", label: "Loan", icon: "loan", path: "loan",
    sub: [
      { id: "my-loans",  label: "My Loans",   path: "my-loans" },
      { id: "apply",     label: "Apply",       path: "apply-loan" },
    ],
  },
  {
    id: "account", label: "Account", icon: "account", path: "account",
    sub: [
      { id: "profile",    label: "Profile",    path: "profile" },
      { id: "card",       label: "Cards",      path: "cards" },
      { id: "statement",  label: "Statement",  path: "statement" },
      { id: "settings",   label: "Settings",   path: "settings" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────
export function fmt(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2 }).format(amount);
}

export function fmtDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}