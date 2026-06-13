import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, CookingPot, PackageCheck, Truck, Star, MessageSquare, XCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { commandeService } from '../services/commandeService';
import { avisService } from '../services/avisService';
import { useTranslation } from '../i18n/I18nContext';
import Loader from '../components/Common/Loader';
import toast from 'react-hot-toast';

const statusStepIds = [
  { id: 'EN_ATTENTE', icon: Clock, color: 'bg-gray-500' },
  { id: 'EN_PREPARATION', icon: CookingPot, color: 'bg-blue-500' },
  { id: 'PRETE', icon: PackageCheck, color: 'bg-green-500' },
  { id: 'SERVIE', icon: Truck, color: 'bg-gray-400' }
];

const TERMINAL_STATUSES = ['PAYEE', 'ANNULEE'];

export default function CommandesPage() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [commandes, setCommandes] = useState([]);
  const [avisExistants, setAvisExistants] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [showAvisModal, setShowAvisModal] = useState(false);
  const [avisNote, setAvisNote] = useState(5);
  const [avisCommentaire, setAvisCommentaire] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated() && user) {
      fetchCommandes();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Dans CommandesPage.jsx, remplacez la partie de récupération des avis :

const fetchCommandes = async () => {
  try {
    const userId = user?.idUser || user?.id;
    const response = await commandeService.getHistorique(userId);
    const commandesData = response.data || [];
    setCommandes(commandesData);
    
    // ✅ Récupérer TOUS les avis d'un coup, pas un par un
    try {
      const avisResponse = await avisService.getAll();
      if (avisResponse?.data && Array.isArray(avisResponse.data)) {
        const avisMap = {};
        avisResponse.data.forEach(avis => {
          // Lier l'avis à la commande (adapter selon votre structure)
          const commandeId = avis.commande?.idCommande || avis._ID_COMMANDE;
          if (commandeId) {
            avisMap[commandeId] = avis;
          }
        });
        setAvisExistants(avisMap);
      }
    } catch (e) {
      console.warn('Erreur chargement avis:', e);
    }
  } catch (error) {
    console.error('Erreur chargement commandes:', error);
    toast.error('Erreur lors du chargement des commandes');
  } finally {
    setLoading(false);
  }
};

  /*const fetchCommandes = async () => {
    try {
      const userId = user?.idUser || user?.id;
      const response = await commandeService.getHistorique(userId);
      const commandesData = response.data || [];
      setCommandes(commandesData);
      
      // Vérifier les avis existants pour chaque commande
      const avisMap = {};
      for (const cmd of commandesData) {
        try {
          const avisResponse = await avisService.getByCommande?.(cmd.idCommande);
          if (avisResponse?.data) {
            avisMap[cmd.idCommande] = avisResponse.data;
          }
        } catch (e) {
          // Pas d'avis
        }
      }
      setAvisExistants(avisMap);
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };*/

  const getCurrentStepIndex = (statut) => {
    if (statut === 'PAYEE') return 3;
    return statusStepIds.findIndex(step => step.id === statut);
  };

  const statusSteps = [
    { id: 'EN_ATTENTE', label: t('orders.status.EN_ATTENTE'), icon: Clock, color: 'bg-gray-500' },
    { id: 'EN_PREPARATION', label: t('orders.status.EN_PREPARATION'), icon: CookingPot, color: 'bg-blue-500' },
    { id: 'PRETE', label: t('orders.status.PRETE'), icon: PackageCheck, color: 'bg-green-500' },
    { id: 'SERVIE', label: t('orders.status.SERVIE'), icon: Truck, color: 'bg-gray-400' }
  ];

  const getStatusBadge = (statut) => {
    const config = {
      'EN_ATTENTE': { label: t('orders.status.EN_ATTENTE'), color: 'bg-gray-500' },
      'EN_PREPARATION': { label: t('orders.status.EN_PREPARATION'), color: 'bg-blue-500' },
      'PRETE': { label: t('orders.status.PRETE'), color: 'bg-green-500' },
      'SERVIE': { label: t('orders.status.SERVIE'), color: 'bg-gray-400' },
      'PAYEE': { label: t('orders.status.PAYEE'), color: 'bg-green-600' },
      'ANNULEE': { label: t('orders.status.ANNULEE'), color: 'bg-red-500' }
    };
    const c = config[statut] || { label: statut, color: 'bg-gray-500' };
    return <span className={`px-2 py-1 rounded-full text-xs text-white ${c.color}`}>{c.label}</span>;
  };

  const handleOpenAvisModal = (commande) => {
    setSelectedCommande(commande);
    setAvisNote(5);
    setAvisCommentaire('');
    setShowAvisModal(true);
  };

  const handleSubmitAvis = async () => {
  if (!selectedCommande) return;
  
  setSubmitting(true);
  try {
    // ✅ Format attendu par AvisRequest
    const avisData = {
      commandeId: selectedCommande.idCommande,  // ← l'ID de la commande
      note: avisNote.toString(),
      commentaire: avisCommentaire
    };
    
    console.log('📦 Envoi avis:', avisData);
    
    const response = await avisService.create(avisData);
    console.log('✅ Réponse:', response.data);
    
    toast.success('Merci pour votre avis !');
    setShowAvisModal(false);
    setAvisNote(5);
    setAvisCommentaire('');
    fetchCommandes(); // Recharger les commandes
  } catch (error) {
    console.error('Erreur avis:', error);
    if (error.response?.data) {
      console.error('Détails erreur:', error.response.data);
      toast.error(error.response.data?.message || 'Erreur lors de l\'envoi de l\'avis');
    } else {
      toast.error('Erreur lors de l\'envoi de l\'avis');
    }
  } finally {
    setSubmitting(false);
  }
};

  const renderStars = (rating, interactive = false, onRate = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate?.(star)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            {star <= rating ? (
              <Star className="w-6 h-6 fill-gold text-gold" />
            ) : (
              <Star className="w-6 h-6 text-gray-300" />
            )}
          </button>
        ))}
      </div>
    );
  };

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('errors.notAuthenticated')}</h2>
          <p className="text-gray-500 mb-6">{t('orders.notAuthenticatedDesc')}</p>
          <Link to="/login" className="bg-black-deep text-white px-6 py-2 rounded-lg">{t('nav.login')}</Link>
        </div>
      </div>
    );
  }

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8 text-center">{t('orders.title')}</h1>
        
        {commandes.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <p className="text-gray-500 mb-4">{t('orders.noOrders')}</p>
            <Link to="/menu" className="bg-black-deep text-white px-6 py-2 rounded-lg inline-block">{t('cart.discoverMenu')}</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {commandes.map((cmd) => {
              const currentStepIndex = getCurrentStepIndex(cmd.statut);
              const hasAvis = avisExistants[cmd.idCommande];
              const canLeaveAvis = (cmd.statut === 'SERVIE' || cmd.statut === 'PAYEE') && !hasAvis;
              
              return (
                <div key={cmd.idCommande} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-lg">{t('orders.orderNumber')} #{cmd.idCommande}</span>
                        {getStatusBadge(cmd.statut)}
                      </div>
                      <p className="text-gray-500 text-sm mt-1">{new Date(cmd.dateCommande).toLocaleString('fr-FR')}</p>
                      <p className="text-gray-500 text-sm">{t('orders.table')} {cmd.numeroTable}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-black-deep">{cmd.montantTotal?.toFixed(2)} €</p>
                      {canLeaveAvis && (
                        <button
                          onClick={() => handleOpenAvisModal(cmd)}
                          className="mt-2 text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-gray-200 transition"
                        >
                          <MessageSquare size={14} /> {t('orders.giveReview')}
                        </button>
                      )}
                      {hasAvis && (
                        <div className="mt-2 flex items-center justify-end gap-1">
                          {renderStars(parseInt(hasAvis.note) || 5)}
                          <span className="text-xs text-gray-400 ml-1">{t('orders.reviewGiven')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Timeline */}
                  {cmd.statut === 'ANNULEE' ? (
                    <div className="mb-4 pt-2 text-center">
                      <span className="inline-flex items-center gap-1 text-red-500 text-sm font-medium">
                        <XCircle size={16} /> {t('orders.status.ANNULEE')}
                      </span>
                    </div>
                  ) : (
                    <div className="mb-4 pt-2">
                      <div className="relative">
                        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200">
                          <div className="h-full bg-gray-800 transition-all" style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }} />
                        </div>
                        <div className="relative flex justify-between">
                          {statusSteps.map((step, idx) => {
                            const isCompleted = idx <= currentStepIndex;
                            const Icon = step.icon;
                            return (
                              <div key={step.id} className="text-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${isCompleted ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                  <Icon size={14} />
                                </div>
                                <p className={`text-xs mt-1 ${isCompleted ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>{step.label}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {cmd.statut === 'PAYEE' && (
                        <p className="text-center text-green-600 text-sm font-medium mt-2">✓ {t('orders.status.PAYEE')}</p>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <h3 className="font-semibold text-sm mb-2">{t('orders.dishes')} :</h3>
                    <div className="flex flex-wrap gap-2">
                      {cmd.platsCommandes?.slice(0, 3).map((plat, idx) => (
                        <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-sm">{plat.platNom} x{plat.quantite}</span>
                      ))}
                      {cmd.platsCommandes?.length > 3 && <span className="text-gray-500 text-sm">+{cmd.platsCommandes.length - 3} autres</span>}
                    </div>
                  </div>
                  
                  <button onClick={() => setSelectedCommande(cmd)} className="mt-3 text-gray-700 text-sm hover:underline">
                    {t('orders.viewDetails')} {'>'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Modal Détails Commande */}
      {selectedCommande && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{t('orders.orderNumber')} #{selectedCommande.idCommande}</h2>
              <button onClick={() => setSelectedCommande(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-4">
              <div className="border-b pb-3">
                <p><strong>{t('common.date')} :</strong> {new Date(selectedCommande.dateCommande).toLocaleString('fr-FR')}</p>
                <p><strong>{t('orders.table')} :</strong> {selectedCommande.numeroTable}</p>
                <p><strong>{t('common.status')} :</strong> {selectedCommande.statut}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">{t('orders.dishes')} :</h3>
                <div className="space-y-2">
                  {selectedCommande.platsCommandes?.map((plat, idx) => (
                    <div key={idx} className="flex justify-between border-b pb-2">
                      <span>{plat.platNom} x{plat.quantite}</span>
                      <span className="text-black-deep">{(plat.prixUnitaire * plat.quantite).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-3 border-t">
                <div className="flex justify-between font-bold text-lg">
                  <span>{t('common.total')}</span>
                  <span className="text-black-deep">{selectedCommande.montantTotal?.toFixed(2)} €</span>
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedCommande(null)} className="w-full bg-black-deep text-white py-2 rounded-xl font-semibold mt-6">{t('common.close')}</button>
          </div>
        </div>
      )}

      {/* Modal Avis */}
      {showAvisModal && selectedCommande && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="text-center mb-4">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-7 h-7 text-gray-600" />
              </div>
              <h2 className="text-xl font-bold">{t('orders.giveReview')}</h2>
              <p className="text-gray-500 text-sm">{t('orders.orderNumber')} #{selectedCommande.idCommande}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('reviews.yourRating')}</label>
              {renderStars(avisNote, true, setAvisNote)}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('reviews.yourComment')}</label>
              <textarea
                value={avisCommentaire}
                onChange={(e) => setAvisCommentaire(e.target.value)}
                rows="3"
                className="w-full p-3 rounded-lg border border-gray-200 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                placeholder={t('reviews.placeholder')}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleSubmitAvis}
                disabled={submitting}
                className="flex-1 bg-black-deep hover:bg-gray-800 text-white py-2 rounded-lg font-semibold disabled:opacity-50"
              >
                {submitting ? t('reviews.sending') : t('reviews.send')}
              </button>
              <button
                onClick={() => setShowAvisModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}