import { useState, useEffect } from 'react';
import { User, Mail, Globe, Clock, LogOut, Edit2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { utilisateurService } from '../services/utilisateurService';
import { commandeService } from '../services/commandeService';
import { useTranslation } from '../i18n/I18nContext';
import Loader from '../components/Common/Loader';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, logout, isAuthenticated, login } = useAuth();
  const { t } = useTranslation();
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    langue: 'fr',
    telephone: ''
  });

  // ✅ Mettre à jour formData quand user change
  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        langue: user.langue || 'fr',
        telephone: user.telephone || ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchHistorique = async () => {
      setLoading(true);
      try {
        // ✅ Utiliser idUser ou id
        const userId = user.idUser || user.id;
        if (!userId || userId === 'undefined') {
          console.error('ID utilisateur invalide:', user);
          return;
        }
        const response = await commandeService.getHistorique(parseInt(userId));
        setCommandes(response.data || []);
      } catch (error) {
        console.error('Erreur chargement historique:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorique();
  }, [isAuthenticated, user]);

  const handleUpdate = async () => {
    try {
      const userId = user.idUser || user.id;
      await utilisateurService.update(parseInt(userId), formData);
      toast.success('Profil mis à jour !');
      setIsEditing(false);
      
      // ✅ Mettre à jour l'utilisateur dans le state en mémoire
      const updatedUser = { ...user, ...formData };
      login(updatedUser);
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getStatusBadge = (statut) => {
    const statusConfig = {
      'EN_ATTENTE': { label: t('orders.status.EN_ATTENTE'), color: 'bg-yellow-500' },
      'EN_PREPARATION': { label: t('orders.status.EN_PREPARATION'), color: 'bg-blue-500' },
      'PRETE': { label: t('orders.status.PRETE'), color: 'bg-gold' },
      'SERVIE': { label: t('orders.status.SERVIE'), color: 'bg-green-500' },
      'PAYEE': { label: t('orders.status.PAYEE'), color: 'bg-purple-500' },
      'ANNULEE': { label: t('orders.status.ANNULEE'), color: 'bg-red-500' }
    };
    const config = statusConfig[statut] || { label: statut, color: 'bg-gray-500' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs text-white ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('profile.notAuthenticated')}</h2>
          <p className="text-gray-dark mb-6">{t('profile.notAuthenticatedDesc')}</p>
          <Link to="/login" className="btn-primary inline-block">
            {t('nav.login')}
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen py-12 bg-gray-light">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Profile Header */}
        <div className="bg-white-pure rounded-xl p-6 mb-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center">
                <User size={40} className="text-black-deep" />
              </div>
              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.prenom}
                      onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                      placeholder="Prénom"
                      className="input text-sm"
                    />
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) => setFormData({...formData, nom: e.target.value})}
                      placeholder="Nom"
                      className="input text-sm"
                    />
                    <input
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                      placeholder="Téléphone"
                      className="input text-sm"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold">
                      {user?.prenom} {user?.nom}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-dark mt-1">
                      <Mail size={16} />
                      <span className="text-sm">{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-dark mt-1">
                      <Globe size={16} />
                      <span className="text-sm">{user?.langue === 'fr' ? t('auth.french') : user?.langue === 'en' ? t('auth.english') : t('auth.spanish')}</span>
                    </div>
                    {user?.telephone && (
                      <div className="flex items-center gap-2 text-gray-dark mt-1">
                        <span className="text-sm">📞 {user.telephone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gold mt-1">
                      <span className="text-sm font-semibold">{t('profile.role')}: {user?.role}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {isEditing ? (
                <>
                  <button onClick={handleUpdate} className="btn-primary text-sm px-4 py-2">
                    {t('common.save')}
                  </button>
                  <button onClick={() => setIsEditing(false)} className="btn-secondary text-sm px-4 py-2">
                    {t('common.cancel')}
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setIsEditing(true)} className="btn-secondary text-sm px-4 py-2 flex items-center gap-1">
                    <Edit2 size={16} /> {t('common.edit')}
                  </button>
                  <button onClick={logout} className="btn-danger text-sm px-4 py-2 flex items-center gap-1 bg-red-500 text-white rounded-lg hover:bg-red-600">
                    <LogOut size={16} /> {t('nav.logout')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Commandes */}
        <div className="bg-white-pure rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock size={20} className="text-gold" />
            {t('profile.orderHistory')}
          </h2>
          
          {commandes.length === 0 ? (
            <p className="text-gray-dark text-center py-8">{t('profile.noOrders')}</p>
          ) : (
            <div className="space-y-4">
              {commandes.map((cmd) => (
                <Link 
                  key={cmd.idCommande} 
                  to={`/tracking/${cmd.idCommande}`}
                  className="block border border-gray-light rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{t('orders.orderNumber')} #{cmd.idCommande}</p>
                      <p className="text-sm text-gray-dark">
                        {new Date(cmd.dateCommande).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-sm mt-1">
                        {cmd.nombrePlats || cmd.platsCommandes?.length || 0} plat(s)
                      </p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(cmd.statut)}
                      <p className="text-gold font-bold mt-2">{cmd.montantTotal?.toFixed(2)} €</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}