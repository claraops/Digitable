import { useState, useEffect, useCallback } from 'react';
import { Star, Trash2, Search, MessageSquare, RefreshCw, X } from 'lucide-react';
import { avisService } from '../../services/avisService';
import { platService } from '../../services/platService';
import { commandeService } from '../../services/commandeService';
import toast from 'react-hot-toast';
import Loader from '../../components/Common/Loader';

export default function AdminAvisPage() {
  const [avisList, setAvisList] = useState([]);
  const [plats, setPlats] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedAvis, setSelectedAvis] = useState(null);

  const fetchAvis = useCallback(async () => {
    try {
      setLoading(true);
      const [avisRes, platsRes, commandesRes] = await Promise.all([
        avisService.getAll(),
        platService.getAll(),
        commandeService.getAll(),
      ]);
      const avisData = Array.isArray(avisRes.data) ? avisRes.data : [];
      const platsData = Array.isArray(platsRes.data) ? platsRes.data : [];
      const commandesData = Array.isArray(commandesRes.data) ? commandesRes.data : [];

      console.log('Avis brut (1er):', avisData[0]);
      console.log('Commande brut (1er):', commandesData[0]);

      setAvisList(avisData);
      setPlats(platsData);
      setCommandes(commandesData);
    } catch (error) {
      console.error('Erreur chargement avis:', error);
      toast.error('Erreur lors du chargement des avis');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAvis(); }, [fetchAvis]);

  const getCommande = (avis) => {
    const cmdId = avis.commandeId || avis.idCommande || avis._ID_COMMANDE || avis.commande?.idCommande;
    return commandes.find(c => c.idCommande === cmdId || c.id === cmdId);
  };

  const getPlatName = (avis) => {
    const cmd = getCommande(avis);
    if (cmd?.platsCommandes?.length > 0) {
      const platId = cmd.platsCommandes[0]?.platId || cmd.platsCommandes[0]?.idPlat || cmd.platsCommandes[0]?.plat?.idPlat;
      const plat = plats.find(p => p.idPlat === platId || p.id === platId);
      if (plat) return plat.nomPlat || plat.nom;
    }
    const cmdId = avis.commandeId || avis.idCommande || avis._ID_COMMANDE || avis.commande?.idCommande;
    return 'Commande #' + (cmdId || '?');
  };

  const getNote = (avis) => {
    const note = avis.note;
    return note !== undefined && note !== null ? parseFloat(note) : 0;
  };

  const getClientName = (avis) => {
    const prenom = avis.utilisateurPrenom || avis.utilisateur?.prenom;
    const nom = avis.utilisateurNom || avis.utilisateur?.nom;
    if (prenom || nom) return `${prenom || ''} ${nom || ''}`.trim();
    const cmd = getCommande(avis);
    if (cmd) {
      const cp = cmd.utilisateurPrenom || cmd.utilisateur?.prenom;
      const cn = cmd.utilisateurNom || cmd.utilisateur?.nom;
      if (cp || cn) return `${cp || ''} ${cn || ''}`.trim();
    }
    return 'Inconnu';
  };

  const getDate = (avis) => {
    return avis.dateAvis || avis.dateCreation || avis.createdAt || null;
  };

  const getCommandeId = (avis) => {
    return avis.commandeId || avis.idCommande || avis._ID_COMMANDE || avis.commande?.idCommande || avis.commande?.id || avis.commande_id || '---';
  };

  const handleDelete = async (avis) => {
    if (!window.confirm(`Supprimer l'avis de ${getClientName(avis)} ?`)) return;
    try {
      await avisService.delete(avis.idAvis || avis.id);
      toast.success('Avis supprime avec succes');
      fetchAvis();
      if (selectedAvis?.idAvis === avis.idAvis) setSelectedAvis(null);
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} size={16} className={star <= Math.round(rating) ? 'fill-gold text-gold' : 'text-gray-300'} />
      ))}
    </div>
  );

  const filteredAvis = avisList.filter(a => {
    if (!search) return true;
    const q = search.toLowerCase();
    return getClientName(a).toLowerCase().includes(q) ||
           (a.commentaire || '').toLowerCase().includes(q) ||
           getPlatName(a).toLowerCase().includes(q);
  });

  if (loading) return <Loader fullScreen />;

  const stats = {
    total: avisList.length,
    avgNote: avisList.length > 0 ? (avisList.reduce((s, a) => s + getNote(a), 0) / avisList.length) : 0,
    withComment: avisList.filter(a => a.commentaire).length
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Gestion des avis</h2>
      <p className="text-gray-500 text-sm mb-6">{stats.total} avis recus</p>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border-2 border-black-deep/10 shadow-sm">
          <p className="text-3xl font-bold text-black-deep">{stats.total}</p>
          <p className="text-gray-500 text-sm mt-1">Total avis</p>
        </div>
        <div className="bg-white rounded-xl p-4 border-2 border-black-deep/10 shadow-sm">
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-black-deep">{stats.avgNote > 0 ? stats.avgNote.toFixed(2) : '---'}</p>
            <span className="text-sm text-gold">/5</span>
          </div>
          <div className="mt-1">{stats.avgNote > 0 && renderStars(Math.round(stats.avgNote))}</div>
          <p className="text-gray-500 text-xs mt-1">Note moyenne</p>
        </div>
        <div className="bg-white rounded-xl p-4 border-2 border-black-deep/10 shadow-sm">
          <p className="text-3xl font-bold text-black-deep">{stats.withComment}</p>
          <p className="text-gray-500 text-sm mt-1">Avec commentaire</p>
        </div>
      </div>

      {/* Search + Refresh */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un avis..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-black-deep/10 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 text-sm" />
        </div>
        <button onClick={fetchAvis} className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-black-deep/10 hover:bg-gray-50 transition-colors text-sm">
          <RefreshCw size={16} /> Actualiser
        </button>
      </div>

      {/* Table */}
      {filteredAvis.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Aucun avis trouve</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border-2 border-black-deep/10">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-black-deep/10 bg-gray-50">
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Commande</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plat</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Note</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Commentaire</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAvis.map((avis) => {
                const note = getNote(avis);
                const date = getDate(avis);
                return (
                  <tr key={avis.idAvis || avis.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3">
                      <span className="text-sm font-mono font-medium text-gray-600">#{getCommandeId(avis)}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-sm font-medium">{getClientName(avis)}</span>
                    </td>
                    <td className="py-3 px-3">
                      <button onClick={() => setSelectedAvis(avis)} className="text-sm text-gray-700 hover:text-gold transition-colors">
                        {getPlatName(avis)}
                      </button>
                    </td>
                    <td className="py-3 px-3">{renderStars(note)}</td>
                    <td className="py-3 px-3 max-w-xs">
                      <p className="text-sm text-gray-600 truncate">{avis.commentaire || '---'}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-sm text-gray-500">{date ? new Date(date).toLocaleDateString('fr-FR') : '---'}</span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button onClick={() => handleDelete(avis)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Supprimer">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail modal */}
      {selectedAvis && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelectedAvis(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Detail avis</h3>
              <button onClick={() => setSelectedAvis(null)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <div><span className="text-sm text-gray-500">Client:</span><p className="font-medium">{getClientName(selectedAvis)}</p></div>
              <div><span className="text-sm text-gray-500">Plat / Commande:</span><p className="font-medium">{getPlatName(selectedAvis)}</p></div>
              <div>
                <span className="text-sm text-gray-500">Note:</span>
                <div className="mt-1">{renderStars(getNote(selectedAvis))}</div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Commentaire:</span>
                <p className="text-gray-700 mt-1 bg-gray-50 rounded-lg p-3">{selectedAvis.commentaire || 'Aucun commentaire'}</p>
              </div>
              <div><span className="text-sm text-gray-500">Date:</span><p className="font-medium">{getDate(selectedAvis) ? new Date(getDate(selectedAvis)).toLocaleDateString('fr-FR') : '---'}</p></div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button onClick={() => { handleDelete(selectedAvis); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-medium">
                <Trash2 size={16} /> Supprimer cet avis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
