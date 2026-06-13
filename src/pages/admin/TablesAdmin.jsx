import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Table, Users, Circle } from 'lucide-react';
import { tablesService } from '../../services/tablesService';
import toast from 'react-hot-toast';
import Loader from '../../components/Common/Loader';

const STATUS_CFG = {
  'LIBRE': { label: 'Libre', dot: 'bg-gold', bg: 'bg-gold/10 text-gold', icon: Circle },
  'OCCUPEE': { label: 'Occupee', dot: 'bg-red-400', bg: 'bg-red-50 text-red-500', icon: Circle },
  'RESERVEE': { label: 'Reservee', dot: 'bg-blue-400', bg: 'bg-blue-50 text-blue-600', icon: Circle },
  'A_NETTOYER': { label: 'A nettoyer', dot: 'bg-gray-400', bg: 'bg-gray-100 text-gray-500', icon: Circle },
};

export default function TablesAdmin() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    numeroTable: '', capacite: '', localisation: '', statut: 'LIBRE'
  });

  useEffect(() => { fetchTables(); }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await tablesService.getAll();
      const tablesData = Array.isArray(response.data) ? response.data : (response.data?.content || response.data?.data || []);
      const normalized = tablesData.map(table => ({ ...table, idTable: table.idTables || table.idTable, idTables: table.idTables }));
      setTables(normalized);
    } catch (error) {
      console.error('Erreur fetchTables:', error);
      toast.error('Erreur lors du chargement des tables');
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.numeroTable || !formData.capacite) { toast.error('Champs obligatoires'); return; }
    const payload = { numeroTable: parseInt(formData.numeroTable), capacite: parseInt(formData.capacite), localisation: formData.localisation || '', statut: formData.statut };
    try {
      if (editingTable) { await tablesService.update(editingTable.idTables || editingTable.idTable, payload); toast.success('Table modifiee'); }
      else { await tablesService.create(payload); toast.success('Table creee'); }
      fetchTables(); closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  const handleDelete = async (id) => {
    if (!id) { toast.error('ID invalide'); return; }
    if (window.confirm('Supprimer cette table ?')) {
      try { await tablesService.delete(id); toast.success('Table supprimee'); fetchTables(); }
      catch (error) { toast.error('Erreur lors de la suppression'); }
    }
  };

  const handleChangeStatut = async (id, newStatut) => {
    if (!id) return;
    try {
      await tablesService.changerStatut(id, newStatut);
      toast.success(STATUS_CFG[newStatut]?.label || newStatut);
      fetchTables();
    } catch (error) { toast.error('Erreur'); }
  };

  const openModal = (table = null) => {
    if (table) {
      const tableId = table.idTables || table.idTable;
      setEditingTable({ ...table, idTable: tableId, idTables: tableId });
      setFormData({ numeroTable: table.numeroTable || '', capacite: table.capacite || '', localisation: table.localisation || '', statut: table.statut || 'LIBRE' });
    } else { setEditingTable(null); setFormData({ numeroTable: '', capacite: '', localisation: '', statut: 'LIBRE' }); }
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingTable(null); };

  if (loading) return <Loader />;

  const filteredTables = tables.filter(t => t.numeroTable?.toString().includes(search));
  const stats = [
    { label: 'Total', value: tables.length, icon: Table, color: 'text-gray-900', bg: 'bg-gray-100' },
    { label: 'Libres', value: tables.filter(t => t.statut === 'LIBRE').length, icon: Circle, color: 'text-gold', bg: 'bg-gold/10' },
    { label: 'Occupees', value: tables.filter(t => t.statut === 'OCCUPEE').length, icon: Circle, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Reservees', value: tables.filter(t => t.statut === 'RESERVEE').length, icon: Circle, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestion des Tables</h1>
        <button onClick={() => openModal()} className="inline-flex items-center gap-2 bg-black-deep text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all mt-3 md:mt-0">
          <Plus size={18} /> Ajouter
        </button>
      </div>

      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input type="text" placeholder="Rechercher une table..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold bg-white" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
              <s.icon size={18} className={s.color} />
            </div>
            <div>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Table</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Capacite</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Localisation</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Statut</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTables.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400 text-sm">Aucune table trouvée</td></tr>
            ) : (
              filteredTables.map((table) => {
                const tableId = table.idTables || table.idTable;
                const sc = STATUS_CFG[table.statut] || STATUS_CFG['LIBRE'];
                return (
                  <tr key={tableId} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-sm">Table {table.numeroTable}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <span className="inline-flex items-center gap-1.5"><Users size={14} className="text-gray-400" />{table.capacite} pers.</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{table.localisation || '-'}</td>
                    <td className="px-4 py-3">
                      <select
                        value={table.statut}
                        onChange={(e) => handleChangeStatut(tableId, e.target.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-0 focus:ring-1 focus:ring-gold ${sc.bg}`}
                      >
                        {Object.entries(STATUS_CFG).map(([key, cfg]) => (
                          <option key={key} value={key}>{cfg.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openModal(table)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(tableId)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredTables.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100"><p className="text-gray-400 text-sm">Aucune table trouvee</p></div>
        ) : (
          filteredTables.map((table) => {
            const tableId = table.idTables || table.idTable;
            const sc = STATUS_CFG[table.statut] || STATUS_CFG['LIBRE'];
            return (
              <div key={tableId} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className={`h-1 ${sc.dot}`} />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${sc.bg} flex items-center justify-center font-bold text-sm`}>{table.numeroTable}</div>
                      <div>
                        <p className="font-semibold text-sm">Table {table.numeroTable}</p>
                        <p className="text-xs text-gray-400">{table.capacite} pers. {table.localisation ? `· ${table.localisation}` : ''}</p>
                      </div>
                    </div>
                    <select
                      value={table.statut}
                      onChange={(e) => handleChangeStatut(tableId, e.target.value)}
                      className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer border-0 ${sc.bg}`}
                    >
                      {Object.entries(STATUS_CFG).map(([key, cfg]) => (
                        <option key={key} value={key}>{cfg.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t border-gray-50">
                    <button onClick={() => openModal(table)} className="text-blue-500 text-xs font-semibold hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"><Edit2 size={13} /> Modifier</button>
                    <button onClick={() => handleDelete(tableId)} className="text-red-400 text-xs font-semibold hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"><Trash2 size={13} /> Supprimer</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-5">{editingTable ? 'Modifier la table' : 'Ajouter une table'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numero de table *</label>
                <input type="number" value={formData.numeroTable} onChange={(e) => setFormData({...formData, numeroTable: e.target.value})} required className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacite *</label>
                <input type="number" min="1" value={formData.capacite} onChange={(e) => setFormData({...formData, capacite: e.target.value})} required className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                <input type="text" placeholder="Ex: Terrasse, Salle 1..." value={formData.localisation} onChange={(e) => setFormData({...formData, localisation: e.target.value})} className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select value={formData.statut} onChange={(e) => setFormData({...formData, statut: e.target.value})} className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold bg-white">
                  {Object.entries(STATUS_CFG).map(([key, cfg]) => (<option key={key} value={key}>{cfg.label}</option>))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-black-deep hover:bg-gray-800 text-white py-2.5 rounded-xl font-semibold transition-all shadow-sm">{editingTable ? 'Modifier' : 'Ajouter'}</button>
                <button type="button" onClick={closeModal} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-2.5 rounded-xl font-semibold transition-all">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
