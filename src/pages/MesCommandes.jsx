import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MessageSquare, ShoppingBag, ChevronRight, Package, Clock, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { commandeService } from '../services/commandeService';
import { avisService } from '../services/avisService';
import { useTranslation } from '../i18n/I18nContext';
import Loader from '../components/Common/Loader';
import Button from '../components/Common/Button';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  'EN_ATTENTE': { label: 'En attente', bar: 'bg-amber-500', icon: Clock, bg: 'bg-amber-50', text: 'text-amber-700' },
  'EN_PREPARATION': { label: 'En préparation', bar: 'bg-sky-500', icon: RotateCcw, bg: 'bg-sky-50', text: 'text-sky-700' },
  'PRETE': { label: 'Prête', bar: 'bg-gold', icon: CheckCircle, bg: 'bg-yellow-50', text: 'text-yellow-700' },
  'SERVIE': { label: 'Servie', bar: 'bg-emerald-600', icon: Package, bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'PAYEE': { label: 'Payée', bar: 'bg-teal-600', icon: CheckCircle, bg: 'bg-teal-50', text: 'text-teal-700' },
  'ANNULEE': { label: 'Annulée', bar: 'bg-rose-400', icon: XCircle, bg: 'bg-rose-50', text: 'text-rose-600' }
};

const FILTERS = ['TOUTES', 'EN_ATTENTE', 'EN_PREPARATION', 'PRETE', 'SERVIE', 'PAYEE', 'ANNULEE'];

