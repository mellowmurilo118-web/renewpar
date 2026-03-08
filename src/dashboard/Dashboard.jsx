import { useState } from "react";

import { SendMoney, ReceiveMoney, TransferHistory } from "./Transfer.jsx";
import { Deposit, Withdrawal } from "./Monetary.jsx";
import { MyLoans, ApplyLoan } from "./Loans.jsx";
import { Profile, AccountInfo, Statement, Settings, Security } from "./Account.jsx";
import CardsPage from "./Cards.jsx";
import DashboardHome from "./Dashboardhome.jsx";
import DashboardLayout from "./Dashboardlayout.jsx";



// Map path strings → components
function PageRenderer({ page, onNavigate }) {
  const props = { onNavigate };
  switch (page) {
    case "dashboard":        return <DashboardHome {...props} />;
    // Transfer
    case "send":             return <SendMoney {...props} />;
    case "receive":          return <ReceiveMoney {...props} />;
    case "transfer-history": return <TransferHistory {...props} />;
    // Monetary
    case "deposit":          return <Deposit {...props} />;
    case "withdrawal":       return <Withdrawal {...props} />;
    // Loans
    case "my-loans":         return <MyLoans {...props} />;
    case "apply-loan":       return <ApplyLoan {...props} />;
    // Account
    case "profile":          return <Profile {...props} />;
    case "account-info":     return <AccountInfo {...props} />;
    case "cards":            return <CardsPage {...props} />;
    case "statement":        return <Statement {...props} />;
    case "settings":         return <Settings {...props} />;
    case "security":
    case "change-password":
    case "two-factor":       return <Security {...props} />;
    // Fallback
    default: return <DashboardHome {...props} />;
  }
}

export default function Dashboard() {
  const [page, setPage] = useState("dashboard");

  return (
    <DashboardLayout activePage={page} onNavigate={setPage}>
      <PageRenderer page={page} onNavigate={setPage} />
    </DashboardLayout>
  );
}