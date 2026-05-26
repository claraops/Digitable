import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { commandeService } from '../services/commandeService';
import Loader from '../components/Common/Loader';
import toast from 'react-hot-toast';

export default function CommandesPage() {
  const { user, isAuthenticated } = useAuth();
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated() && user) {
      fetchCommandes();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchCommandes = async () => {
    try {
      const userId = user?.idUser || user?.id;
      const response = await commandeService.getHistorique(userId);
      setCommandes(response.data || []);
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (statut) => {
    const statusConfig = {
      'EN_ATTENTE': { label: 'En attente', color: 'bg-yellow-500' },
      'EN_PREPARATION': { label: 'En préparation', color: 'bg-blue-500' },
      'PRETE': { label: 'Prête', color: 'bg-gold' },
      'SERVIE': { label: 'Servie', color: 'bg-green-500' },
      'PAYEE': { label: 'Payée', color: 'bg-purple-500' },
      'ANNULEE': { label: 'Annulée', color: 'bg-red-500' }
    };
    const config = statusConfig[statut] || { label: statut, color: 'bg-gray-500' };
    return <span className={`px-2 py-1 rounded-full text-xs text-white ${config.color}`}>{config.label}</span>;
  };

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Non authentifié</h2>
          <p className="text-gray-dark mb-6">Veuillez vous connecter pour voir vos commandes</p>
          <Link to="/login" className="btn-primary inline-block">Se connecter</Link>
        </div>
      </div>
    );
  }

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen py-12 bg-gray-light">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">📋 Mes Commandes</h1>
        
        {commandes.length === 0 ? (
          <div className="bg-white-pure rounded-3xl p-12 text-center">
            <p className="text-gray-dark mb-4">Vous n'avez pas encore de commandes</p>
            <Link to="/menu" className="btn-primary inline-block">Découvrir le menu</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {commandes.map((cmd) => (
              <div key={cmd.idCommande} className="bg-white-pure rounded-xl p-6 shadow-sm border border-gray-light">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-lg">Commande #{cmd.idCommande}</span>
                      {getStatusBadge(cmd.statut)}
                    </div>
                    <p className="text-gray-dark text-sm">
                      Date: {new Date(cmd.dateCommande).toLocaleString('fr-FR')}
                    </p>
                    <p className="text-gray-dark text-sm">
                      Table: {cmd.numeroTable}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gold">{cmd.montantTotal?.toFixed(2)} €</p>
                    <Link 
                      to={`/orders/${cmd.idCommande}`}
                      className="text-blue-500 text-sm hover:underline mt-2 inline-block"
                    >
                      Voir détails →
                    </Link>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-light">
                  <h3 className="font-semibold mb-2">Plats commandés :</h3>
                  <div className="flex flex-wrap gap-2">
                    {cmd.platsCommandes?.slice(0, 3).map((plat, idx) => (
                      <span key={idx} className="bg-gray-light px-3 py-1 rounded-full text-sm">
                        {plat.platNom} x{plat.quantite}
                      </span>
                    ))}
                    {cmd.platsCommandes?.length > 3 && (
                      <span className="text-gray-dark text-sm">+{cmd.platsCommandes.length - 3} autres</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}