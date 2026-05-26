import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Menu as MenuIcon } from 'lucide-react';
import { menuService } from '../../services/menuService';
import { platService } from '../../services/platService';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import Loader from '../../components/Common/Loader';
import api from '../../services/api';  // ← AJOUTER CETTE LIGNE

export default function MenusAdmin() {
  const [menus, setMenus] = useState([]);
  const [plats, setPlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [selectedPlats, setSelectedPlats] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    nomMenu: '',
    descriptionMenu: '',
    prixSpecial: '',
    photo: '',
    actif: true
  });

  useEffect(() => {
    fetchMenus();
    fetchPlats();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await menuService.getAll();
      let menusData = [];
      if (Array.isArray(response.data)) {
        menusData = response.data;
      } else if (response.data?.content && Array.isArray(response.data.content)) {
        menusData = response.data.content;
      } else {
        menusData = [];
      }
      setMenus(menusData);
    } catch (error) {
      console.error('Erreur fetchMenus:', error);
      toast.error('Erreur lors du chargement des menus');
      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlats = async () => {
    try {
      const response = await platService.getAll();
      let platsData = [];
      if (Array.isArray(response.data)) {
        platsData = response.data;
      } else if (response.data?.content && Array.isArray(response.data.content)) {
        platsData = response.data.content;
      } else {
        platsData = [];
      }
      setPlats(platsData);
    } catch (error) {
      console.error('Erreur fetchPlats:', error);
      setPlats([]);
    }
  };

  const handleImageUpload = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  
  setImageFile(file);  // ← AJOUTEZ CETTE LIGNE
  const objectUrl = URL.createObjectURL(file);
  setImagePreview(objectUrl);
    setFormData({ ...formData, photo: file.name });
  };

  const { user } = useAuth();

  /*const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || user.role !== 'ADMIN') {
      toast.error('Accès interdit : connectez-vous avec un compte administrateur.');
      return;
    }

    try {
      const parsedPrix = parseFloat(formData.prixSpecial);
      const payload = {
        nomMenu: (formData.nomMenu || '').trim(),
        description: (formData.descriptionMenu || '').trim(),
        prix: isNaN(parsedPrix) ? null : parsedPrix,
        photo: formData.photo || '',
        actif: !!formData.actif,
        platIds: selectedPlats.map((p) => p.idPlat)
      };

      console.log('Payload menu:', payload);

      if (editingMenu) {
        await menuService.update(editingMenu.idMenu, payload);
        toast.success('Menu modifié avec succès');
      } else {
        await menuService.create(payload);
        toast.success('Menu créé avec succès');
      }
      fetchMenus();
      closeModal();
    } catch (error) {
      console.error('Erreur handleSubmit:', error);
      if (error.response) {
        console.error('Réponse backend:', error.response.data);
        if (error.response.status === 403) {
          toast.error('Accès interdit : rôle administrateur requis.');
        } else {
          toast.error(`Erreur: ${JSON.stringify(error.response.data)}`);
        }
      } else {
        toast.error('Erreur lors de l\'enregistrement');
      }
    }
  };*/

    const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!user || user.role !== 'ADMIN') {
    toast.error('Accès interdit');
    return;
  }
  
  try {
    let imageUrl = formData.photo;
    
    if (imageFile) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', imageFile);
      
      // ✅ Utiliser le bon chemin
      const uploadResponse = await api.post('/images/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // ✅ Récupérer le nom du fichier
      if (uploadResponse.data.fileName) {
        imageUrl = uploadResponse.data.fileName;
      } else if (uploadResponse.data.url) {
        const urlParts = uploadResponse.data.url.split('/');
        imageUrl = urlParts[urlParts.length - 1];
      }
    }
    
    const payload = {
      nomMenu: formData.nomMenu.trim(),
      descriptionMenu: formData.descriptionMenu.trim(),
      prixSpecial: parseFloat(formData.prixSpecial),
      photo: imageUrl,  // Stocker le nom du fichier
      actif: formData.actif,
      platIds: selectedPlats.map(p => p.idPlat)
    };
    
    if (editingMenu) {
      await menuService.update(editingMenu.idMenu, payload);
      toast.success('Menu modifié avec succès');
    } else {
      await menuService.create(payload);
      toast.success('Menu créé avec succès');
    }
    
    fetchMenus();
    closeModal();
  } catch (error) {
    console.error('Erreur:', error);
    toast.error('Erreur lors de l\'enregistrement');
  }
};

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce menu ?')) {
      try {
        await menuService.delete(id);
        toast.success('Menu supprimé');
        fetchMenus();
      } catch (error) {
        console.error('Erreur handleDelete:', error);
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
        toast.success(`"${plat.nomPlat}" ajouté au menu`);
      } catch (error) {
        console.error('Erreur addPlat:', error);
        toast.error('Erreur lors de l\'ajout du plat');
      }
    } else {
      if (!selectedPlats.find(p => p.idPlat === plat.idPlat)) {
        setSelectedPlats((prev) => [...prev, plat]);
        toast.success(`"${plat.nomPlat}" ajouté au menu`);
      }
    }
  };

  const handleRemovePlatFromMenu = async (platId, platNom) => {
    if (editingMenu) {
      try {
        await menuService.removePlat(editingMenu.idMenu, platId);
        setSelectedPlats((prev) => prev.filter((plat) => plat.idPlat !== platId));
        toast.success(`"${platNom}" retiré du menu`);
      } catch (error) {
        console.error('Erreur removePlat:', error);
        toast.error('Erreur lors de la suppression du plat');
      }
    } else {
      setSelectedPlats((prev) => prev.filter((plat) => plat.idPlat !== platId));
      toast.success(`"${platNom}" retiré du menu`);
    }
  };

  const openModal = async (menu = null) => {
    if (menu) {
      setEditingMenu(menu);
      setFormData({
        nomMenu: menu.nomMenu || '',
        descriptionMenu: menu.descriptionMenu || '',
        prixSpecial: menu.prixSpecial || '',
        photo: menu.photo || '',
        actif: menu.actif !== undefined ? menu.actif : true
      });
      setImagePreview(menu.photo || '');

      if (menu.plats && Array.isArray(menu.plats)) {
        setSelectedPlats(menu.plats);
      } else {
        try {
          const platsResponse = await menuService.getPlatsDuMenu(menu.idMenu);
          setSelectedPlats(platsResponse.data || []);
        } catch (error) {
          setSelectedPlats([]);
        }
      }
    } else {
      setEditingMenu(null);
      setFormData({ nomMenu: '', descriptionMenu: '', prixSpecial: '', photo: '', actif: true });
      setSelectedPlats([]);
      setImagePreview('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMenu(null);
    setSelectedPlats([]);
    setImagePreview('');
  };

  const filteredMenus = Array.isArray(menus) 
    ? menus.filter(m => m.nomMenu?.toLowerCase().includes(search.toLowerCase()))
    : [];

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

      {/* Desktop Table */}
      <div className="bg-white-pure rounded-xl shadow-sm overflow-x-auto">
        {filteredMenus.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-dark">Aucun menu trouvé</p>
          </div>
        ) : (
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
                  <td className="px-6 py-4 text-sm text-gray-dark max-w-xs truncate">{menu.descriptionMenu || '-'}</td>
                  <td className="px-6 py-4 text-gold font-semibold">{Number(menu.prixSpecial ?? 0).toFixed(2)} €</td>
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
        )}
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
                  <label className="block text-sm font-medium mb-1">Prix spécial (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.prixSpecial}
                    onChange={(e) => setFormData({...formData, prixSpecial: e.target.value})}
                    required
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.descriptionMenu}
                  onChange={(e) => setFormData({...formData, descriptionMenu: e.target.value})}
                  rows="3"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Photo du menu</label>
                <div className="grid gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="input"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="Aperçu" className="h-20 w-20 object-cover rounded-md" />
                      <p className="text-xs text-gray-dark mt-1 break-all">Lien: {formData.photo}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.actif}
                  onChange={(e) => setFormData({...formData, actif: e.target.checked})}
                />
                <span className="text-sm">Menu actif (visible pour les clients)</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Plats dans ce menu</label>
                  <div className="border border-gray-light rounded-lg p-4 max-h-48 overflow-y-auto">
                    {selectedPlats.length === 0 ? (
                      <p className="text-gray-dark text-sm text-center">Aucun plat dans ce menu</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedPlats.map((plat) => (
                          <div key={plat.idPlat} className="flex justify-between items-center bg-gray-light p-2 rounded">
                            <span className="text-sm">{plat.nomPlat}</span>
                            <button
                              type="button"
                              onClick={() => handleRemovePlatFromMenu(plat.idPlat, plat.nomPlat)}
                              className="text-red-500 text-xs hover:text-red-700"
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
                    {plats.length === 0 ? (
                      <p className="text-gray-dark text-sm text-center">Aucun plat disponible</p>
                    ) : (
                      plats
                        .filter(p => !selectedPlats.find(sp => sp.idPlat === p.idPlat))
                        .map((plat) => (
                          <div key={plat.idPlat} className="flex justify-between items-center p-2 border-b last:border-b-0">
                            <span className="text-sm">{plat.nomPlat}</span>
                            <button
                              type="button"
                              onClick={() => handleAddPlatToMenu(plat)}
                              className="text-blue-500 text-xs hover:text-blue-700"
                            >
                              Ajouter
                            </button>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                <button type="submit" className="btn-primary w-full sm:w-auto">
                  {editingMenu ? 'Modifier' : 'Créer'}
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