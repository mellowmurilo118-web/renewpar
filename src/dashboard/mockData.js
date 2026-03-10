// ─────────────────────────────────────────────────────────────────
// mockData.js  —  Renew Part Bank Dashboard Data
//
// DEMO MODE:
//   Only the email matching DEMO_EMAIL gets mock data.
//   All other logged-in users get real Firestore data (or nulls
//   while it loads). Auth is checked reactively via onAuthStateChanged
//   so the check never runs before Firebase is ready.
//
// ── Change the demo account email here: ──────────────────────────
export const DEMO_EMAIL = "ellianawilson98@gmail.com";
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect }                                from "react";
import { onAuthStateChanged }                                 from "firebase/auth";
import { doc, getDoc, collection, getDocs, orderBy, query }  from "firebase/firestore";
import { auth, db }                                          from "../utils/firebase/firebase";

// ─────────────────────────────────────────────────────────────────
// MOCK DATA  (only served to DEMO_EMAIL)
// ─────────────────────────────────────────────────────────────────

const MOCK_USER = {
  uid: "usr_001",
  firstName: "Elliana",
  lastName: "Wilson",
  email: "elliana.wilson@email.com",
  phone: "+1 (555) 204-8811",
  avatar: "/profile.jpg",
  dob: "1990-04-15",
  gender: "Female",
  religion: "Christianity",
  address: "47 Maple Ridge Avenue, Apt 3B",
  city: "New York",
  state: "NY",
  zipcode: "10021",
  country: "United States",
  joinDate: "2018-09-20",
  kycStatus: "verified",
};

const MOCK_ACCOUNT = {
  id: "acc_001",
  accountNumber: "1042054190",
  routingNumber: "021000021",
  type: "Personal Checking",
  currency: "USD",
  balance: 10200000.00,
  btcBalance: 0.0000000,
  btcUsd: 0.00,
  status: "active",
  iban: "US29NWBK60161331926819",
  swift: "RENEWUS33",
  openedDate: "2018-09-20",
};

const MOCK_TRANSACTIONS = [
  { id:"txn_001", account:"1042054190", description:"Initial Wire Deposit",       amount: 5000000.00, type:"credit", category:"Deposit",    date:"2019-03-12", time:"10:15:44", status:"completed", reference:"DEP2019031201", recipient:"Self",           recipientBank:"Renew Part Bank"     },
  { id:"txn_002", account:"1042054190", description:"Utility Bill Payment",        amount:    -230.50, type:"debit",  category:"Bills",      date:"2019-06-18", time:"14:22:33", status:"completed", reference:"BILL201906180", recipient:"Con Edison",      recipientBank:"N/A"                 },
  { id:"txn_003", account:"1042054190", description:"Business Investment Credit",  amount: 2500000.00, type:"credit", category:"Deposit",    date:"2020-02-05", time:"09:00:00", status:"completed", reference:"DEP2020020501", recipient:"Self",           recipientBank:"Goldman Sachs"       },
  { id:"txn_004", account:"1042054190", description:"ATM Withdrawal",              amount:    -500.00, type:"debit",  category:"Withdrawal", date:"2020-08-22", time:"09:32:10", status:"completed", reference:"ATM2020082201", recipient:"ATM #4421",      recipientBank:"Renew Part Bank"     },
  { id:"txn_005", account:"1042054190", description:"Real Estate Proceeds",        amount: 1800000.00, type:"credit", category:"Deposit",    date:"2021-04-30", time:"11:48:02", status:"completed", reference:"DEP2021043001", recipient:"Self",           recipientBank:"JPMorgan Chase"      },
  { id:"txn_006", account:"1042054190", description:"Portfolio Dividend Payout",   amount:  750000.00, type:"credit", category:"Income",     date:"2022-01-17", time:"08:30:00", status:"completed", reference:"DIV2022011701", recipient:"Self",           recipientBank:"Fidelity Investments" },
  { id:"txn_007", account:"1042054190", description:"Outgoing Wire Transfer",      amount:  -20000.00, type:"debit",  category:"Transfer",   date:"2022-09-14", time:"11:14:21", status:"completed", reference:"WTF2022091401", recipient:"James Whitfield",recipientBank:"Chase Bank"          },
  { id:"txn_008", account:"1042054190", description:"Online Transfer Received",    amount:  170730.50, type:"credit", category:"Transfer",   date:"2023-05-09", time:"16:45:00", status:"completed", reference:"TRF2023050901", recipient:"Self",           recipientBank:"Bank of America"     },
];

