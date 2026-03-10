
import { useState } from "react";
import DashboardLayout from "./Dashboardlayout.jsx";
import DashboardHome from "./Dashboardhome.jsx";
import { SendMoney, ReceiveMoney, TransferHistory } from "./Transfer.jsx";
import { Deposit, Withdrawal } from "./Monetary.jsx";
import { MyLoans, ApplyLoan } from "./Loans.jsx";
import { Profile, AccountInfo, Statement, Settings, Security } from "./Account.jsx";
import CardsPage from "./Cards.jsx";
import { useDashboardData } from "./mockData.js";

// ─── Single data context passed to every page as props ────────────
function PageRenderer({ page, onNavigate, data }) {
  const props = { onNavigate, ...data };
  switch (page) {
    case "dashboard":        return <DashboardHome       {...props} />;
    case "send":             return <SendMoney           {...props} />;
    case "receive":          return <ReceiveMoney        {...props} />;
    case "transfer-history": return <TransferHistory     {...props} />;
    case "deposit":          return <Deposit             {...props} />;
    case "withdrawal":       return <Withdrawal          {...props} />;
    case "my-loans":         return <MyLoans             {...props} />;
    case "apply-loan":       return <ApplyLoan           {...props} />;
    case "profile":          return <Profile             {...props} />;
    case "account-info":     return <AccountInfo         {...props} />;
    case "cards":            return <CardsPage           {...props} />;
    case "statement":        return <Statement           {...props} />;
    case "settings":         return <Settings            {...props} />;
    case "security":
    case "change-password":
    case "two-factor":       return <Security            {...props} />;
    default:                 return <DashboardHome       {...props} />;
  }
}

export default function Dashboard() {
  const [page, setPage] = useState("dashboard");
  const data = useDashboardData(); // ← single call, all components share this

  if (!data.authReady) {
    // Waiting for Firebase auth to resolve
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-[#1a1a5e] border-t-transparent animate-spin" />
          <p className="text-gray-400 text-sm font-semibold">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout activePage={page} onNavigate={setPage} data={data}>
      <PageRenderer page={page} onNavigate={setPage} data={data} />
    </DashboardLayout>
  );
}