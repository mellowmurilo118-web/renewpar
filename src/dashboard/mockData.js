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
  {
    id: "txn_001",
    account: "1042054190",
    description: "Outgoing Wire Transfer",
    amount: -20000.00,
    type: "debit",
    category: "Transfer",
    date: "2025-09-20",
    time: "11:14:21",
    status: "completed",
    reference: "WTF2025092001",
    recipient: "James Whitfield",
    recipientBank: "Chase Bank",
  },
  {
    id: "txn_002",
    account: "1042054190",
    description: "Initial Deposit",
    amount: 10200000.00,
    type: "credit",
    category: "Deposit",
    date: "2018-09-20",
    time: "10:58:59",
    status: "completed",
    reference: "DEP2018092001",
    recipient: "Self",
    recipientBank: "Renew Part Bank",
  },
  {
    id: "txn_003",
    account: "1042054190",
    description: "ATM Withdrawal",
    amount: -500.00,
    type: "debit",
    category: "Withdrawal",
    date: "2025-08-14",
    time: "09:32:10",
    status: "completed",
    reference: "ATM2025081401",
    recipient: "ATM #4421",
    recipientBank: "Renew Part Bank",
  },
  {
    id: "txn_004",
    account: "1042054190",
    description: "Salary Credit",
    amount: 7500.00,
    type: "credit",
    category: "Income",
    date: "2025-07-31",
    time: "08:00:00",
    status: "completed",
    reference: "SAL2025073101",
    recipient: "Self",
    recipientBank: "Wells Fargo",
  },
  {
    id: "txn_005",
    account: "1042054190",
    description: "Utility Bill Payment",
    amount: -230.50,
    type: "debit",
    category: "Bills",
    date: "2025-07-18",
    time: "14:22:33",
    status: "completed",
    reference: "BILL202507180",
    recipient: "Con Edison",
    recipientBank: "N/A",
  },
  {
    id: "txn_006",
    account: "1042054190",
    description: "Online Transfer Received",
    amount: 1500.00,
    type: "credit",
    category: "Transfer",
    date: "2025-06-05",
    time: "16:45:00",
    status: "completed",
    reference: "TRF2025060501",
    recipient: "Self",
    recipientBank: "Bank of America",
  },
];

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