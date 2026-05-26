import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { factureService } from '../services/factureService';
import { commandeService } from '../services/commandeService';
import { FileText, Download, Eye, Euro } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../components/Common/Loader';

export default function MyFactures() {
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated() && user) {
      fetchMesFactures();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchMesFactures = async () => {
    try {
      const userId = user?.idUser || user?.id;
      // Récupérer les commandes de l'utilisateur
      const commandesResponse = await commandeService.getHistorique(userId);
      const commandes = commandesResponse.data || [];
      
      // Pour chaque commande, récupérer la facture associée
      const facturesData = [];
      for (const cmd of commandes) {
        try {
          // Récupérer la facture par commande
          const factureRes = await factureService.getByCommande?.(cmd.idCommande) || 
                           await factureService.getById?.(cmd.idCommande);
          if (factureRes?.data) {
            facturesData.push({
              ...factureRes.data,
              commande: cmd
            });
          }
        } catch (e) {
          console.log('Pas de facture pour commande', cmd.idCommande);
        }
      }
      setFactures(facturesData);
    } catch (error) {
      console.error('Erreur chargement factures:', error);
      toast.error('Erreur lors du chargement des factures');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Non authentifié</h2>
          <p className="text-gray-dark mb-6">Veuillez vous connecter pour voir vos factures</p>
          <a href="/login" className="btn-primary inline-block">Se connecter</a>
        </div>
      </div>
    );
  }

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen py-12 bg-gray-light">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Mes Factures</h1>
          <p className="text-gray-dark">
            Retrouvez toutes vos factures et votre historique de paiements
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white-pure rounded-xl p-4 text-center shadow-sm">
            <Euro className="w-6 h-6 text-gold mx-auto mb-2" />
            <p className="text-gray-dark text-sm">Total dépensé</p>
            <p className="text-2xl font-bold">
              {factures.reduce((sum, f) => sum + (f.montant || 0), 0).toFixed(2)} €
            </p>
          </div>
          <div className="bg-white-pure rounded-xl p-4 text-center shadow-sm">
            <FileText className="w-6 h-6 text-gold mx-auto mb-2" />
            <p className="text-gray-dark text-sm">Nombre de factures</p>
            <p className="text-2xl font-bold">{factures.length}</p>
          </div>
          <div className="bg-white-pure rounded-xl p-4 text-center shadow-sm">
            <Eye className="w-6 h-6 text-gold mx-auto mb-2" />
            <p className="text-gray-dark text-sm">Dernière facture</p>
            <p className="text-lg font-semibold">
              {factures[0] ? formatDate(factures[0].datePaiement).split(' ')[0] : '-'}
            </p>
          </div>
        </div>

        {/* Factures List */}
        {factures.length === 0 ? (
          <div className="bg-white-pure rounded-xl p-12 text-center">
            <FileText className="w-16 h-16 text-gray-dark mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucune facture</h3>
            <p className="text-gray-dark mb-4">
              Vous n'avez pas encore de factures. Effectuez votre première commande !
            </p>
            <a href="/menu" className="btn-primary inline-block">Voir le menu</a>
          </div>
        ) : (
          <div className="space-y-4">
            {factures.map((facture) => (
              <div key={facture.idFacture} className="bg-white-pure rounded-xl p-6 shadow-sm border border-gray-light">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={20} className="text-gold" />
                      <span className="font-mono text-lg font-bold">#{facture.idFacture}</span>
                    </div>
                    <p className="text-gray-dark text-sm">
                      Commande #{facture.commande?.idCommande || '-'}
                    </p>
                    <p className="text-gray-dark text-sm">
                      Date: {formatDate(facture.datePaiement)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gold">{facture.montant?.toFixed(2)} €</p>
                    <p className="text-sm text-gray-dark mt-1">
                      Paiement: {facture.modePaiement || 'CB'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-light flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedFacture(facture)}
                    className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
                  >
                    <Eye size={16} />
                    Détails
                  </button>
                  <button
                    onClick={() => {
                      toast.success('Téléchargement démarré');
                    }}
                    className="btn-primary text-sm py-2 px-4 flex items-center gap-2 bg-gray-light text-black-deep hover:bg-gold"
                  >
                    <Download size={16} />
                    PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Détails Facture */}
      {selectedFacture && (
        <div className="fixed inset-0 bg-black-deep bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white-pure rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Détails Facture #{selectedFacture.idFacture}</h2>
              <button
                onClick={() => setSelectedFacture(null)}
                className="text-gray-dark hover:text-black-deep"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="border-b border-gray-light pb-3">
                <p><strong>N° Facture:</strong> {selectedFacture.idFacture}</p>
                <p><strong>Date:</strong> {formatDate(selectedFacture.datePaiement)}</p>
                <p><strong>Mode de paiement:</strong> {selectedFacture.modePaiement || 'Carte bancaire'}</p>
              </div>
              
              <div className="border-b border-gray-light pb-3">
                <p><strong>Commande associée:</strong> #{selectedFacture.commande?.idCommande}</p>
                <p><strong>Statut commande:</strong> {selectedFacture.commande?.statut || 'Terminée'}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Détails des articles</h3>
                <div className="space-y-2">
                  {selectedFacture.commande?.platsCommandes?.map((plat, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{plat.platNom} x{plat.quantite}</span>
                      <span className="text-gold">{(plat.prixUnitaire * plat.quantite).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-light">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-gold">{selectedFacture.montant?.toFixed(2)} €</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedFacture(null)}
              className="btn-primary w-full mt-6"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}