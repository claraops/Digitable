// MenuDetail.jsx - Design adapté de PlatDetail.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChefHat, Clock, Users, ShoppingBag, Star, MessageSquare, Sparkles } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';
import { avisService } from '../services/avisService';
import { commandeService } from '../services/commandeService';
import { useCart } from '../hooks/useCart';
import { useTranslation } from '../i18n/I18nContext';
import toast from 'react-hot-toast';

export default function MenuDetail({ menu, onBack }) {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { t } = useTranslation();
  const [avisMenu, setAvisMenu] = useState([]);
  const [loadingAvis, setLoadingAvis] = useState(true);
  const [commandes, setCommandes] = useState([]);

  if (!menu) return null;

  // Grouper les plats par catégorie
  const platsByCategorie = {};
  if (menu.plats && Array.isArray(menu.plats)) {
    menu.plats.forEach(plat => {
      const cat = plat.categorie || 'AUTRE';
      if (!platsByCategorie[cat]) platsByCategorie[cat] = [];
      platsByCategorie[cat].push(plat);
    });
  }

  const categoryLabels = {
    'APERO': t('common.appetizers'),
    'ENTREE': t('menu.starters'),
    'PLAT_PRINCIPAL': t('menu.mainCourses'),
    'DESSERT': t('menu.desserts'),
    'BOISSON': t('menu.beverages'),
    'AUTRE': t('common.others')
  };

  const isNew = menu.dateCreation && (new Date() - new Date(menu.dateCreation)) < 7 * 24 * 60 * 60 * 1000;
  const isPromo = menu.prixSpecial && menu.prixSpecial < (menu.prix || 0);

  // Charger les avis lies aux plats du menu
  useEffect(() => {
    const fetchAvis = async () => {
      try {
        const [avisRes, commandesRes] = await Promise.all([
          avisService.getAll(),
          commandeService.getAll(),
        ]);

        if (Array.isArray(avisRes.data) && Array.isArray(commandesRes.data)) {
          console.log('MenuDetail - Avis brut (1er):', avisRes.data[0]);
          setCommandes(commandesRes.data);

          const platIds = menu.plats?.map(p => p.idPlat) || [];
          const commandeToPlats = {};
          commandesRes.data.forEach(cmd => {
            if (cmd.platsCommandes) {
              cmd.platsCommandes.forEach(p => {
                const pid = p.platId || p.idPlat;
                if (pid) {
                  if (!commandeToPlats[cmd.idCommande]) commandeToPlats[cmd.idCommande] = [];
                  if (!commandeToPlats[cmd.idCommande].includes(pid)) commandeToPlats[cmd.idCommande].push(pid);
                }
              });
            }
          });

          const menuAvis = [];
          avisRes.data.forEach(avis => {
            const cmdId = avis.commandeId || avis.idCommande || avis._ID_COMMANDE || avis.commande?.idCommande;
            const commandePlatIds = commandeToPlats[cmdId] || [];
            const hasCommon = commandePlatIds.some(pid => platIds.includes(pid));
            if (hasCommon) menuAvis.push(avis);
          });
          setAvisMenu(menuAvis);
        }
      } catch (e) {
        console.warn('Erreur chargement avis menu:', e);
      } finally {
        setLoadingAvis(false);
      }
    };
    fetchAvis();
  }, [menu]);

  const getRatingAverage = () => {
    if (avisMenu.length === 0) return 0;
    const sum = avisMenu.reduce((acc, a) => acc + (parseInt(a.note) || 0), 0);
    return (sum / avisMenu.length).toFixed(2);
  };

  const renderStars = (rating, size = 14) => {
    const stars = [];
    const numStars = Math.round(parseFloat(rating) || 0);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={size}
          className={i <= numStars ? 'fill-gold text-gold' : 'text-gray-300 fill-gray-300'}
        />
      );
    }
    return stars;
  };

  const formatRelativeDate = (dateStr) => {
    if (!dateStr) return '';
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'il y a quelques secondes';
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
    if (diff < 172800) return 'hier';
    return date.toLocaleDateString('fr-FR');
  };

  const handleOrderMenu = () => {
    if (!menu.plats || menu.plats.length === 0) {
      toast.error(t('menu.emptyMenu'));
      return;
    }

    menu.plats.forEach(plat => {
      const existingItem = cartItems.find(item => item.idPlat === plat.idPlat);
      if (existingItem) {
        toast.success(`${plat.nomPlat} ${t('menu.alreadyInCart')}`);
      } else {
        addToCart({
          idPlat: plat.idPlat,
          nomPlat: plat.nomPlat,
          prix: plat.prix,
          imagePlat: plat.imagePlat,
          quantity: 1,
          categorie: plat.categorie,
          menuId: menu.idMenu,
          menuNom: menu.nomMenu
        });
      }
    });

    toast.success(`${t('menu.menuAdded')} "${menu.nomMenu}" (${menu.plats.length} ${t('menu.dishes')})`);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-5 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          {t('common.back')}
        </button>

        {/* Carte principale du menu - 2 colonnes */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-md border-2 border-black-deep/15">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">

            {/* COLONNE GAUCHE : Image + Avis */}
            <div className="space-y-4">
              {/* Image */}
              <div className="relative rounded-xl overflow-hidden bg-gray-100 h-80 lg:h-96">
                {menu.photo ? (
                  <img
                    src={getImageUrl(menu.photo)}
                    alt={menu.nomMenu}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://placehold.co/500x500/e2e8f0/64748b?text=Menu'; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <Sparkles className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                {/* Badges sur l'image */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  {isNew && (
                    <span className="bg-black-deep text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse"></span>
                      {t('menu.new')}
                    </span>
                  )}
                  {isPromo && (
                    <span className="bg-gold text-black-deep text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                      -{Math.round(((menu.prix - menu.prixSpecial) / menu.prix) * 100)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Avis Section - comme PlatDetail */}
              <div className="bg-white rounded-xl p-5 border-2 border-black-deep/10 shadow-sm">
                {loadingAvis ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-8 bg-gray-100 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                  </div>
                ) : avisMenu.length > 0 ? (
                  <>
                    {/* Overall Rating Header */}
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                      <div className="text-center">
                        <span className="text-4xl font-bold text-black-deep">{getRatingAverage()}</span>
                        <div className="flex items-center gap-0.5 mt-1">
                          {renderStars(getRatingAverage(), 16)}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{avisMenu.length} avis clients</p>
                      </div>
                    </div>

                    {/* Rating Breakdown */}
                    <div className="mb-4 pb-4 border-b border-gray-100 space-y-1.5">
                      {[5, 4, 3, 2, 1].map(star => {
                        const count = avisMenu.filter(a => parseInt(a.note) === star).length;
                        const pct = avisMenu.length > 0 ? (count / avisMenu.length) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500 w-2 text-right">{star}</span>
                            <Star size={12} className="text-gold fill-gold" />
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-gray-400 text-xs w-8 text-right">{count}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Individual Review Cards */}
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {avisMenu.map((a, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-black-deep">
                                {(() => {
                                  const prenom = a.utilisateurPrenom || a.utilisateur?.prenom;
                                  const nom = a.utilisateurNom || a.utilisateur?.nom;
                                  if (prenom || nom) return `${prenom || ''} ${nom || ''}`.trim();
                                  const cmdId = a.commandeId || a.idCommande || a._ID_COMMANDE;
                                  const cmd = commandes.find(c => c.idCommande === cmdId);
                                  if (cmd) {
                                    const cp = cmd.utilisateurPrenom || cmd.utilisateur?.prenom;
                                    const cn = cmd.utilisateurNom || cmd.utilisateur?.nom;
                                    if (cp || cn) return `${cp || ''} ${cn || ''}`.trim();
                                  }
                                  return 'Anonyme';
                                })()}
                              </span>
                              <div className="flex items-center gap-0.5">
                                {renderStars(parseInt(a.note) || 0, 12)}
                              </div>
                            </div>
                            <span className="text-xs text-gray-400">{formatRelativeDate(a.dateCreation || a.createdAt || a.dateAvis)}</span>
                          </div>
                          {a.commentaire && (
                            <p className="text-gray-600 text-xs leading-relaxed">{a.commentaire}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Aucun avis pour ce menu pour le moment.</p>
                    <p className="text-gray-300 text-xs mt-1">Soyez le premier à donner votre avis !</p>
                  </div>
                )}
              </div>
            </div>

            {/* COLONNE DROITE : Infos menu */}
            <div>
              <h1 className="text-2xl font-bold mb-2">{menu.nomMenu}</h1>

              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {menu.descriptionMenu || menu.description || "Découvrez notre sélection exceptionnelle"}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-5 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-1">
                  <ChefHat size={16} />
                  <span>{t('menu.preparedByChefs')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{t('menu.prepTime')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{menu.plats?.length || 0} {t('menu.dishPlural')}</span>
                </div>
              </div>

              {/* Prix */}
              <div className="flex items-baseline gap-3 mb-6 pb-4 border-b border-gray-100">
                <span className="text-3xl font-bold text-black-deep">
                  {Number(menu.prixSpecial || menu.prix || 0).toFixed(2)} €
                </span>
                {menu.prix && menu.prixSpecial && menu.prixSpecial < menu.prix && (
                  <span className="text-gray-400 text-lg line-through">
                    {Number(menu.prix).toFixed(2)} €
                  </span>
                )}
              </div>

              {/* Composition du menu */}
              <h2 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-gold rounded-full"></span>
                {t('menu.menuComposition')}
              </h2>

              {Object.entries(platsByCategorie).map(([categorie, plats]) => (
                <div key={categorie} className="mb-4 last:mb-0">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">
                    {categoryLabels[categorie] || categorie}
                  </h3>
                  <div className="space-y-2">
                    {plats.map(plat => (
                      <div
                        key={plat.idPlat}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-800">{plat.nomPlat}</span>
                            {!plat.disponibilite && (
                              <span className="text-xs text-red-400">({t('menu.unavailable')})</span>
                            )}
                          </div>
                          {plat.description && (
                            <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{plat.description}</p>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-black-deep ml-3">
                          {Number(plat.prix || 0).toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Bouton Commander */}
              <button
                onClick={handleOrderMenu}
                className="w-full mt-6 bg-black-deep hover:bg-gray-800 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingBag size={18} />
                {t('menu.orderThisMenu')} ({menu.plats?.length || 0} {t('menu.dishes')})
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
