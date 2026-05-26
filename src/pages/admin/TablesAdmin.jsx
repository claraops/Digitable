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
    statut: 'DISPONIBLE'
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await tablesService.getAll();
      const tablesData = Array.isArray(response.data)
        ? response.data
        : (response.data?.content || response.data?.data || []);
      setTables(tablesData);
    } catch {
      toast.error('Erreur lors du chargement des tables');
      setTables([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTable) {
        await tablesService.update(editingTable.idTable, formData);
        toast.success('Table modifiée avec succès');
      } else {
        await tablesService.create(formData);
        toast.success('Table créée avec succès');
      }
      fetchTables();
      closeModal();
    } catch {
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette table ?')) {
      try {
        await tablesService.delete(id);
        toast.success('Table supprimée');
        fetchTables();
      } catch {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleChangeStatut = async (id, newStatut) => {
    try {
      await tablesService.changerStatut(id, newStatut);
      toast.success('Statut mis à jour');
      fetchTables();
    } catch {
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const openModal = (table = null) => {
    if (table) {
      setEditingTable(table);
      setFormData({
        numeroTable: table.numeroTable,
        capacite: table.capacite,
        localisation: table.localisation || '',
        statut: table.statut
      });
    } else {
      setEditingTable(null);
      setFormData({ numeroTable: '', capacite: '', localisation: '', statut: 'DISPONIBLE' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTable(null);
  };

  const filteredTables = Array.isArray(tables)
    ? tables.filter(t => t.numeroTable?.toString().includes(search))
    : [];

  const getStatusColor = (statut) => {
    const colors = {
      'DISPONIBLE': 'bg-green-100 text-green-700',
      'OCCUPEE': 'bg-red-100 text-red-700',
      'RESERVEE': 'bg-blue-100 text-blue-700',
      'MAINTENANCE': 'bg-yellow-100 text-yellow-700'
    };
    return colors[statut] || 'bg-gray-100 text-gray-700';
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestion des Tables</h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Ajouter une table
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-dark" size={18} />
        <input
          type="text"
          placeholder="Rechercher un numéro de table..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white-pure rounded-lg p-4 shadow-sm">
          <p className="text-gray-dark text-sm">Total des tables</p>
          <p className="text-2xl font-bold">{tables.length}</p>
        </div>
        <div className="bg-white-pure rounded-lg p-4 shadow-sm">
          <p className="text-gray-dark text-sm">Disponibles</p>
          <p className="text-2xl font-bold text-green-600">{tables.filter(t => t.statut === 'DISPONIBLE').length}</p>
        </div>
        <div className="bg-white-pure rounded-lg p-4 shadow-sm">
          <p className="text-gray-dark text-sm">Occupées</p>
          <p className="text-2xl font-bold text-red-600">{tables.filter(t => t.statut === 'OCCUPEE').length}</p>
        </div>
        <div className="bg-white-pure rounded-lg p-4 shadow-sm">
          <p className="text-gray-dark text-sm">Réservées</p>
          <p className="text-2xl font-bold text-blue-600">{tables.filter(t => t.statut === 'RESERVEE').length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white-pure rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-light">
            <tr>
              <th className="px-6 py-3 text-left">N°</th>
              <th className="px-6 py-3 text-left">Capacité</th>
              <th className="px-6 py-3 text-left">Localisation</th>
              <th className="px-6 py-3 text-left">Statut</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTables.map((table) => (
              <tr key={table.idTable} className="border-b border-gray-light hover:bg-gray-light/50">
                <td className="px-6 py-4 font-semibold">Table {table.numeroTable}</td>
                <td className="px-6 py-4">{table.capacite} personnes</td>
                <td className="px-6 py-4 text-gray-dark">{table.localisation || '-'}</td>
                <td className="px-6 py-4">
                  <select
                    value={table.statut}
                    onChange={(e) => handleChangeStatut(table.idTable, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${getStatusColor(table.statut)}`}
                  >
                    <option value="DISPONIBLE">Disponible</option>
                    <option value="OCCUPEE">Occupée</option>
                    <option value="RESERVEE">Réservée</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => openModal(table)} className="text-blue-500 hover:text-blue-700">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(table.idTable)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black-deep bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white-pure rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editingTable ? 'Modifier la table' : 'Ajouter une table'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Numéro de table</label>
                <input
                  type="number"
                  value={formData.numeroTable}
                  onChange={(e) => setFormData({...formData, numeroTable: e.target.value})}
                  required
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Capacité (personnes)</label>
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
                  <option value="DISPONIBLE">Disponible</option>
                  <option value="OCCUPEE">Occupée</option>
                  <option value="RESERVEE">Réservée</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingTable ? 'Modifier' : 'Ajouter'}
                </button>
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">
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
