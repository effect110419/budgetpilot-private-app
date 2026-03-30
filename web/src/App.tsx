import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { BudgetDataProvider } from './data/BudgetDataContext'
import AppLayout from './components/AppLayout'
import DashboardPage from './pages/DashboardPage'
import OperationsPage from './pages/OperationsPage'
import BudgetsPage from './pages/BudgetsPage'
import AnalyticsPage from './pages/AnalyticsPage'

export default function App() {
  return (
    <BrowserRouter>
      <BudgetDataProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="operations" element={<OperationsPage />} />
            <Route path="budgets" element={<BudgetsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BudgetDataProvider>
    </BrowserRouter>
  )
}
