import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, ListChecks, Table, ShoppingBag, Users, TrendingUp, Clock, Utensils } from 'lucide-react';
import { platService } from '../../services/platService';
import { menuService } from '../../services/menuService';
import { tablesService } from '../../services/tablesService';
import { commandeService } from '../../services/commandeService';
import { utilisateurService } from '../../services/utilisateurService';
import { useAuth } from '../../hooks/useAuth';

const STATUS_LABELS = {
  'EN_ATTENTE': { label: 'En attente', class: 'bg-amber-100 text-amber-700' },
  'EN_PREPARATION': { label: 'En préparation', class: 'bg-sky-100 text-sky-700' },
  'PRETE': { label: 'Prête', class: 'bg-yellow-100 text-yellow-700' },
  'SERVIE': { label: 'Servie', class: 'bg-emerald-100 text-emerald-700' },
  'PAYEE': { label: 'Payée', class: 'bg-teal-100 text-teal-700' },
  'ANNULEE': { label: 'Annulée', class: 'bg-rose-100 text-rose-600' }
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ plats: 0, menus: 0, tables: 0, commandes: 0, utilisateurs: 0 });
  const [recentCommandes, setRecentCommandes] = useState([]);
  const [weeklyOrders, setWeeklyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        let plats = [], menus = [], tables = [], commandes = [], utilisateurs = [];

        try { const res = await platService.getAll(); plats = Array.isArray(res.data) ? res.data : []; } catch (e) { console.warn('Plats:', e.message); }
        try { const res = await menuService.getAll(); menus = Array.isArray(res.data) ? res.data : []; } catch (e) { console.warn('Menus:', e.message); }
        try { const res = await tablesService.getAll(); tables = Array.isArray(res.data) ? res.data : []; } catch (e) { console.warn('Tables:', e.message); }
        try {
          const res = await commandeService.getAll();
          commandes = Array.isArray(res.data) ? res.data : [];
        } catch (e) { console.warn('Commandes:', e.message); commandes = []; }
        try { const res = await utilisateurService.getAll(); utilisateurs = Array.isArray(res.data) ? res.data : []; } catch (e) { console.warn('Utilisateurs:', e.message); }

        setStats({
          plats: plats.length, menus: menus.length, tables: tables.length,
          commandes: commandes.length, utilisateurs: utilisateurs.length,
        });

        setRecentCommandes(commandes.slice(0, 5));

        const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        const today = new Date();
        const dailyCounts = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          const count = commandes.filter(c => c.dateCommande && c.dateCommande.startsWith(dateStr)).length;
          dailyCounts.push({ label: dayNames[d.getDay()], count, date: dateStr });
        }
        setWeeklyOrders(dailyCounts);
      } catch (error) {
        console.error('Erreur globale:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const statCards = [
    { label: 'Plats', value: stats.plats, icon: BarChart3, change: '+2 cette semaine' },
    { label: 'Menus', value: stats.menus, icon: ListChecks, change: '0 cette semaine' },
    { label: 'Tables', value: stats.tables, icon: Table, change: `${stats.tables} disponibles` },
    { label: 'Commandes', value: stats.commandes, icon: ShoppingBag, change: `${stats.commandes} totales` },
    { label: 'Clients', value: stats.utilisateurs, icon: Users, change: '+5 cette semaine' },
  ];

  const weeklyTotal = weeklyOrders.reduce((sum, d) => sum + d.count, 0);
  const maxCount = Math.max(...weeklyOrders.map(d => d.count), 1);

  return (
    <div className="space-y-6">

      {/* Top bar: connected user */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold font-bold text-sm">
            {user?.prenom?.[0] || user?.nom?.[0] || 'A'}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{user?.prenom || 'Admin'} {user?.nom || ''}</p>
            <p className="text-xs text-gray-400">Administrateur</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1.5"><Clock size={14} />{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          <span className="w-px h-4 bg-gray-200" />
          <span className="flex items-center gap-1.5"><TrendingUp size={14} className="text-emerald-500" />{weeklyTotal} commandes cette semaine</span>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, i) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{card.label}</p>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                i === 0 ? 'bg-gold/10 text-gold' :
                i === 1 ? 'bg-blue-50 text-blue-500' :
                i === 2 ? 'bg-purple-50 text-purple-500' :
                i === 3 ? 'bg-emerald-50 text-emerald-500' :
                'bg-amber-50 text-amber-500'
              }`}>
                <card.icon size={18} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{loading ? '...' : card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.change}</p>
          </div>
        ))}
      </div>

      {/* Weekly chart + Recent orders row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Weekly orders chart */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-800">Commandes hebdomadaires</h2>
            <span className="text-xs font-semibold text-gold bg-gold/10 px-2.5 py-1 rounded-full">{weeklyTotal} cette semaine</span>
          </div>
          {loading ? (
            <p className="text-gray-400 text-sm">Chargement...</p>
          ) : (
            <div className="flex items-end gap-2 h-44">
              {weeklyOrders.map((day) => {
                const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                return (
                  <div key={day.date} className="flex flex-col items-center gap-1.5 flex-1">
                    <span className="text-xs font-bold text-gray-500">{day.count}</span>
                    <div className="w-full bg-gray-100 rounded-lg relative" style={{ height: '120px' }}>
                      <div
                        className="absolute bottom-0 w-full rounded-lg bg-gradient-to-t from-gold to-yellow-300 transition-all duration-500"
                        style={{ height: `${Math.max(height, 2)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{day.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-800">Commandes recentes</h2>
            <Link to="/admin/commandes" className="text-xs font-semibold text-gold hover:text-gold/70 transition-colors">Voir tout</Link>
          </div>
          {loading ? (
            <p className="text-gray-400 text-sm">Chargement...</p>
          ) : recentCommandes.length === 0 ? (
            <div className="text-center py-10">
              <ShoppingBag size={32} className="text-gray-200 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Aucune commande recente</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left pb-3 font-semibold text-gray-400 text-xs uppercase tracking-wider">Commande</th>
                    <th className="text-left pb-3 font-semibold text-gray-400 text-xs uppercase tracking-wider">Client</th>
                    <th className="text-left pb-3 font-semibold text-gray-400 text-xs uppercase tracking-wider">Date</th>
                    <th className="text-left pb-3 font-semibold text-gray-400 text-xs uppercase tracking-wider">Statut</th>
                    <th className="text-right pb-3 font-semibold text-gray-400 text-xs uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCommandes.map((cmd) => {
                    const statusConfig = STATUS_LABELS[cmd.statut] || { label: cmd.statut, class: 'bg-gray-100 text-gray-600' };
                    return (
                      <tr key={cmd.idCommande} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 font-semibold text-gray-800">#{cmd.idCommande}</td>
                        <td className="py-3 text-gray-500">{cmd.utilisateurPrenom || '?'} {cmd.utilisateurNom || ''}</td>
                        <td className="py-3 text-gray-400">{cmd.dateCommande ? new Date(cmd.dateCommande).toLocaleDateString('fr-FR') : '-'}</td>
                        <td className="py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.class}`}>{statusConfig.label}</span></td>
                        <td className="py-3 text-right font-bold text-gray-800">{cmd.montantTotal?.toFixed(2) || '0.00'} &euro;</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-base font-bold text-gray-800 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link to="/admin/plats" className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gold/10 border border-gray-100 hover:border-gold/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center"><Utensils size={18} className="text-gold" /></div>
            <div><p className="font-semibold text-sm text-gray-800">Gerer les plats</p><p className="text-xs text-gray-400">Ajouter, modifier, supprimer</p></div>
          </Link>
          <Link to="/admin/menus" className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gold/10 border border-gray-100 hover:border-gold/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><ListChecks size={18} className="text-blue-500" /></div>
            <div><p className="font-semibold text-sm text-gray-800">Gerer les menus</p><p className="text-xs text-gray-400">Creer des combinaisons</p></div>
          </Link>
          <Link to="/admin/utilisateurs" className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gold/10 border border-gray-100 hover:border-gold/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center"><Users size={18} className="text-purple-500" /></div>
            <div><p className="font-semibold text-sm text-gray-800">Gerer les utilisateurs</p><p className="text-xs text-gray-400">Gerer les droits d'acces</p></div>
          </Link>
        </div>
      </div>

    </div>
  );
}
