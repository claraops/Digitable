import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { commandeService } from '../services/commandeService';
import { avisService } from '../services/avisService';
import { Star, StarHalf } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../components/Common/Loader';
import { Link } from 'react-router-dom';

export default function AvisPage() {
  const { user, isAuthenticated } = useAuth();
  const [commandes, setCommandes] = useState([]);
  const [avisExistants, setAvisExistants] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated() && user) {
      fetchCommandesPayees();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchCommandesPayees = async () => {
    try {
      const userId = user?.idUser || user?.id;
      const response = await commandeService.getHistorique(userId);
      const commandesPayees = (response.data || []).filter(cmd => cmd.statut === 'PAYEE');
      setCommandes(commandesPayees);
      
      // Vérifier les avis existants pour chaque commande
      const avisMap = {};
      for (const cmd of commandesPayees) {
        try {
          const avisResponse = await avisService.getByCommande?.(cmd.idCommande);
          if (avisResponse?.data) {
            avisMap[cmd.idCommande] = avisResponse.data;
          }
        } catch (e) {
          // Pas d'avis pour cette commande
        }
      }
      setAvisExistants(avisMap);
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAvis = async (e) => {
    e.preventDefault();
    if (!selectedCommande) return;
    
    setSubmitting(true);
    try {
      await avisService.create({
        commande: { idCommande: selectedCommande.idCommande },
        note: note,
        commentaire: commentaire,
        dateAvis: new Date().toISOString()
      });
      toast.success('Merci pour votre avis !');
      setSelectedCommande(null);
      setNote(5);
      setCommentaire('');
      fetchCommandesPayees();
    } catch (error) {
      console.error('Erreur avis:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi de l\'avis');
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
            ) : star - 0.5 <= rating ? (
              <StarHalf className="w-6 h-6 fill-gold text-gold" />
            ) : (
              <Star className="w-6 h-6 text-gray-light" />
            )}
          </button>
        ))}
      </div>
    );
  };

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Non authentifié</h2>
          <p className="text-gray-dark mb-6">Veuillez vous connecter pour laisser un avis</p>
          <Link to="/login" className="btn-primary inline-block">Se connecter</Link>
        </div>
      </div>
    );
  }

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen py-12 bg-gray-light">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">📝 Donner votre avis</h1>
        <p className="text-center text-gray-dark mb-8">
          Partagez votre expérience et aidez-nous à progresser
        </p>

        {selectedCommande ? (
          <div className="bg-white-pure rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Commande #{selectedCommande.idCommande}</h2>
              <button
                onClick={() => setSelectedCommande(null)}
                className="text-gray-dark hover:text-black-deep"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmitAvis}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Votre note</label>
                {renderStars(note, true, setNote)}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Votre commentaire</label>
                <textarea
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  rows="4"
                  className="input"
                  placeholder="Partagez votre expérience..."
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <button type="submit" disabled={submitting} className="btn-primary flex-1">
                  {submitting ? 'Envoi en cours...' : 'Envoyer mon avis'}
                </button>
                <button type="button" onClick={() => setSelectedCommande(null)} className="btn-secondary flex-1">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {commandes.filter(cmd => !avisExistants[cmd.idCommande]).length === 0 ? (
              <div className="bg-white-pure rounded-xl p-12 text-center">
                <p className="text-gray-dark mb-4">
                  Vous n'avez pas encore de commandes payées à évaluer
                </p>
                <Link to="/menu" className="btn-primary inline-block">Découvrir le menu</Link>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Commandes à évaluer</h2>
                {commandes.filter(cmd => !avisExistants[cmd.idCommande]).map((cmd) => (
                  <div key={cmd.idCommande} className="bg-white-pure rounded-xl p-4 shadow-sm border border-gray-light">
                    <div className="flex justify-between items-center flex-wrap gap-3">
                      <div>
                        <p className="font-semibold">Commande #{cmd.idCommande}</p>
                        <p className="text-sm text-gray-dark">
                          {new Date(cmd.dateCommande).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-gold font-semibold mt-1">{cmd.montantTotal?.toFixed(2)} €</p>
                      </div>
                      <button
                        onClick={() => setSelectedCommande(cmd)}
                        className="btn-primary px-4 py-2"
                      >
                        Donner mon avis
                      </button>
                    </div>
                    
                    {/* Afficher les plats commandés */}
                    <div className="mt-3 pt-2 border-t border-gray-light">
                      <p className="text-xs text-gray-dark">
                        {cmd.platsCommandes?.length || 0} plat(s) commandé(s)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Commandes déjà évaluées */}
            {Object.keys(avisExistants).length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Commandes évaluées</h2>
                <div className="space-y-4">
                  {commandes.filter(cmd => avisExistants[cmd.idCommande]).map((cmd) => (
                    <div key={cmd.idCommande} className="bg-white-pure rounded-xl p-4 shadow-sm border border-gray-light opacity-70">
                      <div className="flex justify-between items-center flex-wrap gap-3">
                        <div>
                          <p className="font-semibold">Commande #{cmd.idCommande}</p>
                          <p className="text-sm text-gray-dark">
                            {new Date(cmd.dateCommande).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div>
                          {renderStars(avisExistants[cmd.idCommande]?.note || 5, false)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}