const MOCK_CARDS = [
  { id:"card_001", type:"Visa",       label:"Primary Debit Card",    holder:"ELLIANA WILSON", number:"4532 •••• •••• 7821", numberFull:"4532187645627821", expiry:"09/28", cvv:"•••", color:["#1a1a5e","#2a3aa0"],  status:"active", limit:50000,  spent:20500, contactless:true,  virtual:false },
  { id:"card_002", type:"Mastercard", label:"Business Credit Card",  holder:"ELLIANA WILSON", number:"5412 •••• •••• 3306", numberFull:"5412783920443306", expiry:"12/27", cvv:"•••", color:["#c8a951","#a07820"],  status:"active", limit:100000, spent:34200, contactless:true,  virtual:false },
  { id:"card_003", type:"Visa",       label:"Virtual Card",          holder:"ELLIANA WILSON", number:"4916 •••• •••• 0044", numberFull:"4916223300440044", expiry:"03/26", cvv:"•••", color:["#1a6e4a","#2aa070"],  status:"frozen", limit:5000,   spent:120,   contactless:false, virtual:true  },
];

const MOCK_LOANS = [
  { id:"loan_001", type:"Personal Loan",  amount:50000,  outstanding:32400,  monthlyPayment:980,  interestRate:6.5, nextPaymentDate:"2026-04-01", startDate:"2023-04-01", endDate:"2028-04-01", status:"active" },
  { id:"loan_002", type:"Home Mortgage",  amount:450000, outstanding:398000, monthlyPayment:2340, interestRate:4.2, nextPaymentDate:"2026-04-05", startDate:"2022-04-05", endDate:"2052-04-05", status:"active" },
];

const MOCK_NOTIFICATIONS = [
  { id:"ntf_001", type:"credit", title:"Transfer Received",       message:"You received $1,500.00 from Bank of America.",             date:"2025-06-05", read:false },
  { id:"ntf_002", type:"alert",  title:"Login from New Device",   message:"A new login was detected from Chrome on Windows.",         date:"2025-09-21", read:false },
  { id:"ntf_003", type:"info",   title:"Statement Ready",         message:"Your August 2025 account statement is ready to view.",     date:"2025-09-01", read:true  },
  { id:"ntf_004", type:"debit",  title:"Debit Alert",             message:"A debit of $20,000.00 was made from your account.",        date:"2025-09-20", read:true  },
];

// ─────────────────────────────────────────────────────────────────
// NULL DEFAULTS  — shown while Firestore loads for real users
// ─────────────────────────────────────────────────────────────────
const NULL_USER = {
  uid:null, firstName:"", lastName:"", email:"", phone:"", avatar:"",
  dob:"", gender:"", religion:"", address:"", city:"", state:"",
  zipcode:"", country:"", joinDate:"", kycStatus:"pending",
};

const NULL_ACCOUNT = {
  id:null, accountNumber:"––––––––", routingNumber:"–––––––––",
  type:"Personal Checking", currency:"USD", balance:0.00,
  btcBalance:0.00, btcUsd:0.00, status:"active",
  iban:"––––––––––––––––", swift:"––––––––", openedDate:"",
};

