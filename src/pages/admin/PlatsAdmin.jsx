import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Utensils } from 'lucide-react';
import { platService } from '../../services/platService';
import toast from 'react-hot-toast';
import Loader from '../../components/Common/Loader';

export default function PlatsAdmin() {
  const [plats, setPlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlat, setEditingPlat] = useState(null);
  const [formData, setFormData] = useState({
    nomPlat: '',
    description: '',
    prix: '',
    image: '',
    disponibilite: true
  });

  useEffect(() => {
    fetchPlats();
  }, []);

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
      toast.error('Erreur lors du chargement des plats');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlat) {
        await platService.update(editingPlat.idPlat, formData);
        toast.success('Plat modifié avec succès');
      } else {
        await platService.create(formData);
        toast.success('Plat créé avec succès');
      }
      fetchPlats();
      closeModal();
    } catch {
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
      try {
        await platService.delete(id);
        toast.success('Plat supprimé');
        fetchPlats();
      } catch {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData({ ...formData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const openModal = (plat = null) => {
    if (plat) {
      setEditingPlat(plat);
      setFormData({
        nomPlat: plat.nomPlat,
        description: plat.description || '',
        prix: plat.prix,
        image: plat.image || '',
        disponibilite: plat.disponibilite
      });
    } else {
      setEditingPlat(null);
      setFormData({ nomPlat: '', description: '', prix: '', image: '', disponibilite: true });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlat(null);
  };

  const filteredPlats = plats.filter(p => 
    p.nomPlat?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div>
      <div className="bg-gray-light rounded-3xl p-6 mb-8 shadow-sm border border-gray-light">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-dark mb-2 flex items-center gap-2">
              <Utensils size={18} /> Gérer le plat
            </p>
            <h1 className="text-3xl font-bold">Gestion des Plats</h1>
            <p className="text-gray-dark mt-2">Ajoutez, modifiez et supprimez les plats avec image et disponibilité.</p>
          </div>
          <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 self-start md:self-auto">
            <Plus size={20} /> Ajouter un plat
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-dark" size={18} />
        <input
          type="text"
          placeholder="Rechercher un plat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Table */}
      <div className="space-y-4 sm:hidden">
        {filteredPlats.map((plat) => (
          <div key={plat.idPlat} className="bg-white-pure rounded-3xl border border-gray-light p-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-2xl overflow-hidden bg-gray-light flex items-center justify-center">
                {plat.image ? (
                  <img src={plat.image} alt={plat.nomPlat} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs text-gray-dark">Aucune image</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-lg text-black-deep">{plat.nomPlat}</h3>
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      plat.disponibilite ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {plat.disponibilite ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-dark overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {plat.description || '-'}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-gold">{Number(plat.prix ?? 0).toFixed(2)} €</span>
                    <span className="text-gray-dark">ID #{plat.idPlat}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={() => openModal(plat)} className="btn-secondary w-full sm:w-auto">
                <Edit2 size={18} /> Modifier
              </button>
              <button onClick={() => handleDelete(plat.idPlat)} className="btn-secondary w-full sm:w-auto text-red-500 hover:text-red-700">
                <Trash2 size={18} /> Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden sm:block bg-white-pure rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full min-w-[768px]">
          <thead className="bg-gray-light">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Image</th>
              <th className="px-6 py-3 text-left">Nom</th>
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-left">Prix</th>
              <th className="px-6 py-3 text-left">Disponible</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlats.map((plat) => (
              <tr key={plat.idPlat} className="border-b border-gray-light hover:bg-gray-light/50 transition-colors">
                <td className="px-6 py-4">#{plat.idPlat}</td>
                <td className="px-6 py-4">
                  {plat.image ? (
                    <img src={plat.image} alt={plat.nomPlat} className="h-12 w-12 object-cover rounded-md" />
                  ) : (
                    <div className="h-12 w-12 bg-gray-light rounded-md flex items-center justify-center text-sm text-gray-dark">N/A</div>
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-black-deep">{plat.nomPlat}</td>
                <td className="px-6 py-4 text-sm text-gray-dark max-w-md truncate">{plat.description || '-'}</td>
                <td className="px-6 py-4 font-semibold text-gold">{Number(plat.prix ?? 0).toFixed(2)} €</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    plat.disponibilite ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {plat.disponibilite ? 'Disponible' : 'Indisponible'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => openModal(plat)} className="text-blue-500 hover:text-blue-700">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(plat.idPlat)} className="text-red-500 hover:text-red-700">
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
              {editingPlat ? 'Modifier le plat' : 'Ajouter un plat'}
            </h2>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom du plat</label>
                  <input
                    type="text"
                    value={formData.nomPlat}
                    onChange={(e) => setFormData({...formData, nomPlat: e.target.value})}
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

              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <div className="grid gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="input"
                  />
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="input"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Aperçu"
                      className="h-32 w-full object-cover rounded-xl border border-gray-light"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.disponibilite}
                    onChange={(e) => setFormData({...formData, disponibilite: e.target.checked})}
                  />
                  <span className="text-sm">Disponible</span>
                </label>
              </div>

              <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                <button type="submit" className="btn-primary w-full sm:w-auto">
                  {editingPlat ? 'Modifier' : 'Ajouter'}
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