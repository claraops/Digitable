import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Star } from 'lucide-react';
import { platService } from '../services/platService';
import { menuService } from '../services/menuService';
import { avisService } from '../services/avisService';
import { getImageUrl } from '../utils/imageUtils';
import { useCart } from '../hooks/useCart';
import { useTranslation } from '../i18n/I18nContext';
import MenuDetail from './MenuDetail';
import { commandeService } from '../services/commandeService';
import toast from 'react-hot-toast';

export default function Menu() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const menuIdParam = searchParams.get('menu');
  
  const [plats, setPlats] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [menus, setMenus] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tous');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avisData, setAvisData] = useState({});

  const categories = [t('menu.allCategories'), t('menu.starters'), t('menu.mainCourses'), t('menu.desserts'), t('menu.beverages')];
  const categoryMap = {
    'Entrées': 'ENTREE',
    'Plats': 'PLAT_PRINCIPAL',
    'Desserts': 'DESSERT',
    'Boissons': 'BOISSON'
  };

  const categoryLabels = {
    'APERO': 'Apéro',
    'ENTREE': t('menu.starters'),
    'PLAT_PRINCIPAL': t('menu.mainCourses'),
    'DESSERT': t('menu.desserts'),
    'BOISSON': t('menu.beverages')
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const platRes = await platService.getAll();
        let platsData = [];
        if (Array.isArray(platRes.data)) {
          platsData = platRes.data;
        } else if (platRes.data?.content) {
          platsData = platRes.data.content;
        }
        setPlats(platsData);
        
        const menuRes = await menuService.getAll();
        let menusData = [];
        if (Array.isArray(menuRes.data)) {
          menusData = menuRes.data;
        } else if (menuRes.data?.content) {
          menusData = menuRes.data.content;
        }
        setMenus(menusData);
        
        // Récupérer les avis depuis la base de données
        // Menu.jsx - correction de la récupération des notes
// Récupérer les avis depuis la base de données
try {
  if (avisService && typeof avisService.getAll === 'function') {
    const avisRes = await avisService.getAll();
    if (avisRes && Array.isArray(avisRes.data)) {
      // Récupérer toutes les commandes
      const commandesResponse = await commandeService.getAll();
      const allCommandes = commandesResponse.data || [];
      
      // Créer un mapping commandeId -> platIds
      const commandeToPlats = {};
      allCommandes.forEach(cmd => {
        if (cmd.platsCommandes) {
          cmd.platsCommandes.forEach(plat => {
            const platId = plat.platId;
            if (platId) {
              if (!commandeToPlats[cmd.idCommande]) {
                commandeToPlats[cmd.idCommande] = [];
              }
              if (!commandeToPlats[cmd.idCommande].includes(platId)) {
                commandeToPlats[cmd.idCommande].push(platId);
              }
            }
          });
        }
      });
      
      // Calculer la note moyenne par plat
      const notesMap = {};
      const countMap = {};
      
      avisRes.data.forEach(avis => {
        const commandeId = avis.commandeId || avis.commande?.idCommande || avis._ID_COMMANDE;
        const platIds = commandeToPlats[commandeId] || [];
        const note = parseInt(avis.note) || 0;
        
        platIds.forEach(platId => {
          notesMap[platId] = (notesMap[platId] || 0) + note;
          countMap[platId] = (countMap[platId] || 0) + 1;
        });
      });
      
      const avgMap = {};
      Object.keys(notesMap).forEach(platId => {
        avgMap[platId] = notesMap[platId] / countMap[platId];
      });
      setAvisData(avgMap);
    }
  }
} catch (e) {
  console.warn('Erreur chargement avis:', e);
}
        
        if (menuIdParam) {
          const menu = menusData.find(m => m.idMenu === parseInt(menuIdParam));
          if (menu) {
            setSelectedMenu(menu);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Erreur:', err);
        setError(t('menu.loadError'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [menuIdParam]);

  // ✅ VUE DÉTAIL MENU - À mettre AVANT le return principal
  if (selectedMenu) {
    return <MenuDetail menu={selectedMenu} onBack={() => setSelectedMenu(null)} />;
  }

  // Fonction pour afficher les étoiles avec remplissage partiel
  const renderStars = (rating) => {
    const stars = [];
    const numRating = parseFloat(rating) || 0;
    for (let i = 1; i <= 5; i++) {
      const fill = Math.min(1, Math.max(0, numRating - (i - 1)));
      if (fill >= 1) {
        stars.push(<Star key={i} size={16} className="fill-gold text-gold" />);
      } else if (fill > 0) {
        stars.push(
          <span key={i} className="relative inline-block">
            <Star size={16} className="text-gray-300 fill-gray-300" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star size={16} className="fill-gold text-gold" />
            </span>
          </span>
        );
      } else {
        stars.push(<Star key={i} size={16} className="text-gray-300 fill-gray-300" />);
      }
    }
    return stars;
  };

  const handleAddToCart = (e, plat) => {
    e.stopPropagation();
    addToCart({
      idPlat: plat.idPlat,
      nomPlat: plat.nomPlat,
      prix: plat.prix,
      imagePlat: plat.imagePlat
    });
    toast.success(`${plat.nomPlat} ajouté au panier`);
  };

  const filteredPlats = plats.filter((plat) => {
    if (category !== 'Tous' && plat.categorie !== categoryMap[category]) return false;
    if (search && !plat.nomPlat?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="bg-gold text-white px-6 py-2 rounded-lg">
              {t('common.retry')}
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold">{t('menu.fullMenu')}</h1>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder={t('menu.searchPlaceholder')} 
                  value={search}
                  onChange={e => setSearch(e.target.value)} 
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all text-base"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(c => (
            <button 
              key={c} 
              onClick={() => setCategory(c)}
              className={`px-5 py-2 rounded-full transition-all text-sm font-medium ${
                category === c 
                    ? 'bg-black-deep text-white' 
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400 hover:text-gray-900'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grille des plats */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-96 animate-pulse bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        ) : filteredPlats.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">{t('menu.noPlats')}</p>
          </div>
        ) : category === 'Tous' ? (
          Object.entries(
            filteredPlats.reduce((acc, plat) => {
              const catKey = plat.categorie || 'AUTRE';
              if (!acc[catKey]) acc[catKey] = [];
              acc[catKey].push(plat);
              return acc;
            }, {})
          ).map(([catKey, catPlats]) => (
            <div key={catKey} className="mb-12">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-gold inline-block">
                {categoryLabels[catKey] || catKey}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {catPlats.map(plat => {
                  const rating = avisData[plat.idPlat] || 0;
                  return (
                    <div 
                      key={plat.idPlat} 
                      className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
                      onClick={() => navigate(`/plat/${plat.idPlat}`)}
                    >
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        {plat.imagePlat ? (
                          <img 
                            src={getImageUrl(plat.imagePlat)}
                            alt={plat.nomPlat}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { e.target.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=Image'; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            {t('menu.noImage')}
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <div className="flex items-center gap-0.5">
                            {renderStars(rating)}
                          </div>
                          <span className="text-xs text-gray-600 ml-1">{rating > 0 ? rating : '0'}</span>
                        </div>
                        {!plat.disponibilite && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
{t('menu.unavailable')}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                          <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-gold transition-colors">
                          {plat.nomPlat}
                        </h3>
                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                          {plat.description || t('menu.descriptionNA')}
                        </p>
                        <div className="flex items-center justify-between">
                            <span className="text-gold font-bold text-xl">{plat.prix?.toFixed(2)} €</span>
                          <button 
                            onClick={(e) => handleAddToCart(e, plat)}
                              className="bg-black-deep hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!plat.disponibilite}
                          >
{plat.disponibilite ? t('menu.addToCart') : t('menu.unavailable')}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlats.map(plat => {
              const rating = avisData[plat.idPlat] || 0;
              return (
                <div 
                  key={plat.idPlat} 
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(`/plat/${plat.idPlat}`)}
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {plat.imagePlat ? (
                      <img 
                        src={getImageUrl(plat.imagePlat)}
                        alt={plat.nomPlat}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=Image'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                            {t('menu.noImage')}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <div className="flex items-center gap-0.5">
                        {renderStars(rating)}
                      </div>
                      <span className="text-xs text-gray-600 ml-1">{rating > 0 ? rating : '0'}</span>
                    </div>
                    {!plat.disponibilite && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {t('menu.unavailable')}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-gold transition-colors">
                      {plat.nomPlat}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                      {plat.description || t('menu.descriptionNA')}
                    </p>
                    <div className="flex items-center justify-between">
                          <span className="text-gold font-bold text-xl">{plat.prix?.toFixed(2)} €</span>
                      <button 
                        onClick={(e) => handleAddToCart(e, plat)}
                            className="bg-black-deep hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!plat.disponibilite}
                      >
                        {plat.disponibilite ? t('menu.addToCart') : t('menu.unavailable')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Section Menus - 3 derniers menus uniquement */}
        {menus.filter(m => m.actif).length > 0 && (
          <section className="mt-16 pt-6 bg-gray-50 -mx-4 px-4 py-12 rounded-t-3xl">
            <div className="text-center mb-10">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl"></div>
                <div className="relative w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M6 14h12m-7-4V4m4 6V4M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('menu.specialMenus')}</h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                {t('menu.specialMenusDesc')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {menus
                .filter(m => m.actif)
                .sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation))
                .slice(0, 3)
                .map((menu) => {
                  const isNew = menu.dateCreation && (new Date() - new Date(menu.dateCreation)) < 7 * 24 * 60 * 60 * 1000;
                  const isPromo = menu.prixSpecial && menu.prixSpecial < (menu.prix || 0);
                  
                  return (
                    <Link
                      key={menu.idMenu}
                      to={`/menu?menu=${menu.idMenu}`}
                      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative h-44 overflow-hidden bg-gray-100">
                        {menu.photo ? (
                          <img
                            src={getImageUrl(menu.photo)}
                            alt={menu.nomMenu}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { e.target.src = 'https://placehold.co/400x200/e2e8f0/64748b?text=Menu'; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M6 14h12m-7-4V4m4 6V4M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute top-2 left-2 flex gap-1">
                          {isNew && (
                            <span className="bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              {t('menu.new')}
                            </span>
                          )}
                          {isPromo && (
                            <span className="bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              -{Math.round(((menu.prix - menu.prixSpecial) / menu.prix) * 100)}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h3 className="font-bold text-base line-clamp-1 group-hover:text-gold transition-colors">
                            {menu.nomMenu}
                          </h3>
                          <span className="text-gold font-bold text-base whitespace-nowrap">
                            {Number(menu.prixSpecial || menu.prix || 0).toFixed(2)} €
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs mb-2 line-clamp-2">
                          {menu.descriptionMenu || menu.description || t('menu.discover')}
                        </p>
                        <div className="flex justify-end">
                          <span className="text-gold text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                            {t('menu.discover')}
                            <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}