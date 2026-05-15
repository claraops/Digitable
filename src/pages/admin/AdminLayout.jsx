import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Utensils, 
  Menu as MenuIcon,
  Table as TableIcon,
  Users, 
  ShoppingBag,
  Star,
  Settings,
  LogOut,
  X,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      navigate('/');
    }
  }, [user, navigate]);

  if (user && user.role !== 'ADMIN') {
    return null;
  }

  const closeMobile = () => setMobileOpen(false);
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-light">
      <div className="md:flex">
        {/* Mobile Header */}
        <div className="md:hidden bg-white-pure border-b border-gray-light p-3 sm:p-4 flex items-center justify-between sticky top-0 z-30">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-dark mb-0.5">Admin</p>
            <h2 className="text-lg sm:text-xl font-semibold">Menu Admin</h2>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg bg-gray-light p-2 text-black-deep hover:bg-gold transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>

        {/* Sidebar */}
        <aside className={`fixed inset-y-14 left-0 z-40 w-64 bg-black-deep text-white-pure transform transition-transform duration-300 md:relative md:inset-auto md:translate-x-0 md:w-64 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-4 sm:p-6 border-b border-white/10">
            <h1 className="text-xl sm:text-2xl font-bold">
              Menu<span className="text-gold">Admin</span>
            </h1>
            <p className="text-gray-light text-xs sm:text-sm mt-2">Gestion complète</p>
          </div>

          <nav className="mt-4 sm:mt-6 overflow-y-auto max-h-[calc(100vh-120px)]">
            {adminNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 sm:px-6 py-3 transition-colors text-sm sm:text-base ${
                    isActive 
                      ? 'bg-gold text-black-deep font-semibold' 
                      : 'hover:bg-gray-dark hover:bg-opacity-20'
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
            
            <button
              onClick={() => {
                handleLogout();
                closeMobile();
              }}
              className="w-full flex items-center gap-3 px-4 sm:px-6 py-3 mt-4 text-red-400 hover:bg-gray-dark hover:bg-opacity-20 transition-colors text-sm sm:text-base"
            >
              <LogOut size={20} />
              <span>Déconnexion</span>
            </button>
          </nav>
        </aside>

        {/* Mobile Overlay */}
        {mobileOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black-deep/40 md:hidden" 
            onClick={closeMobile} 
          />
        )}

        {/* Main Content */}
        <main className="flex-1 w-full md:ml-0">
          <div className="p-3 sm:p-4 md:p-8">
            <div className="mb-6 sm:mb-8 bg-white-pure border border-gray-light rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wider text-gray-dark mb-1 sm:mb-2">Admin</p>
                <h1 className="text-2xl sm:text-3xl font-bold">Dashboard & Gestion</h1>
              </div>
              <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-gray-dark text-xs sm:text-sm">
                  Gérez les plats, menus, tables et commandes depuis un seul endroit.
                </p>
                <span className="inline-flex items-center gap-2 rounded-full bg-gray-light px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-black-deep font-medium whitespace-nowrap">
                  {user?.prenom || user?.nom || 'Admin'}
                </span>
              </div>
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}