// src/pages/admin/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, ListChecks, Table, ShoppingBag, Users } from 'lucide-react';
import { platService } from '../../services/platService';
import { menuService } from '../../services/menuService';
import { tablesService } from '../../services/tablesService';
import { commandeService } from '../../services/commandeService';
import { utilisateurService } from '../../services/utilisateurService';

export default function Dashboard() {
  const [stats, setStats] = useState({ plats: 0, menus: 0, tables: 0, commandes: 0, utilisateurs: 0 });
  const [recentCommandes, setRecentCommandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // ✅ Exécuter les appels individuellement avec gestion d'erreur
        let plats = [], menus = [], tables = [], commandes = [], utilisateurs = [];
        
        try {
          const res = await platService.getAll();
          plats = Array.isArray(res.data) ? res.data : [];
        } catch (e) { console.warn('Plats:', e.message); }
        
        try {
          const res = await menuService.getAll();
          menus = Array.isArray(res.data) ? res.data : [];
        } catch (e) { console.warn('Menus:', e.message); }
        
        try {
          const res = await tablesService.getAll();
          tables = Array.isArray(res.data) ? res.data : [];
        } catch (e) { console.warn('Tables:', e.message); }
        
        try {
          const res = await commandeService.getAll();
          commandes = Array.isArray(res.data) ? res.data : [];
        } catch (e) { 
          console.warn('Commandes (admin) - Peut être normal si pas de données:', e.message);
          commandes = [];
        }
        
        try {
          const res = await utilisateurService.getAll();
          utilisateurs = Array.isArray(res.data) ? res.data : [];
        } catch (e) { console.warn('Utilisateurs:', e.message); }

        setStats({
          plats: plats.length,
          menus: menus.length,
          tables: tables.length,
          commandes: commandes.length,
          utilisateurs: utilisateurs.length,
        });

        setRecentCommandes(commandes.slice(0, 5));
      } catch (error) {
        console.error('Erreur globale:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const cards = [
    { label: 'Plats', value: stats.plats, icon: BarChart3, color: 'bg-gold text-black-deep' },
    { label: 'Menus', value: stats.menus, icon: ListChecks, color: 'bg-blue-500 text-white-pure' },
    { label: 'Tables', value: stats.tables, icon: Table, color: 'bg-green-500 text-white-pure' },
    { label: 'Commandes', value: stats.commandes, icon: ShoppingBag, color: 'bg-purple-500 text-white-pure' },
    { label: 'Utilisateurs', value: stats.utilisateurs, icon: Users, color: 'bg-black-deep text-white-pure' },
  ];

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Tableau de bord</h1>
          <p className="text-gray-dark text-xs sm:text-sm">
            Suivez l'activité globale et gérez les données du restaurant.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Link to="/admin/plats" className="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-3">
            Voir les plats
          </Link>
          <Link to="/admin/commandes" className="btn-secondary text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-3">
            Voir les commandes
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm bg-white-pure">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <p className="text-xs uppercase tracking-wider text-gray-dark">{card.label}</p>
              <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${card.color}`}>
                <card.icon size={16} className="sm:w-5 sm:h-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              {loading ? '...' : card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Orders */}
        <div className="bg-white-pure rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Commandes récentes</h2>
          <div className="space-y-2 sm:space-y-3">
            {loading ? (
              <p className="text-gray-dark text-sm">Chargement...</p>
            ) : recentCommandes.length === 0 ? (
              <p className="text-gray-dark text-sm">Aucune commande récente.</p>
            ) : (
              recentCommandes.map((cmd) => (
                <div key={cmd.idCommande} className="border border-gray-light rounded-xl sm:rounded-2xl p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                    <p className="font-semibold text-xs sm:text-sm">
                      #{cmd.idCommande} - {cmd.numeroCommande}
                    </p>
                    <span className="text-xs text-gray-dark">
                      {new Date(cmd.dateCommande).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-dark mb-2">
                    Client: {cmd.utilisateurPrenom} {cmd.utilisateurNom}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                    <span className="font-semibold">Total: {cmd.montantTotal?.toFixed(2)} €</span>
                    <span className="text-gold">{cmd.statut}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white-pure rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Actions rapides</h2>
          <div className="space-y-2 sm:space-y-3">
            <Link to="/admin/plats" className="rounded-xl sm:rounded-2xl border border-gray-light p-3 sm:p-4 hover:bg-gray-light transition-colors block">
              <p className="text-sm sm:text-base font-semibold">Gérer les plats</p>
              <p className="text-gray-dark text-xs sm:text-sm">Ajoutez, modifiez ou supprimez des plats.</p>
            </Link>
            <Link to="/admin/menus" className="rounded-xl sm:rounded-2xl border border-gray-light p-3 sm:p-4 hover:bg-gray-light transition-colors block">
              <p className="text-sm sm:text-base font-semibold">Gérer les menus</p>
              <p className="text-gray-dark text-xs sm:text-sm">Créez et modifiez des menus.</p>
            </Link>
            <Link to="/admin/utilisateurs" className="rounded-xl sm:rounded-2xl border border-gray-light p-3 sm:p-4 hover:bg-gray-light transition-colors block">
              <p className="text-sm sm:text-base font-semibold">Gérer les utilisateurs</p>
              <p className="text-gray-dark text-xs sm:text-sm">Consultez et modifiez les comptes.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
