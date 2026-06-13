import { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { commandeService } from '../../services/commandeService';
import toast from 'react-hot-toast';
import Loader from '../../components/Common/Loader';

export default function CommandesAdmin() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [filter, setFilter] = useState('TOUS');

  useEffect(() => {
    fetchCommandes();
  }, []);

  const fetchCommandes = async () => {
    try {
      const response = await commandeService.getAll();
      setCommandes(response.data);
    } catch {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const updateStatut = async (id, statut) => {
    try {
      await commandeService.updateStatut(id, statut);
      toast.success(`Statut mis à jour : ${statut}`);
      fetchCommandes();
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getStatusColor = (statut) => {
    const colors = {
      'EN_ATTENTE': 'bg-gray-500',
      'EN_PREPARATION': 'bg-gray-700',
      'PRETE': 'bg-gold',
      'SERVIE': 'bg-black-deep',
      'PAYEE': 'bg-gray-800',
      'ANNULEE': 'bg-gray-400'
    };
    return colors[statut] || 'bg-gray-500';
  };

  const filteredCommandes = filter === 'TOUS' 
    ? commandes 
    : commandes.filter(c => c.statut === filter);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Gestion des Commandes</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['TOUS', 'EN_ATTENTE', 'EN_PREPARATION', 'PRETE', 'SERVIE', 'PAYEE', 'ANNULEE'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f ? 'bg-black-deep text-white' : 'bg-gray-light text-gray-dark hover:bg-gold/10'
            }`}
          >
            {f === 'TOUS' ? 'Toutes' : f}
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white-pure rounded-xl shadow-sm overflow-x-auto border border-gray-light">
        <table className="w-full">
          <thead className="bg-gray-light">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-dark  ">ID</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-dark  ">Date</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-dark  ">Client</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-dark  ">Table</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-dark  ">Total</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-dark">Statut</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-dark">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCommandes.map((cmd) => (
              <tr key={cmd.idCommande} className="border-b border-gray-light hover:bg-gray-light/50 transition-colors">
                <td className="px-3 py-3 font-medium text-sm">#{cmd.idCommande}</td>
                <td className="px-3 py-3 text-sm text-gray-dark whitespace-nowrap">{new Date(cmd.dateCommande).toLocaleDateString()}</td>
                <td className="px-3 py-3 text-sm">{cmd.utilisateurPrenom || ''} {cmd.utilisateurNom || ''}</td>
                <td className="px-3 py-3 text-sm">Table {cmd.numeroTable || cmd.idTable}</td>
                <td className="px-3 py-3 font-semibold text-black-deep text-sm whitespace-nowrap">{(cmd.montantTotal ?? cmd.total)?.toFixed(2)} €</td>
                <td className="px-3 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs text-white ${getStatusColor(cmd.statut)}`}>
                    {cmd.statut}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedCommande(cmd)} className="text-blue-600 hover:text-blue-800 transition-colors" title="Détails">
                      <Eye size={18} />
                    </button>
                    {cmd.statut === 'EN_ATTENTE' && (
                      <button onClick={() => updateStatut(cmd.idCommande, 'EN_PREPARATION')} className="text-blue-600 hover:text-blue-800 transition-colors" title="Passer en préparation">
                        <Clock size={18} />
                      </button>
                    )}
                    {cmd.statut === 'EN_PREPARATION' && (
                      <button onClick={() => updateStatut(cmd.idCommande, 'PRETE')} className="text-black-deep hover:text-black-deep transition-colors" title="Marquer prête">
                        <CheckCircle size={18} />
                      </button>
                    )}
                    {cmd.statut !== 'ANNULEE' && cmd.statut !== 'PAYEE' && (
                      <button onClick={() => updateStatut(cmd.idCommande, 'ANNULEE')} className="text-red-500 hover:text-red-700 transition-colors" title="Annuler">
                        <XCircle size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredCommandes.length === 0 ? (
          <div className="text-center py-8 bg-white-pure rounded-xl">
            <p className="text-gray-dark">Aucune commande trouvée</p>
          </div>
        ) : (
          filteredCommandes.map((cmd) => (
            <div key={cmd.idCommande} className="bg-white-pure rounded-xl p-4 border border-gray-light shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">#{cmd.idCommande}</span>
                <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(cmd.statut)}`}>
                  {cmd.statut}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-dark mb-3">
                <p>Client: {cmd.utilisateurPrenom || ''} {cmd.utilisateurNom || '—'}</p>
                <p>Table {cmd.numeroTable || cmd.idTable} · {new Date(cmd.dateCommande).toLocaleString()}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-light">
                <span className="font-bold text-black-deep">{(cmd.montantTotal ?? cmd.total)?.toFixed(2)} €</span>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedCommande(cmd)} className="text-blue-600 text-sm hover:underline hover:text-blue-800">
                    Détails
                  </button>
                  {cmd.statut === 'EN_ATTENTE' && (
                    <button onClick={() => updateStatut(cmd.idCommande, 'EN_PREPARATION')} className="text-blue-600 text-sm hover:underline hover:text-blue-800">
                      Préparer
                    </button>
                  )}
                  {cmd.statut === 'EN_PREPARATION' && (
                    <button onClick={() => updateStatut(cmd.idCommande, 'PRETE')} className="text-black-deep text-sm hover:underline">
                      Prête
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Détails */}
      {selectedCommande && (
        <div className="fixed inset-0 bg-black-deep bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white-pure rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Détails commande #{selectedCommande.idCommande}</h2>
            
            <div className="space-y-3 mb-4">
              <p><strong>Client :</strong> {selectedCommande.utilisateurPrenom} {selectedCommande.utilisateurNom}</p>
              <p><strong>Table :</strong> {selectedCommande.numeroTable}</p>
              <p><strong>Date :</strong> {new Date(selectedCommande.dateCommande).toLocaleString()}</p>
              <p><strong>Statut :</strong> {selectedCommande.statut}</p>
            </div>

            <h3 className="font-semibold mb-2">Plats commandés :</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
              {selectedCommande.platsCommandes?.map((plat, idx) => (
                <div key={idx} className="flex justify-between border-b border-gray-light py-2">
                  <span>{plat.platNom} x{plat.quantite}</span>
                  <span className="text-black-deep">{(plat.prixUnitaire * plat.quantite).toFixed(2)} €</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-3 border-t border-gray-light">
              <span className="font-bold">Total</span>
              <span className="text-xl font-bold text-black-deep">{selectedCommande.montantTotal} €</span>
            </div>

            <button onClick={() => setSelectedCommande(null)} className="btn-primary w-full mt-4">
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}