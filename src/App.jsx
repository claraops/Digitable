import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import NavigationBar from './components/Layout/Navbar';
import { ErrorBoundary } from './components/Common/ErrorBoundary';
import { AuthProvider } from './hooks/useAuth.jsx';
import { CartProvider } from './context/CartProvider.jsx';
import { I18nProvider } from './i18n/I18nContext';


// Pages client
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import OrderTracking from './pages/OrderTracking';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import FacturesPage from './pages/MyFactures';
import AvisPage from './pages/AvisPage';
import MesCommandes from './pages/MesCommandes';
import TablesPage from './pages/Tables';
import PlatDetail from './pages/PlatDetail';
import KitchenDashboard from './pages/staff/KitchenDashboard';

// Pages admin
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import PlatsAdmin from './pages/admin/PlatsAdmin';
import MenusAdmin from './pages/admin/MenusAdmin';
import TablesAdmin from './pages/admin/TablesAdmin';
import CommandesAdmin from './pages/admin/CommandesAdmin';
import UtilisateursAdmin from './pages/admin/UtilisateursAdmin';
import SettingsAdmin from './pages/admin/SettingsAdmin';
import AdminAvisPage from './pages/admin/AvisPage';

const CommanderPage = () => <div className="container mt-4"><h2>🍕 Passer une commande</h2><p>Page en construction...</p></div>;

function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" />
          <ErrorBoundary>
          <Router>
            <Routes>
              <Route element={<><NavigationBar /><Outlet /></>}>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/tables" element={<TablesPage />} />
                <Route path="/commander" element={<CommanderPage />} />
                <Route path="/factures" element={<FacturesPage />} />
                <Route path="/avis" element={<AvisPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/tracking/:id" element={<OrderTracking />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/mes-commandes" element={<MesCommandes />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/register" element={<Auth />} />
                <Route path="/plat/:id" element={<PlatDetail />} />
                <Route path="/staff/kitchen" element={<KitchenDashboard />} />
              </Route>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="plats" element={<PlatsAdmin />} />
                <Route path="menus" element={<MenusAdmin />} />
                <Route path="tables" element={<TablesAdmin />} />
                <Route path="commandes" element={<CommandesAdmin />} />
                <Route path="utilisateurs" element={<UtilisateursAdmin />} />
                <Route path="avis" element={<AdminAvisPage />} />
                <Route path="settings" element={<SettingsAdmin />} />
              </Route>
            </Routes>
          </Router>
          </ErrorBoundary>
        </CartProvider>
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;