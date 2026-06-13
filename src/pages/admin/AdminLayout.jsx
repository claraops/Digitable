import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { 
  LayoutDashboard, Utensils, Menu as MenuIcon,
  Table as TableIcon, Users, ShoppingBag, Star,
  Settings, LogOut, X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import logoImage from '../../assets/logo.webp';

const adminNavItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/plats', label: 'Plats', icon: Utensils },
  { path: '/admin/menus', label: 'Menus', icon: MenuIcon },
  { path: '/admin/tables', label: 'Tables', icon: TableIcon },
  { path: '/admin/commandes', label: 'Commandes', icon: ShoppingBag },
  { path: '/admin/utilisateurs', label: 'Utilisateurs', icon: Users },
  { path: '/admin/avis', label: 'Avis', icon: Star },
  { path: '/admin/settings', label: 'Paramètres', icon: Settings },
];

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          const role = userData.role || userData.authorities?.[0];
          const hasAdminRole = role === 'ADMIN' || role === 'ROLE_ADMIN';
          
          if (!hasAdminRole) {
            toast.error('Accès non autorisé.');
            navigate('/');
          } else {
            setIsAdmin(true);
          }
        } catch (e) {
          navigate('/');
        }
      } else {
        toast.error('Veuillez vous connecter');
        navigate('/login');
      }
    };

    if (!loading) {
      checkAdmin();
    }
  }, [loading, navigate]);

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const closeMobile = () => setMobileOpen(false);
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-100">
      <div className="md:flex">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-200 p-3 sm:p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
            <span className="font-bold">Menu<span className="text-gold/80">Admin</span></span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg bg-gray-100 p-2 text-black hover:bg-gold/20 transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-black-deep text-white transform transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-lg`}>
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 border border-white/20 flex-shrink-0">
              <img src={logoImage} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold">Menu<span className="text-gold/80">Admin</span></span>
          </div>

          <nav className="mt-4">
            {adminNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 transition-colors text-sm ${
                    isActive 
                      ? 'bg-gray-800 text-white font-semibold border-r-2 border-gold' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
            
            <button
              onClick={() => { handleLogout(); closeMobile(); }}
              className="w-full flex items-center gap-3 px-6 py-3 mt-4 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-sm"
            >
              <LogOut size={18} />
              <span>Déconnexion</span>
            </button>
          </nav>
        </aside>

        {/* Mobile Overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={closeMobile} />
        )}

        {/* Main Content */}
        <main className="flex-1 w-full min-w-0 md:ml-64">
          {/* Top navbar */}
          <div className="bg-white border-b border-gray-200">
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Administration</p>
                <h1 className="text-lg font-semibold text-gray-900 mt-0.5">Bienvenue, {user?.prenom || user?.nom || 'Admin'}</h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center text-gold font-bold text-sm">
                  {user?.prenom?.[0] || user?.nom?.[0] || 'A'}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.prenom || 'Admin'} {user?.nom || ''}</p>
                  <p className="text-xs text-gray-400">Connecte</p>
                </div>
              </div>
            </div>
          </div>

          {/* Page content */}
          <div className="p-6">
            <div className="bg-white rounded-2xl shadow-sm border-2 border-black-deep/15 p-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
