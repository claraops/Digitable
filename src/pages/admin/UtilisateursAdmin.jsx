import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { utilisateurService } from '../../services/utilisateurService';
import toast from 'react-hot-toast';
import Loader from '../../components/Common/Loader';

export default function UtilisateursAdmin() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    langue: 'fr',
    role: 'CLIENT',
    password: ''
  });

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const fetchUtilisateurs = async () => {
    try {
      const response = await utilisateurService.getAll();
      let usersData = [];
      if (Array.isArray(response.data)) {
        usersData = response.data;
      } else if (response.data?.content && Array.isArray(response.data.content)) {
        usersData = response.data.content;
      } else {
        usersData = [];
      }
      setUtilisateurs(usersData);
    } catch (error) {
      console.error('Erreur fetchUtilisateurs:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
      setUtilisateurs([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        telephone: user.telephone || '',
        langue: user.langue || 'fr',
        role: user.role || 'CLIENT',
        password: ''
      });
    } else {
      setEditingUser(null);
      setFormData({ nom: '', prenom: '', email: '', telephone: '', langue: 'fr', role: 'CLIENT', password: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { ...formData };
      if (editingUser && !payload.password) {
        delete payload.password;
      }

      if (editingUser) {
        await utilisateurService.update(editingUser.idUser, payload);
        toast.success('Utilisateur modifié avec succès');
      } else {
        await utilisateurService.create(payload);
        toast.success('Utilisateur créé avec succès');
      }
      fetchUtilisateurs();
      closeModal();
    } catch (error) {
      console.error('Erreur handleSubmit:', error);
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await utilisateurService.delete(id);
        toast.success('Utilisateur supprimé');
        fetchUtilisateurs();
      } catch (error) {
        console.error('Erreur handleDelete:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const filteredUsers = Array.isArray(utilisateurs) 
    ? utilisateurs.filter((user) =>
        `${user.nom} ${user.prenom} ${user.email}`.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  if (loading) return <Loader />;

  return (
    <div>
      <div className="bg-gray-light rounded-3xl p-6 mb-8 shadow-sm border border-gray-light">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-dark mb-2 flex items-center gap-2">
              👥 Gérer les utilisateurs
            </p>
            <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
            <p className="text-gray-dark mt-2">Consultez, modifiez et supprimez les comptes utilisateurs.</p>
          </div>
          <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 self-start md:self-auto">
            <Plus size={20} /> Ajouter un utilisateur
          </button>
        </div>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-dark" size={18} />
        <input
          type="text"
          placeholder="Rechercher un utilisateur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10"
        />
      </div>

      <div className="bg-white-pure rounded-xl shadow-sm overflow-x-auto">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-dark">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <table className="w-full min-w-[768px]">
            <thead className="bg-gray-light">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Nom</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Téléphone</th>
                <th className="px-6 py-3 text-left">Rôle</th>
                <th className="px-6 py-3 text-left">Langue</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.idUser} className="border-b border-gray-light hover:bg-gray-light/50">
                  <td className="px-6 py-4">#{user.idUser}</td>
                  <td className="px-6 py-4 font-medium">{user.prenom} {user.nom}</td>
                  <td className="px-6 py-4 text-sm text-gray-dark">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-dark">{user.telephone || '—'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'ADMIN' ? 'bg-gold text-black-deep' : 'bg-gray-light text-gray-dark'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{user.langue}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openModal(user)} className="text-blue-500 hover:text-blue-700">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(user.idUser)} className="text-red-500 hover:text-red-700">
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black-deep bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white-pure rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Prénom</label>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    required
                    className="input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className="input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Langue</label>
                  <select
                    value={formData.langue}
                    onChange={(e) => setFormData({ ...formData, langue: e.target.value })}
                    className="input"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rôle</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="input"
                  >
                    <option value="CLIENT">CLIENT</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mot de passe</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input"
                  placeholder={editingUser ? 'Laissez vide pour conserver' : ''}
                  required={!editingUser}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingUser ? 'Modifier' : 'Ajouter'}
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