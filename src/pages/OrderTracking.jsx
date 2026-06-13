import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, CookingPot, Utensils, PackageCheck, MapPin } from 'lucide-react';
import { commandeService } from '../services/commandeService';
import { useTranslation } from '../i18n/I18nContext';
import Loader from '../components/Common/Loader';
import toast from 'react-hot-toast';

const stepIds = [
  { id: 'EN_ATTENTE', icon: Clock, color: 'bg-gray-light' },
  { id: 'EN_PREPARATION', icon: CookingPot, color: 'bg-blue-500' },
  { id: 'PRETE', icon: PackageCheck, color: 'bg-green-500' },
  { id: 'SERVIE', icon: Utensils, color: 'bg-green-500' },
];

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      commandeService.getById(id)
        .then(res => setCommande(res.data))
        .catch(err => {
          console.error(err);
          toast.error('Commande non trouvée');
          navigate('/');
        })
        .finally(() => setLoading(false));
    }
  }, [id, navigate]);

  const steps = stepIds.map(s => ({
    ...s,
    label: t('orders.tracking.' + ({
      'EN_ATTENTE': 'received',
      'EN_PREPARATION': 'preparing',
      'PRETE': 'ready',
      'SERVIE': 'served'
    }[s.id])
  )}));

  const getCurrentStepIndex = () => {
    if (!commande) return 0;
    const index = steps.findIndex(step => step.id === commande.statut);
    return index >= 0 ? index : 0;
  };

  if (loading) return <Loader fullScreen />;

  if (!commande) return null;

  return (
    <div className="min-h-screen py-12 bg-gray-light">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="bg-white-pure rounded-xl p-6 mb-8 text-center">
          <h1 className="text-2xl font-bold mb-2">{t('orders.tracking.title')}</h1>
          <p className="text-gray-dark">{t('orders.orderNumber')} #{commande.idCommande}</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-2">
            <MapPin size={16} className="text-gold" />
            <span className="text-sm font-medium text-black-deep">{t('orders.table')} {commande.numeroTable}</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white-pure rounded-xl p-6 mb-8">
          <div className="relative">
            {/* Barre de progression */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-gray-light">
              <div 
                className="h-full bg-gold transition-all duration-500"
                style={{ width: `${(getCurrentStepIndex() / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {/* Steps */}
            <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-4">
              {steps.map((step, index) => {
                const isCompleted = index <= getCurrentStepIndex();
                const Icon = step.icon;
                return (
                  <div key={step.id} className="text-center">
                    <div className={`
                      w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3
                      ${isCompleted ? 'bg-gold text-black-deep' : 'bg-gray-light text-gray-dark'}
                      transition-all duration-300
                    `}>
                      <Icon size={28} />
                    </div>
                    <p className={`text-sm font-medium ${isCompleted ? 'text-black-deep' : 'text-gray-dark'}`}>
                      {step.label}
                    </p>
                    {isCompleted && index === getCurrentStepIndex() && (
                      <p className="text-xs text-gold mt-1 font-semibold">En cours</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white-pure rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">{t('orders.dishes')}</h2>
          
          <div className="space-y-3">
            {commande.platsCommandes?.map((plat, idx) => (
              <div key={idx} className="flex justify-between py-2 border-b border-gray-light">
                <div>
                  <span className="font-medium">{plat.platNom}</span>
                  <span className="text-gray-dark text-sm ml-2">x{plat.quantite}</span>
                </div>
                <span className="text-black-deep font-semibold">
                  {(plat.prixUnitaire * plat.quantite).toFixed(2)} €
                </span>
              </div>
            ))}
            
            <div className="flex justify-between pt-3 mt-2">
              <span className="font-bold">{t('common.total')}</span>
              <span className="text-xl font-bold text-black-deep">{commande.montantTotal} €</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/menu')}
            className="btn-primary w-full mt-6"
          >
            {t('orders.orderAgain')}
          </button>
        </div>
      </div>
    </div>
  );
}