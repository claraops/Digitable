import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import NavigationBar from './components/Layout/Navbar';
import { ErrorBoundary } from './components/Common/ErrorBoundary';

// Pages client
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import OrderTracking from './pages/OrderTracking';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import CommandesPage from './pages/CommandesPage';
import FacturesPage from './pages/FacturesPage';
import AvisPage from './pages/AvisPage';

// Pages admin
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import PlatsAdmin from './pages/admin/PlatsAdmin';
import MenusAdmin from './pages/admin/MenusAdmin';
import TablesAdmin from './pages/admin/TablesAdmin';
import CommandesAdmin from './pages/admin/CommandesAdmin';
import UtilisateursAdmin from './pages/admin/UtilisateursAdmin';
import SettingsAdmin from './pages/admin/SettingsAdmin';

const TablesPage = () => <div className="container mt-4"><h2>📋 Gestion des Tables</h2><p>Page en construction...</p></div>;
const CommanderPage = () => <div className="container mt-4"><h2>🍕 Passer une commande</h2><p>Page en construction...</p></div>;

function App() {
  return (
    <ErrorBoundary>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          {/* Routes client avec navbar */}
          <Route element={<><NavigationBar /><Outlet /></>}>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/menus" element={<Menu />} />
            <Route path="/tables" element={<TablesPage />} />
            <Route path="/commander" element={<CommanderPage />} />
            <Route path="/commandes" element={<CommandesPage />} />
            <Route path="/factures" element={<FacturesPage />} />
            <Route path="/avis" element={<AvisPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/tracking" element={<OrderTracking />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
          </Route>

          {/* Routes admin sans navbar */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="plats" element={<PlatsAdmin />} />
            <Route path="menus" element={<MenusAdmin />} />
            <Route path="tables" element={<TablesAdmin />} />
            <Route path="commandes" element={<CommandesAdmin />} />
            <Route path="utilisateurs" element={<UtilisateursAdmin />} />
            <Route path="avis" element={<AvisPage />} />
            <Route path="settings" element={<SettingsAdmin />} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;