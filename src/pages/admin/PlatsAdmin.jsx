import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Utensils, Upload, X } from 'lucide-react';
import { platService } from '../../services/platService';
import api from '../../services/api';  // ✅ AJOUTER CET IMPORT
import toast from 'react-hot-toast';
import Loader from '../../components/Common/Loader';
import { useAuth } from '../../hooks/useAuth';

export default function PlatsAdmin() {
  const [plats, setPlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlat, setEditingPlat] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    nomPlat: '',
    description: '',
    prix: '',
    categorie: '',
    imagePlat: '',
    disponibilite: true
  });

  const { user } = useAuth();  // ✅ DÉPLACER ICI

  const categoryOptions = [
    { label: 'Apéro', value: 'APERO' },
    { label: 'Entrées', value: 'ENTREE' },
    { label: 'Plats', value: 'PLAT_PRINCIPAL' },
    { label: 'Desserts', value: 'DESSERT' },
    { label: 'Boissons', value: 'BOISSON' }
  ];

  const getCategoryLabel = (value) => {
    return categoryOptions.find(item => item.value === value)?.label || value || '-';
  };

  useEffect(() => {
    fetchPlats();
  }, []);

  const fetchPlats = async () => {
    try {
      setLoading(true);
      const response = await platService.getAll();
      let platsData = [];
      if (Array.isArray(response.data)) {
        platsData = response.data;
      } else if (response.data?.content) {
        platsData = response.data.content;
      } else {
        platsData = [];
      }
      setPlats(platsData);
    } catch (error) {
      console.error('Erreur fetchPlats:', error);
      toast.error('Erreur lors du chargement des plats');
      setPlats([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fonction handleImageUpload (décommentée)
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5MB');
      return;
    }
    
    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    setFormData({ ...formData, imagePlat: file.name });
  };

  /* ✅ Fonction pour uploader l'image vers le backend
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await api.post('/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.url; // Retourne l'URL de l'image
    } catch (error) {
      console.error('Erreur upload image:', error);
      return null;
    }
  };*/
  // pages/admin/PlatsAdmin.jsx - fonction uploadImage modifiée
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await api.post('/api/v1/images/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    // Le backend retourne { url: "/api/v1/images/nom_fichier.jpg" }
    return response.data.url;
  } catch (error) {
    console.error('Erreur upload image:', error);
    return null;
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!user || user.role !== 'ADMIN') {
    toast.error('Accès interdit');
    return;
  }
  
  try {
    let imageFileName = formData.imagePlat;
    
    if (imageFile) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', imageFile);
      
      // ✅ baseURL est déjà /api/v1, donc juste '/images/upload'
      const uploadResponse = await api.post('/images/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // ✅ Le backend doit retourner fileName
      imageFileName = uploadResponse.data.fileName;
      console.log('Image uploadée:', imageFileName);
    }
    
    const payload = {
      nomPlat: formData.nomPlat.trim(),
      description: formData.description.trim(),
      prix: parseFloat(formData.prix),
      categorie: formData.categorie,
      disponibilite: formData.disponibilite
    };
    
    // ✅ N'ajouter imagePlat que si on a un nom de fichier
    if (imageFileName) {
      payload.imagePlat = imageFileName;
    }

    if (editingPlat) {
      await platService.update(editingPlat.idPlat, payload);
      toast.success('Plat modifié avec succès');
    } else {
      await platService.create(payload);
      toast.success('Plat créé avec succès');
    }
    
    fetchPlats();
    closeModal();
  } catch (error) {
    console.error('Erreur:', error);
    toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
  }
};

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
      try {
        await platService.delete(id);
        toast.success('Plat supprimé');
        fetchPlats();
      } catch (error) {
        console.error('Erreur handleDelete:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const openModal = (plat = null) => {
    if (plat) {
      setEditingPlat(plat);
      setFormData({
        nomPlat: plat.nomPlat || '',
        description: plat.description || '',
        prix: plat.prix || '',
        categorie: plat.categorie || '',
        imagePlat: plat.imagePlat || '',
        disponibilite: plat.disponibilite !== undefined ? plat.disponibilite : true
      });
      setImagePreview(plat.imagePlat || '');
      setImageFile(null);
    } else {
      setEditingPlat(null);
      setFormData({ 
        nomPlat: '', 
        description: '', 
        prix: '', 
        categorie: '', 
        imagePlat: '', 
        disponibilite: true 
      });
      setImagePreview('');
      setImageFile(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlat(null);
    setImagePreview('');
    setImageFile(null);
  };

  const filteredPlats = Array.isArray(plats) 
    ? plats.filter(p => p.nomPlat?.toLowerCase().includes(search.toLowerCase()))
    : [];

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

      {/* Afficher le nombre de plats */}
      <div className="mb-4 text-sm text-gray-dark">
        {filteredPlats.length} plat(s) trouvé(s)
      </div>

      {/* Desktop Table */}
      <div className="bg-white-pure rounded-xl shadow-sm overflow-x-auto">
        {filteredPlats.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-dark">Aucun plat trouvé. Cliquez sur "Ajouter un plat" pour commencer.</p>
          </div>
        ) : (
          <table className="w-full min-w-[768px]">
            <thead className="bg-gray-light">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Image</th>
                <th className="px-6 py-3 text-left">Nom</th>
                <th className="px-6 py-3 text-left">Catégorie</th>
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
                    {plat.imagePlat ? (
                      <img 
                        src={`http://localhost:8080/api/v1/images/${plat.imagePlat}`}
                        alt={plat.nomPlat} 
                        className="h-12 w-12 object-cover rounded-md" 
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/48?text=No+img'; }}
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-light rounded-md flex items-center justify-center text-sm text-gray-dark">N/A</div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-black-deep">{plat.nomPlat}</td>
                  <td className="px-6 py-4 text-sm text-gray-dark">{getCategoryLabel(plat.categorie)}</td>
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
        )}
      </div>

      {/* Modal - gardez le code existant */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black-deep bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white-pure rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingPlat ? 'Modifier le plat' : 'Ajouter un plat'}
            </h2>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom du plat *</label>
                <input
                  type="text"
                  value={formData.nomPlat}
                  onChange={(e) => setFormData({...formData, nomPlat: e.target.value})}
                  required
                  className="input"
                  placeholder="Ex: Pizza Margherita"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Catégorie *</label>
                <select
                  value={formData.categorie}
                  onChange={(e) => setFormData({...formData, categorie: e.target.value})}
                  className="input"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Prix (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.prix}
                    onChange={(e) => setFormData({...formData, prix: e.target.value})}
                    required
                    className="input"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Disponible</label>
                  <select
                    value={formData.disponibilite ? 'true' : 'false'}
                    onChange={(e) => setFormData({...formData, disponibilite: e.target.value === 'true'})}
                    className="input"
                  >
                    <option value="true">Oui</option>
                    <option value="false">Non</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  className="input"
                  placeholder="Description détaillée du plat..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image du plat</label>
                <div className="grid gap-3">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-light rounded-lg cursor-pointer hover:bg-gray-light/50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-dark mb-2" />
                      <p className="text-sm text-gray-dark">
                        <span className="font-semibold">Cliquez pour importer</span> ou glissez-déposez
                      </p>
                      <p className="text-xs text-gray-dark">PNG, JPG, JPEG (max. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  
                  {imagePreview && (
                    <div className="relative mt-2 inline-block">
                      <img 
                        src={imagePreview} 
                        alt="Aperçu" 
                        className="h-24 w-24 object-cover rounded-md border border-gray-light" 
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setImageFile(null);
                          setFormData({...formData, imagePlat: ''});
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                      <p className="text-xs text-gray-dark mt-1 break-all">
                        Fichier: {imageFile?.name || formData.imagePlat}
                      </p>
                    </div>
                  )}
                </div>
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