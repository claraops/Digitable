import { useState, useEffect } from 'react';
import { User, Mail, Globe, LogOut, Edit2, ShoppingBag } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { utilisateurService } from '../services/utilisateurService';
import { useTranslation } from '../i18n/I18nContext';
import Loader from '../components/Common/Loader';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, logout, isAuthenticated, login } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    langue: 'fr',
    telephone: ''
  });

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
    if (user) {
      setLoading(false);
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      const userId = user.idUser || user.id;
      await utilisateurService.update(parseInt(userId), formData);
      toast.success('Profil mis a jour !');
      setIsEditing(false);
      const updatedUser = { ...user, ...formData };
      login(updatedUser);
    } catch (error) {
      toast.error('Erreur lors de la mise a jour');
    }
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
      <div className="container mx-auto px-4 max-w-5xl space-y-6">

        <div className="bg-white-pure rounded-xl p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center">
                <User size={40} className="text-black-deep" />
              </div>
              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <input type="text" value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} placeholder="Prenom" className="input text-sm" />
                    <input type="text" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} placeholder="Nom" className="input text-sm" />
                    <input type="tel" value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} placeholder="Telephone" className="input text-sm" />
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold">{user?.prenom} {user?.nom}</h1>
                    <div className="flex items-center gap-2 text-gray-dark mt-1">
                      <Mail size={16} /><span className="text-sm">{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-dark mt-1">
                      <Globe size={16} /><span className="text-sm">{user?.langue === 'fr' ? 'Francais' : user?.langue === 'en' ? 'English' : 'Espanol'}</span>
                    </div>
                    {user?.telephone && (
                      <div className="flex items-center gap-2 text-gray-dark mt-1">
                        <span className="text-sm">{user.telephone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-700 mt-1">
                      <span className="text-sm font-semibold">{t('profile.role')}: {user?.role}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {isEditing ? (
                <>
                  <button onClick={handleUpdate} className="btn-primary text-sm px-4 py-2">{t('common.save')}</button>
                  <button onClick={() => setIsEditing(false)} className="btn-secondary text-sm px-4 py-2">{t('common.cancel')}</button>
                </>
              ) : (
                <>
                  <button onClick={() => setIsEditing(true)} className="bg-black-deep text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-gold hover:text-black-deep transition-all flex items-center gap-1">
                    <Edit2 size={16} /> {t('common.edit')}
                  </button>
                  <button onClick={logout} className="bg-red-500 text-white text-sm px-4 py-2 flex items-center gap-1 rounded-lg font-semibold hover:bg-red-600 transition-all shadow-sm">
                    <LogOut size={16} /> {t('nav.logout')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <Link to="/mes-commandes" className="flex items-center justify-between bg-white-pure rounded-xl p-5 hover:shadow-md transition-all border border-gray-light">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
              <ShoppingBag size={20} className="text-gold" />
            </div>
            <div>
              <p className="font-semibold text-black-deep">Mes commandes</p>
              <p className="text-xs text-gray-400">Voir l'historique et le suivi</p>
            </div>
          </div>
          <span className="text-gold font-bold">{'>'}</span>
        </Link>

      </div>
    </div>
  );
}
