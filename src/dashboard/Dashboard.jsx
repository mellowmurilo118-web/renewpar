import { useState } from "react";
import DashboardLayout from "./Dashboardlayout.jsx";
import DashboardHome from "./Dashboardhome.jsx";
import { SendMoney, ReceiveMoney, TransferHistory } from "./Transfer.jsx";
import { Deposit, Withdrawal } from "./Monetary.jsx";
import { MyLoans, ApplyLoan } from "./Loans.jsx";
import { Profile, AccountInfo, Statement, Settings, Security } from "./Account.jsx";
import CardsPage from "./Cards.jsx";
import { useDashboardData } from "./mockData.js";

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
  const data = useDashboardData();

  // Render layout immediately — let pages handle their own loading states
  // Don't block on authReady to avoid iOS Firebase init delays
  return (
    <DashboardLayout activePage={page} onNavigate={setPage} data={data}>
      <PageRenderer page={page} onNavigate={setPage} data={data} />
    </DashboardLayout>
  );
}