// ─────────────────────────────────────────────────────────────────
// useDashboardData()
//
// Waits for onAuthStateChanged before deciding demo vs real.
// Demo email  → mock data instantly, no Firestore reads.
// Other email → Firestore reads; nulls shown while loading.
// Not signed in → all nulls.
// ─────────────────────────────────────────────────────────────────
export function useDashboardData() {
  const [authReady,     setAuthReady]     = useState(false);
  const [isDemo,        setIsDemo]        = useState(false);
  const [loading,       setLoading]       = useState(true);

  const [user,          setUser]          = useState(NULL_USER);
  const [account,       setAccount]       = useState(NULL_ACCOUNT);
  const [transactions,  setTransactions]  = useState([]);
  const [cards,         setCards]         = useState([]);
  const [loans,         setLoans]         = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Step 1 — wait for Firebase auth to resolve
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        // Not signed in — clear everything
        setUser(NULL_USER);
        setAccount(NULL_ACCOUNT);
        setTransactions([]);
        setCards([]);
        setLoans([]);
        setNotifications([]);
        setIsDemo(false);
        setLoading(false);
        setAuthReady(true);
        return;
      }

      const email = firebaseUser.email?.toLowerCase() ?? "";
      const demo  = email === DEMO_EMAIL.toLowerCase();
      setIsDemo(demo);

      if (demo) {
        // ── Demo user: serve mock data, skip Firestore ──────────
        setUser(MOCK_USER);
        setAccount(MOCK_ACCOUNT);
        setTransactions(MOCK_TRANSACTIONS);
        setCards(MOCK_CARDS);
        setLoans(MOCK_LOANS);
        setNotifications(MOCK_NOTIFICATIONS);
        setLoading(false);
        setAuthReady(true);
        return;
      }

      // ── Real user: read from Firestore ──────────────────────
      const uid = firebaseUser.uid;
      try {
        // User profile
        const userSnap = await getDoc(doc(db, "users", uid));
        if (userSnap.exists()) setUser({ uid, ...userSnap.data() });

        // Account
        const accSnap = await getDoc(doc(db, "accounts", uid));
        if (accSnap.exists()) setAccount(accSnap.data());

        // Transactions
        const txSnap = await getDocs(
          query(collection(db, "accounts", uid, "transactions"), orderBy("date", "desc"))
        );
        setTransactions(txSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // Cards
        const cardSnap = await getDocs(collection(db, "accounts", uid, "cards"));
        setCards(cardSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // Loans
        const loanSnap = await getDocs(collection(db, "accounts", uid, "loans"));
        setLoans(loanSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // Notifications
        const notifSnap = await getDocs(
          query(collection(db, "users", uid, "notifications"), orderBy("date", "desc"))
        );
        setNotifications(notifSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      } catch (err) {
        console.error("Firestore load error:", err);
      } finally {
        setLoading(false);
        setAuthReady(true);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, account, transactions, cards, loans, notifications, loading, isDemo, authReady };
}

// ─────────────────────────────────────────────────────────────────
// STATIC UI CONFIG  (same for all users)
// ─────────────────────────────────────────────────────────────────

export const QUICK_ACTIONS = [
  { id: "account-info", label: "Account Info", icon: "account"   },
  { id: "transfer",     label: "Transfer",     icon: "transfer"  },
  { id: "card",         label: "Card",         icon: "card"      },
  { id: "statement",    label: "Statement",    icon: "statement" },
];

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard", path: "dashboard" },
  {
    id: "security", label: "Security", icon: "security", path: "security",
    sub: [
      { id: "change-password", label: "Change Password", path: "change-password" },
      { id: "two-factor",      label: "2FA Settings",    path: "two-factor"      },
    ],
  },
  {
    id: "transfer", label: "Transfer", icon: "transfer", path: "transfer",
    sub: [
      { id: "send",    label: "Send Money",       path: "send"             },
      { id: "receive", label: "Receive Money",    path: "receive"          },
      { id: "history", label: "Transfer History", path: "transfer-history" },
    ],
  },
  {
    id: "monetary", label: "Monetary", icon: "monetary", path: "monetary",
    sub: [
      { id: "deposit",    label: "Deposit",    path: "deposit"    },
      { id: "withdrawal", label: "Withdrawal", path: "withdrawal" },
    ],
  },
  {
    id: "loan", label: "Loan", icon: "loan", path: "loan",
    sub: [
      { id: "my-loans", label: "My Loans", path: "my-loans"   },
      { id: "apply",    label: "Apply",    path: "apply-loan" },
    ],
  },
  {
    id: "account", label: "Account", icon: "account", path: "account",
    sub: [
      { id: "profile",   label: "Profile",   path: "profile"   },
      { id: "card",      label: "Cards",     path: "cards"     },
      { id: "statement", label: "Statement", path: "statement" },
      { id: "settings",  label: "Settings",  path: "settings"  },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────
export function fmt(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency, minimumFractionDigits: 2,
  }).format(amount);
}

export function fmtDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

// Legacy named exports — kept so existing components don't break.
// These always point to mock data. Migrate to useDashboardData() over time.
export const CURRENT_USER  = MOCK_USER;
export const ACCOUNT       = MOCK_ACCOUNT;
export const TRANSACTIONS  = MOCK_TRANSACTIONS;
export const CARDS         = MOCK_CARDS;
export const LOANS         = MOCK_LOANS;
export const NOTIFICATIONS = MOCK_NOTIFICATIONS;