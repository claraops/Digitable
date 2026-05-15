import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, CookingPot, Truck, PackageCheck, MapPin } from 'lucide-react';
import { commandeService } from '../services/commandeService';
import Loader from '../components/Common/Loader';
import toast from 'react-hot-toast';

const steps = [
  { id: 'EN_ATTENTE', label: 'Commande reçue', icon: Clock, color: 'bg-gray-light' },
  { id: 'EN_PREPARATION', label: 'En préparation', icon: CookingPot, color: 'bg-blue-500' },
  { id: 'PRETE', label: 'Prête', icon: PackageCheck, color: 'bg-gold' },
  { id: 'SERVIE', label: 'Livrée', icon: Truck, color: 'bg-green-500' },
];

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
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
          <h1 className="text-2xl font-bold mb-2">Suivi de commande</h1>
          <p className="text-gray-dark">Commande #{commande.idCommande}</p>
          <div className="mt-4 p-3 bg-gray-light rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <MapPin size={18} className="text-gold" />
              <span className="text-sm">Livraison à : Table {commande.numeroTable}</span>
            </div>
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
                      <p className="text-xs text-gold mt-1">En cours</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white-pure rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Détails de la commande</h2>
          
          <div className="space-y-3">
            {commande.platsCommandes?.map((plat, idx) => (
              <div key={idx} className="flex justify-between py-2 border-b border-gray-light">
                <div>
                  <span className="font-medium">{plat.platNom}</span>
                  <span className="text-gray-dark text-sm ml-2">x{plat.quantite}</span>
                </div>
                <span className="text-gold font-semibold">
                  {(plat.prixUnitaire * plat.quantite).toFixed(2)} €
                </span>
              </div>
            ))}
            
            <div className="flex justify-between pt-3 mt-2">
              <span className="font-bold">Total</span>
              <span className="text-xl font-bold text-gold">{commande.montantTotal} €</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/menu')}
            className="btn-primary w-full mt-6"
          >
            Commander à nouveau
          </button>
        </div>
      </div>
    </div>
  );
}