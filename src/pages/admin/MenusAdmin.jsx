import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Menu as MenuIcon } from 'lucide-react';
import { menuService } from '../../services/menuService';
import { platService } from '../../services/platService';
import toast from 'react-hot-toast';
import Loader from '../../components/Common/Loader';

export default function MenusAdmin() {
  const [menus, setMenus] = useState([]);
  const [plats, setPlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [selectedPlats, setSelectedPlats] = useState([]);
  const [formData, setFormData] = useState({
    nomMenu: '',
    description: '',
    prix: '',
    actif: true
  });

  useEffect(() => {
    fetchMenus();
    fetchPlats();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await menuService.getAll();
      setMenus(response.data);
    } catch {
      toast.error('Erreur lors du chargement des menus');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlats = async () => {
    try {
      const response = await platService.getAll();
      const payload = response?.data ?? response;
      const data = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.content)
        ? payload.content
        : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.plats)
        ? payload.plats
        : [];
      setPlats(data);
    } catch {
      console.error('Erreur lors du chargement des plats');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, plats: selectedPlats };
      if (editingMenu) {
        await menuService.update(editingMenu.idMenu, payload);
        toast.success('Menu modifié avec succès');
      } else {
        await menuService.create(payload);
        toast.success('Menu créé avec succès');
      }
      fetchMenus();
      closeModal();
    } catch {
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce menu ?')) {
      try {
        await menuService.delete(id);
        toast.success('Menu supprimé');
        fetchMenus();
      } catch {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleAddPlatToMenu = async (plat) => {
    if (!plat) return;
    if (editingMenu) {
      try {
        await menuService.addPlat(editingMenu.idMenu, plat.idPlat);
        setSelectedPlats((prev) => [...prev, plat]);
        toast.success('Plat ajouté au menu');
      } catch {
        toast.error('Erreur lors de l\'ajout du plat');
      }
    } else {
      setSelectedPlats((prev) => [...prev, plat]);
    }
  };

  const handleRemovePlatFromMenu = async (platId) => {
    if (editingMenu) {
      try {
        await menuService.removePlat(editingMenu.idMenu, platId);
        setSelectedPlats((prev) => prev.filter((plat) => plat.idPlat !== platId));
        toast.success('Plat retiré du menu');
      } catch {
        toast.error('Erreur lors de la suppression du plat');
      }
    } else {
      setSelectedPlats((prev) => prev.filter((plat) => plat.idPlat !== platId));
    }
  };

  const openModal = (menu = null) => {
    if (menu) {
      setEditingMenu(menu);
      setFormData({
        nomMenu: menu.nomMenu,
        description: menu.description || '',
        prix: menu.prix,
        actif: menu.actif
      });
      setSelectedPlats(menu.plats || []);
    } else {
      setEditingMenu(null);
      setFormData({ nomMenu: '', description: '', prix: '', actif: true });
      setSelectedPlats([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMenu(null);
    setSelectedPlats([]);
  };

  const filteredMenus = menus.filter(m =>
    m.nomMenu?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div>
      <div className="bg-gray-light rounded-3xl p-6 mb-8 shadow-sm border border-gray-light">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-dark mb-2 flex items-center gap-2">
              <MenuIcon size={18} /> Gérer le menu
            </p>
            <h1 className="text-3xl font-bold">Gestion des Menus</h1>
            <p className="text-gray-dark mt-2">Créez, mettez à jour et organisez les menus avec vos plats.</p>
          </div>
          <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 self-start md:self-auto">
            <Plus size={20} /> Ajouter un menu
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-dark" size={18} />
        <input
          type="text"
          placeholder="Rechercher un menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Table */}
      <div className="space-y-4 sm:hidden">
        {filteredMenus.map((menu) => (
          <div key={menu.idMenu} className="bg-white-pure rounded-3xl border border-gray-light p-4 shadow-sm">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg text-black-deep">{menu.nomMenu}</h3>
                  <p className="text-sm text-gray-dark">ID #{menu.idMenu}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs ${
                  menu.actif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {menu.actif ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <p className="text-sm text-gray-dark overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {menu.description || '-'}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-gold">{menu.prix} €</span>
                <span className="text-gray-dark">{menu.plats?.length || 0} plats</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => openModal(menu)} className="btn-secondary w-full sm:w-auto">
                  <Edit2 size={18} /> Modifier
                </button>
                <button onClick={() => handleDelete(menu.idMenu)} className="btn-secondary w-full sm:w-auto text-red-500 hover:text-red-700">
                  <Trash2 size={18} /> Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden sm:block bg-white-pure rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full min-w-[768px]">
          <thead className="bg-gray-light">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Nom</th>
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-left">Prix</th>
              <th className="px-6 py-3 text-left">Plats</th>
              <th className="px-6 py-3 text-left">Statut</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMenus.map((menu) => (
              <tr key={menu.idMenu} className="border-b border-gray-light hover:bg-gray-light/50 transition-colors">
                <td className="px-6 py-4">#{menu.idMenu}</td>
                <td className="px-6 py-4 font-medium">{menu.nomMenu}</td>
                <td className="px-6 py-4 text-sm text-gray-dark max-w-xs truncate">{menu.description}</td>
                <td className="px-6 py-4 text-gold font-semibold">{menu.prix} €</td>
                <td className="px-6 py-4 text-sm">{menu.plats?.length || 0} plat(s)</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    menu.actif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {menu.actif ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => openModal(menu)} className="text-blue-500 hover:text-blue-700">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(menu.idMenu)} className="text-red-500 hover:text-red-700">
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
          <div className="bg-white-pure rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingMenu ? 'Modifier le menu' : 'Ajouter un menu'}
            </h2>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom du menu</label>
                  <input
                    type="text"
                    value={formData.nomMenu}
                    onChange={(e) => setFormData({...formData, nomMenu: e.target.value})}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Prix (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.prix}
                    onChange={(e) => setFormData({...formData, prix: e.target.value})}
                    required
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  className="input"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.actif}
                  onChange={(e) => setFormData({...formData, actif: e.target.checked})}
                />
                <span className="text-sm">Actif</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Plats du menu</label>
                  <div className="border border-gray-light rounded-lg p-4 max-h-48 overflow-y-auto">
                    {selectedPlats.length === 0 ? (
                      <p className="text-gray-dark text-sm">Aucun plat ajouté</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedPlats.map((plat) => (
                          <div key={plat.idPlat} className="flex justify-between items-center bg-gray-light p-2 rounded">
                            <span>{plat.nomPlat}</span>
                            <button
                              type="button"
                              onClick={() => handleRemovePlatFromMenu(plat.idPlat)}
                              className="text-red-500 text-sm hover:text-red-700"
                            >
                              Retirer
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Ajouter des plats</label>
                  <div className="border border-gray-light rounded-lg p-4 max-h-48 overflow-y-auto">
                    {plats
                      .filter(p => !selectedPlats.find(sp => sp.idPlat === p.idPlat))
                      .map((plat) => (
                        <div key={plat.idPlat} className="flex justify-between items-center p-2 border-b last:border-b-0">
                          <span className="text-sm">{plat.nomPlat}</span>
                          <button
                            type="button"
                            onClick={() => handleAddPlatToMenu(plat)}
                            className="text-blue-500 text-sm hover:text-blue-700"
                          >
                            Ajouter
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                <button type="submit" className="btn-primary w-full sm:w-auto">
                  {editingMenu ? 'Modifier' : 'Ajouter'}
                </button>
                <button type="button" onClick={closeModal} className="btn-secondary w-full sm:w-auto">
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