export default function MesCommandes() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [commandes, setCommandes] = useState([]);
  const [avisExistants, setAvisExistants] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('TOUTES');
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [showAvisModal, setShowAvisModal] = useState(false);
  const [avisNote, setAvisNote] = useState(5);
  const [avisCommentaire, setAvisCommentaire] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const fetchCommandes = async () => {
      setLoading(true);
      try {
        const userId = user.idUser || user.id;
        const response = await commandeService.getHistorique(parseInt(userId));
        const data = response.data || [];
        setCommandes(data);

        const avisResponse = await avisService.getAll();
        if (avisResponse?.data && Array.isArray(avisResponse.data)) {
          const avisMap = {};
          avisResponse.data.forEach(avis => {
            const commandeId = avis.commande?.idCommande || avis._ID_COMMANDE;
            if (commandeId) avisMap[commandeId] = avis;
          });
          setAvisExistants(avisMap);
        }
      } catch (error) {
        console.error('Erreur chargement commandes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCommandes();
  }, [isAuthenticated, user]);

  const filteredCommandes = filter === 'TOUTES'
    ? commandes
    : commandes.filter(cmd => cmd.statut === filter);

  const totalDepense = commandes.reduce((sum, cmd) => sum + (Number(cmd.montantTotal || 0)), 0);

  const getStatusBadge = (statut) => {
    const config = STATUS_CONFIG[statut] || STATUS_CONFIG['EN_ATTENTE'];
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
        <config.icon size={12} />
        {config.label}
      </span>
    );
  };

  const renderStars = (rating, interactive = false, onRate = null) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} type="button" onClick={() => onRate?.(star)}
          disabled={!interactive}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        >
          {star <= rating ? <Star className="w-5 h-5 fill-gold text-gold" /> : <Star className="w-5 h-5 text-gray-200" />}
        </button>
      ))}
    </div>
  );

  const handleOpenAvisModal = (cmd) => {
    setSelectedCommande(cmd);
    setAvisNote(5);
    setAvisCommentaire('');
    setShowAvisModal(true);
  };

  const handleSubmitAvis = async () => {
    if (!selectedCommande) return;
    setSubmitting(true);
    try {
      await avisService.create({
        commandeId: selectedCommande.idCommande,
        note: avisNote.toString(),
        commentaire: avisCommentaire
      });
      toast.success('Merci pour votre avis !');
      setShowAvisModal(false);
      const userId = user.idUser || user.id;
      const response = await commandeService.getHistorique(parseInt(userId));
      setCommandes(response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de l'envoi de l'avis");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-sm mx-auto px-6">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <ShoppingBag size={28} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold mb-2">Connectez-vous</h2>
          <p className="text-gray-500 text-sm mb-6">Connectez-vous pour consulter l'historique de vos commandes</p>
          <Link to="/login" className="inline-flex items-center gap-2 bg-black-deep text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-sm">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid gap-8 xl:grid-cols-[1.6fr_0.9fr]">
          <div>
            <section className="rounded-[2rem] bg-gradient-to-br from-gold/10 via-white to-gray-50 border border-black-deep/10 p-8 shadow-[0_24px_80px_rgba(15,15,15,0.08)]">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">Historique</p>
                  <h1 className="mt-3 text-3xl md:text-4xl font-bold text-black-deep">Mes commandes</h1>
                  <p className="mt-2 text-gray-500 max-w-2xl">Retrouvez ici toutes vos commandes passées, leur statut et les détails de paiement.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="rounded-3xl bg-white p-4 shadow-sm border border-gray-200">
                    <ShoppingBag size={24} className="text-gold" />
                  </div>
                  <div className="rounded-3xl bg-black-deep px-5 py-4 text-white">
                    <p className="text-xs uppercase tracking-[0.24em] text-gray-200">Total dépensé</p>
                    <p className="mt-2 text-2xl font-bold">{totalDepense.toFixed(2)} €</p>
                  </div>
                </div>
              </div>
            </section>

            {commandes.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {FILTERS.map(f => {
                  const config = STATUS_CONFIG[f];
                  const isActive = filter === f;
                  return (
                    <button key={f} onClick={() => setFilter(f)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${isActive ? 'bg-black-deep text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}>
                      {f === 'TOUTES' ? 'Toutes les commandes' : config?.label || f}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="space-y-4 xl:sticky xl:top-6">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-black-deep">Statistiques rapides</h2>
              <div className="mt-5 grid gap-3">
                <div className="rounded-3xl bg-gray-50 p-4 border border-gray-100">
                  <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Commandes totales</p>
                  <p className="mt-3 text-3xl font-bold text-black-deep">{commandes.length}</p>
                </div>
                <div className="rounded-3xl bg-gray-50 p-4 border border-gray-100">
                  <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Commandes affichées</p>
                  <p className="mt-3 text-3xl font-bold text-black-deep">{filteredCommandes.length}</p>
                </div>
                <div className="rounded-3xl bg-gray-50 p-4 border border-gray-100">
                  <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Filtre actif</p>
                  <p className="mt-3 text-3xl font-bold text-black-deep">{filter === 'TOUTES' ? 'Toutes' : STATUS_CONFIG[filter]?.label || filter}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-black-deep">Besoin d'aide ?</h2>
              <p className="mt-3 text-sm text-gray-500">Suivez votre commande ou laissez un avis dès que celle-ci est servie.</p>
              <Button variant="secondary" size="md" className="w-full mt-5" onClick={() => navigate('/menu')}>Voir le menu</Button>
            </div>
          </aside>
        </div>

        {filteredCommandes.length === 0 ? (
          <div className="mt-8 bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-100 text-gray-400">
              <Package size={32} />
            </div>
            <h2 className="text-xl font-semibold text-black-deep">Aucune commande trouvée</h2>
            <p className="mt-2 text-gray-500">Essayez un autre filtre ou passez une nouvelle commande dans le menu.</p>
            <div className="mt-6 flex justify-center">
              <Button variant="primary" size="md" onClick={() => navigate('/menu')}>Commander maintenant</Button>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {filteredCommandes.map(cmd => {
              const config = STATUS_CONFIG[cmd.statut] || STATUS_CONFIG['EN_ATTENTE'];
              const Icon = config.icon;
              const hasAvis = avisExistants[cmd.idCommande];
              const canLeaveAvis = (cmd.statut === 'SERVIE' || cmd.statut === 'PAYEE') && !hasAvis;
              const items = cmd.platsCommandes || [];
              const articleLabel = items.length > 1 ? 'articles' : 'article';

              return (
                <article key={cmd.idCommande} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className={`h-1 ${config.bar}`} />
                  <div className="p-6">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-3xl ${config.bg}`}>
                            <Icon size={20} className={config.text} />
                          </div>
                          <div>
                            <p className="text-lg font-bold text-black-deep">Commande #{cmd.idCommande}</p>
                            <p className="text-sm text-gray-500">{new Date(cmd.dateCommande).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <div>{getStatusBadge(cmd.statut)}</div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <div className="rounded-3xl bg-gray-100 px-4 py-3 text-sm text-gray-600">Table {cmd.numeroTable || '-'}</div>
                        <div className="rounded-3xl bg-gray-100 px-4 py-3 text-sm text-gray-600">{items.length} {articleLabel}</div>
                      </div>
                    </div>

                    {items.length > 0 && (
                      <div className="mt-6 rounded-3xl bg-gray-50 p-5 border border-gray-100">
                        <div className="grid gap-4">
                          {items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-200">
                                  <Package size={16} className="text-gray-400" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800">{item.nomPlat || `Plat #${item.platId || item.idPlat}`}</p>
                                  {item.quantite > 1 && <p className="text-sm text-gray-400">Quantité x{item.quantite}</p>}
                                </div>
                              </div>
                              {item.prix && <p className="font-semibold text-gray-700">{Number(item.prix).toFixed(2)} €</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Total commande</p>
                        <p className="mt-2 text-3xl font-bold text-black-deep">{Number(cmd.montantTotal || 0).toFixed(2)} €</p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {canLeaveAvis && (
                          <Button variant="secondary" size="md" onClick={() => handleOpenAvisModal(cmd)}>
                            <MessageSquare size={16} /> Noter
                          </Button>
                        )}
                        <Button variant="primary" size="md" onClick={() => navigate(`/tracking/${cmd.idCommande}`)}>
                          Suivre la commande
                        </Button>
                      </div>
                    </div>

                    {hasAvis && (
                      <div className="mt-6 rounded-3xl bg-black-deep/5 p-4 border border-black-deep/10">
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">{renderStars(parseInt(hasAvis.note) || 5)}</div>
                          <span>Vous avez déjà laissé un avis.</span>
                        </div>
                        {hasAvis.commentaire && <p className="mt-3 text-sm text-gray-500">« {hasAvis.commentaire} »</p>}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {showAvisModal && selectedCommande && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={() => setShowAvisModal(false)}>
            <div className="bg-white rounded-2xl p-7 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-gold" />
                </div>
                <h2 className="text-xl font-bold">Donnez votre avis</h2>
                <p className="text-gray-400 text-sm mt-1">Commande #{selectedCommande.idCommande}</p>
              </div>
              <div className="mb-5">
                <p className="text-sm font-medium text-gray-700 mb-3 text-center">Votre note</p>
                <div className="flex justify-center">{renderStars(avisNote, true, setAvisNote)}</div>
              </div>
              <div className="mb-6">
                <textarea value={avisCommentaire} onChange={e => setAvisCommentaire(e.target.value)}
                  rows="3" className="w-full p-3.5 rounded-xl border border-gray-200 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold resize-none text-sm bg-gray-50"
                  placeholder="Partagez votre experience (optionnel)" />
              </div>
              <div className="flex gap-3">
                <button onClick={handleSubmitAvis} disabled={submitting}
                  className="flex-1 bg-black-deep hover:bg-gray-800 text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition-all shadow-sm"
                >
                  {submitting ? 'Envoi...' : 'Envoyer'}
                </button>
                <button onClick={() => setShowAvisModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-3 rounded-xl font-semibold transition-all"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
