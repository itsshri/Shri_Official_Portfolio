import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext.jsx';
import Portfolio from './pages/Portfolio.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';

function ProtectedRoute({ children }) {
  const { isLoggedIn } = usePortfolio();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <PortfolioProvider>
        <AppRoutes />
      </PortfolioProvider>
    </BrowserRouter>
  );
}
