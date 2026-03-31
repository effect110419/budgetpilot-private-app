import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { BudgetDataProvider } from './data/BudgetDataContext'
import AppLayout from './components/AppLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import OperationsPage from './pages/OperationsPage'
import BudgetsPage from './pages/BudgetsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import IncomeDetailPage from './pages/IncomeDetailPage'
import ExpenseDetailPage from './pages/ExpenseDetailPage'
import BalanceDetailPage from './pages/BalanceDetailPage'
import AccountPage from './pages/AccountPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BudgetDataProvider>
          <Routes>
            <Route path="login" element={<LoginPage />} />
            <Route element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="operations" element={<OperationsPage />} />
              <Route path="budgets" element={<BudgetsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="income" element={<IncomeDetailPage />} />
              <Route path="expense" element={<ExpenseDetailPage />} />
              <Route path="balance" element={<BalanceDetailPage />} />
              <Route path="account" element={<AccountPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BudgetDataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
