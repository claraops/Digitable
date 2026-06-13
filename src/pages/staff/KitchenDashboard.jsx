import { useState, useEffect } from 'react';
import { Clock, CheckCircle, ChefHat, Users, AlertCircle, RefreshCw, AlertTriangle, MessageSquare } from 'lucide-react';
import { commandeService } from '../../services/commandeService';
import toast from 'react-hot-toast';

const statusConfig = {
  'EN_ATTENTE': { label: 'En attente', color: 'bg-gray-500', order: 1, nextStatus: 'EN_PREPARATION', nextLabel: 'Démarrer' },
  'EN_PREPARATION': { label: 'En préparation', color: 'bg-blue-600', order: 2, nextStatus: 'PRETE', nextLabel: 'Marquer prête' },
  'PRETE': { label: 'Prête', color: 'bg-green-600', order: 3, nextStatus: 'SERVIE', nextLabel: 'Marquer servie' },
  'SERVIE': { label: 'Servie', color: 'bg-gray-400', order: 4, nextStatus: null, nextLabel: null }
};

export default function KitchenDashboard() {
  const [commandes, setCommandes] = useState({ enAttente: [], enPreparation: [], prete: [], servie: [] });
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    fetchCommandes();
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchCommandes, 10000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const fetchCommandes = async () => {
    try {
      const response = await commandeService.getAll();
      let allCommandes = response.data || [];
      allCommandes = allCommandes.filter(c => c.statut !== 'PAYEE' && c.statut !== 'ANNULEE');
      
      setCommandes({
        enAttente: allCommandes.filter(c => c.statut === 'EN_ATTENTE'),
        enPreparation: allCommandes.filter(c => c.statut === 'EN_PREPARATION'),
        prete: allCommandes.filter(c => c.statut === 'PRETE'),
        servie: allCommandes.filter(c => c.statut === 'SERVIE')
      });
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erreur chargement commandes cuisine:', error);
      toast.error('Erreur chargement commandes');
    } finally {
      setLoading(false);
    }
  };

  const updateStatut = async (id, newStatut) => {
    try {
      await commandeService.updateStatut(id, newStatut);
      toast.success(`Commande #${id} : ${statusConfig[newStatut]?.label}`);
      fetchCommandes();
    } catch (error) {
      toast.error('Erreur mise à jour');
    }
  };

  // Extraire les informations des plats commandés
  const extractPlatDetails = (cmd) => {
    if (!cmd.platsCommandes) return [];
    return cmd.platsCommandes.map(plat => ({
      ...plat,
      // Instructions spéciales provenant du panier
      noteClient: plat.instructionSpeciale || ''
    }));
  };

  const columns = [
    { key: 'enAttente', title: 'EN ATTENTE', status: 'EN_ATTENTE', color: 'border-gray-400', bg: 'bg-gray-50' },
    { key: 'enPreparation', title: 'EN PRÉPARATION', status: 'EN_PREPARATION', color: 'border-blue-400', bg: 'bg-blue-50' },
    { key: 'prete', title: 'PRÊTE', status: 'PRETE', color: 'border-green-400', bg: 'bg-green-50' },
    { key: 'servie', title: 'SERVIE', status: 'SERVIE', color: 'border-gray-400', bg: 'bg-gray-100' }
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ChefHat className="w-6 h-6 text-gold" />
            <h1 className="text-xl font-bold">Espace Cuisine</h1>
            <span className="text-xs text-gray-400">Dernière mise à jour: {lastUpdate.toLocaleTimeString()}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setAutoRefresh(!autoRefresh)} className={`px-3 py-1 rounded-full text-xs ${autoRefresh ? 'bg-gold text-black' : 'bg-gray-700 text-white'}`}>
              {autoRefresh ? 'Auto ON' : 'Auto OFF'}
            </button>
            <button onClick={fetchCommandes} className="p-1 hover:bg-gray-700 rounded-full"><RefreshCw size={18} /></button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {columns.map(col => (
            <div key={col.key} className={`bg-white rounded-xl shadow-sm border-t-4 ${col.color} overflow-hidden`}>
              <div className={`${col.bg} p-3 font-bold text-center border-b text-gray-700`}>{col.title} ({commandes[col.key].length})</div>
              <div className="p-3 space-y-3 min-h-[400px] max-h-[calc(100vh-180px)] overflow-y-auto">
                {commandes[col.key].length === 0 && (
                  <p className="text-gray-400 text-center py-8 text-sm">Aucune commande</p>
                )}
                {commandes[col.key].map(cmd => {
                  const platsDetails = extractPlatDetails(cmd);
                  // Extraire les allergies et notes spéciales globales
                  const allergiesGlobales = cmd.allergies || '';
                  const noteGlobale = cmd.instructionSpeciale || '';
                  
                  return (
                    <div key={cmd.idCommande} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-lg text-black">#{cmd.idCommande}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Table {cmd.numeroTable || cmd._ID_TABLES}</span>
                      </div>
                      
                      {/* Plats commandés avec détails */}
                      <div className="mt-2 space-y-2">
                        {platsDetails.map((plat, idx) => (
                          <div key={idx} className="border-b border-gray-100 pb-2 last:border-0">
                            <div className="flex justify-between items-start">
                              <span className="font-medium text-sm">{plat.quantite}x {plat.platNom}</span>
                              <span className="text-gray-500 text-xs">{(plat.prixUnitaire * plat.quantite).toFixed(2)} €</span>
                            </div>
                            
                            {/* ✅ Note client sur ce plat (allergies, cuisson, suppléments) */}
                            {plat.noteClient && (
                              <div className="mt-1 p-1.5 bg-yellow-50 rounded text-xs">
                                <div className="flex items-start gap-1 text-yellow-700">
                                  <MessageSquare size={10} className="mt-0.5 flex-shrink-0" />
                                  <span className="font-semibold">Note:</span>
                                  <span className="text-gray-700 break-words">{plat.noteClient}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* ✅ Allergies globales de la commande */}
                      {allergiesGlobales && (
                        <div className="mt-2 p-2 bg-red-50 rounded-lg text-xs">
                          <div className="flex items-start gap-1 text-red-600">
                            <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                            <span className="font-semibold">⚠️ Allergie signalée:</span>
                            <span className="text-gray-700 break-words">{allergiesGlobales}</span>
                          </div>
                        </div>
                      )}
                      
                      {/* ✅ Note globale de la commande */}
                      {noteGlobale && !allergiesGlobales && (
                        <div className="mt-2 p-2 bg-yellow-50 rounded-lg text-xs">
                          <div className="flex items-start gap-1 text-yellow-700">
                            <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
                            <span className="font-semibold">Note spéciale:</span>
                            <span className="text-gray-700 break-words">{noteGlobale}</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Bouton d'action */}
                      {statusConfig[col.status]?.nextStatus && (
                        <button 
                          onClick={() => updateStatut(cmd.idCommande, statusConfig[col.status].nextStatus)} 
                          className="w-full mt-3 bg-gold hover:bg-gold/90 text-black py-1.5 rounded-lg text-sm font-medium transition-all"
                        >
                          {statusConfig[col.status].nextLabel} {'>'}
                        </button>
                      )}
                      
                      {col.status === 'SERVIE' && (
                        <div className="mt-3 p-2 bg-green-50 rounded-lg text-center text-green-700 text-xs">
                          <CheckCircle size={12} className="inline mr-1" /> Commande servie
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}