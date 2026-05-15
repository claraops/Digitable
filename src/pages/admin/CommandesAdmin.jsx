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
      'EN_ATTENTE': 'bg-yellow-500',
      'EN_PREPARATION': 'bg-blue-500',
      'PRETE': 'bg-gold',
      'SERVIE': 'bg-green-500',
      'PAYEE': 'bg-purple-500',
      'ANNULEE': 'bg-red-500'
    };
    return colors[statut] || 'bg-gray-500';
  };

  const filteredCommandes = filter === 'TOUS' 
    ? commandes 
    : commandes.filter(c => c.statut === filter);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Gestion des Commandes</h1>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {['TOUS', 'EN_ATTENTE', 'EN_PREPARATION', 'PRETE', 'SERVIE', 'PAYEE', 'ANNULEE'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === f ? 'bg-gold text-black-deep' : 'bg-gray-light text-gray-dark'
            }`}
          >
            {f === 'TOUS' ? 'Toutes' : f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white-pure rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-light">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Client</th>
              <th className="px-6 py-3 text-left">Table</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-left">Statut</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCommandes.map((cmd) => (
              <tr key={cmd.idCommande} className="border-b border-gray-light hover:bg-gray-light/50">
                <td className="px-6 py-4">#{cmd.idCommande}</td>
                <td className="px-6 py-4">{new Date(cmd.dateCommande).toLocaleString()}</td>
                <td className="px-6 py-4">{cmd.utilisateurPrenom || ''} {cmd.utilisateurNom || ''}</td>
                <td className="px-6 py-4">Table {cmd.numeroTable || cmd.idTable}</td>
                <td className="px-6 py-4 font-semibold text-gold">{(cmd.montantTotal ?? cmd.total)?.toFixed(2)} €</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(cmd.statut)}`}>
                    {cmd.statut}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedCommande(cmd)} className="text-blue-500">
                      <Eye size={18} />
                    </button>
                    {cmd.statut === 'EN_ATTENTE' && (
                      <button onClick={() => updateStatut(cmd.idCommande, 'EN_PREPARATION')} className="text-blue-500">
                        <Clock size={18} />
                      </button>
                    )}
                    {cmd.statut === 'EN_PREPARATION' && (
                      <button onClick={() => updateStatut(cmd.idCommande, 'PRETE')} className="text-gold">
                        <CheckCircle size={18} />
                      </button>
                    )}
                    {cmd.statut !== 'ANNULEE' && cmd.statut !== 'PAYEE' && (
                      <button onClick={() => updateStatut(cmd.idCommande, 'ANNULEE')} className="text-red-500">
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
                  <span className="text-gold">{(plat.prixUnitaire * plat.quantite).toFixed(2)} €</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-3 border-t border-gray-light">
              <span className="font-bold">Total</span>
              <span className="text-xl font-bold text-gold">{selectedCommande.montantTotal} €</span>
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