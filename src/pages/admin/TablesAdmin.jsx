import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { tablesService } from '../../services/tablesService';
import toast from 'react-hot-toast';
import Loader from '../../components/Common/Loader';

export default function TablesAdmin() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    numeroTable: '',
    capacite: '',
    localisation: '',
    statut: 'LIBRE'
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await tablesService.getAll();
      const tablesData = Array.isArray(response.data)
        ? response.data
        : (response.data?.content || response.data?.data || []);
      
      // ✅ Normaliser les IDs (l'entité Java utilise idTables, le frontend idTable)
      const normalizedTables = tablesData.map(table => ({
        ...table,
        idTable: table.idTables || table.idTable,
        idTables: table.idTables
      }));
      
      setTables(normalizedTables);
    } catch (error) {
      console.error('Erreur fetchTables:', error);
      toast.error('Erreur lors du chargement des tables');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.numeroTable || !formData.capacite) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    const payload = {
      numeroTable: parseInt(formData.numeroTable),
      capacite: parseInt(formData.capacite),
      localisation: formData.localisation || '',
      statut: formData.statut
    };
    
    try {
      if (editingTable) {
        // ✅ Utiliser idTables ou idTable
        const tableId = editingTable.idTables || editingTable.idTable;
        await tablesService.update(tableId, payload);
        toast.success('Table modifiée avec succès');
      } else {
        await tablesService.create(payload);
        toast.success('Table créée avec succès');
      }
      fetchTables();
      closeModal();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      toast.error('ID de table invalide');
      return;
    }
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette table ?')) {
      try {
        await tablesService.delete(id);
        toast.success('Table supprimée');
        fetchTables();
      } catch (error) {
        console.error('Erreur suppression:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleChangeStatut = async (id, newStatut) => {
    if (!id) return;
    
    try {
      await tablesService.changerStatut(id, newStatut);
      toast.success(`Statut modifié : ${newStatut === 'LIBRE' ? 'Libre' : newStatut === 'OCCUPEE' ? 'Occupée' : newStatut === 'RESERVEE' ? 'Réservée' : 'À nettoyer'}`);
      fetchTables();
    } catch (error) {
      console.error('Erreur changement statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const openModal = (table = null) => {
    if (table) {
      // ✅ Récupérer l'ID correctement (idTables ou idTable)
      const tableId = table.idTables || table.idTable;
      setEditingTable({ ...table, idTable: tableId, idTables: tableId });
      setFormData({
        numeroTable: table.numeroTable || '',
        capacite: table.capacite || '',
        localisation: table.localisation || '',
        statut: table.statut || 'LIBRE'
      });
    } else {
      setEditingTable(null);
      setFormData({ 
        numeroTable: '', 
        capacite: '', 
        localisation: '', 
        statut: 'LIBRE' 
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTable(null);
  };

  const getStatusColor = (statut) => {
    const colors = {
      'LIBRE': 'bg-green-100 text-green-700',
      'OCCUPEE': 'bg-red-100 text-red-700',
      'RESERVEE': 'bg-blue-100 text-blue-700',
      'A_NETTOYER': 'bg-yellow-100 text-yellow-700'
    };
    return colors[statut] || 'bg-gray-100 text-gray-700';
  };

  if (loading) return <Loader />;

  const filteredTables = tables.filter(t => t.numeroTable?.toString().includes(search));

  return (
    <div>
      <div className="bg-gray-light rounded-3xl p-6 mb-8 shadow-sm border border-gray-light">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-dark mb-2 flex items-center gap-2">
              🪑 Gérer les tables
            </p>
            <h1 className="text-3xl font-bold">Gestion des Tables</h1>
            <p className="text-gray-dark mt-2">Gérez les tables, leurs statuts et leurs capacités.</p>
          </div>
          <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 self-start md:self-auto">
            <Plus size={20} /> Ajouter une table
          </button>
        </div>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Rechercher un numéro de table..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white-pure rounded-xl p-4 shadow-sm border border-gray-light">
          <p className="text-gray-dark text-xs uppercase tracking-wider mb-1">Total</p>
          <p className="text-2xl font-bold">{tables.length}</p>
        </div>
        <div className="bg-white-pure rounded-xl p-4 shadow-sm border border-gray-light">
          <p className="text-gray-dark text-xs uppercase tracking-wider mb-1">Libres</p>
          <p className="text-2xl font-bold text-green-600">{tables.filter(t => t.statut === 'LIBRE').length}</p>
        </div>
        <div className="bg-white-pure rounded-xl p-4 shadow-sm border border-gray-light">
          <p className="text-gray-dark text-xs uppercase tracking-wider mb-1">Occupées</p>
          <p className="text-2xl font-bold text-red-600">{tables.filter(t => t.statut === 'OCCUPEE').length}</p>
        </div>
        <div className="bg-white-pure rounded-xl p-4 shadow-sm border border-gray-light">
          <p className="text-gray-dark text-xs uppercase tracking-wider mb-1">Réservées</p>
          <p className="text-2xl font-bold text-blue-600">{tables.filter(t => t.statut === 'RESERVEE').length}</p>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white-pure rounded-xl shadow-sm overflow-x-auto border border-gray-light">
        <table className="w-full">
          <thead className="bg-gray-light">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-dark uppercase tracking-wider">N°</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-dark uppercase tracking-wider">Capacité</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-dark uppercase tracking-wider">Localisation</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-dark uppercase tracking-wider">Statut</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-dark uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTables.map((table) => {
              const tableId = table.idTables || table.idTable;
              return (
                <tr key={tableId} className="border-b border-gray-light hover:bg-gray-light/50 transition-colors">
                  <td className="px-3 py-3 font-semibold text-sm">Table {table.numeroTable}</td>
                  <td className="px-3 py-3 text-sm whitespace-nowrap">{table.capacite} pers.</td>
                  <td className="px-3 py-3 text-sm text-gray-dark">{table.localisation || '-'}</td>
                  <td className="px-3 py-3">
                    <select
                      value={table.statut}
                      onChange={(e) => handleChangeStatut(tableId, e.target.value)}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer ${getStatusColor(table.statut)} border-0 focus:ring-1 focus:ring-gold`}
                    >
                      <option value="LIBRE">Libre</option>
                      <option value="OCCUPEE">Occupée</option>
                      <option value="RESERVEE">Réservée</option>
                      <option value="A_NETTOYER">À nettoyer</option>
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openModal(table)} className="text-blue-500 hover:text-blue-700 transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(tableId)} className="text-red-500 hover:text-red-700 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredTables.length === 0 ? (
          <div className="text-center py-8 bg-white-pure rounded-xl">
            <p className="text-gray-dark">Aucune table trouvée</p>
          </div>
        ) : (
          filteredTables.map((table) => {
            const tableId = table.idTables || table.idTable;
            return (
              <div key={tableId} className="bg-white-pure rounded-xl p-4 border border-gray-light shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                      table.statut === 'LIBRE' ? 'bg-green-100 text-green-700' :
                      table.statut === 'OCCUPEE' ? 'bg-red-100 text-red-700' :
                      table.statut === 'RESERVEE' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {table.numeroTable}
                    </div>
                    <div>
                      <p className="font-semibold">Table {table.numeroTable}</p>
                      <p className="text-xs text-gray-dark">{table.capacite} pers. {table.localisation ? `· ${table.localisation}` : ''}</p>
                    </div>
                  </div>
                  <select
                    value={table.statut}
                    onChange={(e) => handleChangeStatut(tableId, e.target.value)}
                    className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${getStatusColor(table.statut)} border-0`}
                  >
                    <option value="LIBRE">Libre</option>
                    <option value="OCCUPEE">Occupée</option>
                    <option value="RESERVEE">Réservée</option>
                    <option value="A_NETTOYER">À nettoyer</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-light">
                  <button onClick={() => openModal(table)} className="text-blue-500 text-sm hover:underline flex items-center gap-1">
                    <Edit2 size={14} /> Modifier
                  </button>
                  <button onClick={() => handleDelete(tableId)} className="text-red-500 text-sm hover:underline flex items-center gap-1">
                    <Trash2 size={14} /> Supprimer
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editingTable ? 'Modifier la table' : 'Ajouter une table'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Numéro de table *</label>
                <input
                  type="number"
                  value={formData.numeroTable}
                  onChange={(e) => setFormData({...formData, numeroTable: e.target.value})}
                  required
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Capacité (personnes) *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.capacite}
                  onChange={(e) => setFormData({...formData, capacite: e.target.value})}
                  required
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Localisation</label>
                <input
                  type="text"
                  placeholder="Ex: Terrasse, Salle 1..."
                  value={formData.localisation}
                  onChange={(e) => setFormData({...formData, localisation: e.target.value})}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Statut</label>
                <select
                  value={formData.statut}
                  onChange={(e) => setFormData({...formData, statut: e.target.value})}
                  className="input"
                >
                  <option value="LIBRE">Libre</option>
                  <option value="OCCUPEE">Occupée</option>
                  <option value="RESERVEE">Réservée</option>
                  <option value="A_NETTOYER">À nettoyer</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-black-deep hover:bg-gray-800 text-white py-2 rounded-lg font-semibold">
                  {editingTable ? 'Modifier' : 'Ajouter'}
                </button>
                <button type="button" onClick={closeModal} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}