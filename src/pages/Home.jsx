import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, X } from 'lucide-react';
import { menuService } from '../services/menuService';
import { avisService } from '../services/avisService';
import { commandeService } from '../services/commandeService';
import { getImageUrl } from '../utils/imageUtils';
import { useTranslation } from '../i18n/I18nContext';
import MenuDetailModal from './MenuDetail';
import PPImage from '../assets/pp-canva.png';
import petitPlat from '../assets/ptit-plat.avif';
import petitEntre from '../assets/petit-entre.avif';
import petitDessert from '../assets/.petit-dessert.avif';
import petiteBoisson from '../assets/petite-boisson.avif';

export default function Home() {
  const { t } = useTranslation();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuNotes, setMenuNotes] = useState({});
  const [menuReviewsCount, setMenuReviewsCount] = useState({});
  const [selectedMenu, setSelectedMenu] = useState(null);

  const renderStars = (rating) => {
    const stars = [];
    const numRating = parseFloat(rating) || 0;
    for (let i = 1; i <= 5; i++) {
      const fill = Math.min(1, Math.max(0, numRating - (i - 1)));
      if (fill >= 1) {
        stars.push(<Star key={i} size={14} className="fill-gold text-gold" />);
      } else if (fill > 0) {
        stars.push(
          <span key={i} className="relative inline-block">
            <Star size={14} className="text-gray-300 fill-gray-300" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star size={14} className="fill-gold text-gold" />
            </span>
          </span>
        );
      } else {
        stars.push(<Star key={i} size={14} className="text-gray-300 fill-gray-300" />);
      }
    }
    return stars;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const menuResponse = await menuService.getActifs();
        let menusData = [];
        if (Array.isArray(menuResponse.data)) {
          menusData = menuResponse.data;
        } else if (menuResponse.data?.content) {
          menusData = menuResponse.data.content;
        } else {
          menusData = [];
        }
        setMenus(menusData);

        // Calculer les notes moyennes par menu
        try {
          const [avisRes, commandesRes] = await Promise.all([
            avisService.getAll(),
            commandeService.getAll(),
          ]);

          if (Array.isArray(avisRes.data) && Array.isArray(commandesRes.data)) {
            console.log('Home - Avis brut (1er):', avisRes.data[0]);
            console.log('Home - Commande brut (1er):', commandesRes.data[0]);

            // Map each commande to its plat IDs
            const getCmdId = (c) => c.idCommande || c.id || c.idCommand || c._ID_COMMANDE;
            const commandeToPlats = {};
            commandesRes.data.forEach(cmd => {
              if (cmd.platsCommandes) {
                cmd.platsCommandes.forEach(p => {
                  const pid = p.platId || p.idPlat;
                  if (pid) {
                    const cid = getCmdId(cmd);
                    if (!commandeToPlats[cid]) commandeToPlats[cid] = [];
                    if (!commandeToPlats[cid].includes(pid)) commandeToPlats[cid].push(pid);
                  }
                });
              }
            });

            // Map each menu to its plat IDs
            const menuPlatsMap = {};
            menusData.forEach(menu => {
              menuPlatsMap[menu.idMenu] = (menu.plats || []).map(p => p.idPlat || p.platId).filter(Boolean);
            });

            // Aggregate reviews at menu level: for each avis, find which menus the commande's plats belong to
            const menuNoteSum = {}, menuCount = {};
            avisRes.data.forEach(avis => {
              const cmdId = avis.commandeId || avis.idCommande || avis._ID_COMMANDE || avis.commande?.idCommande;
              const commandePlatIds = commandeToPlats[cmdId] || [];
              if (commandePlatIds.length === 0) return;
              const note = parseFloat(avis.note) || 0;
              Object.keys(menuPlatsMap).forEach(menuId => {
                const menuPlatIds = menuPlatsMap[menuId];
                if (menuPlatIds.some(id => commandePlatIds.includes(id))) {
                  menuNoteSum[menuId] = (menuNoteSum[menuId] || 0) + note;
                  menuCount[menuId] = (menuCount[menuId] || 0) + 1;
                }
              });
            });

            const menuNotesMap = {}, menuRevCountMap = {};
            Object.keys(menuNoteSum).forEach(menuId => {
              menuNotesMap[menuId] = parseFloat((menuNoteSum[menuId] / menuCount[menuId]).toFixed(2));
              menuRevCountMap[menuId] = menuCount[menuId];
            });
            setMenuNotes(menuNotesMap);
            setMenuReviewsCount(menuRevCountMap);
          }
        } catch (e) {
          console.warn('Erreur chargement avis:', e);
        }
      } catch (error) {
        console.error('Erreur chargement menus:', error);
        setMenus([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = [
    { name: t('menu.starters'), image: petitEntre, link: '/menu?category=entrees' },
    { name: t('menu.mainCourses'), image: petitPlat, link: '/menu?category=plats' },
    { name: t('menu.desserts'), image: petitDessert, link: '/menu?category=desserts' },
    { name: t('menu.beverages'), image: petiteBoisson, link: '/menu?category=boissons' }
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="w-full pt-12 pb-8 sm:pt-16 sm:pb-12 bg-gold text-black-deep overflow-hidden">
        <div className="container-responsive">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="max-w-2xl">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 text-black-deep">
                  {t('home.heroTitle')} <span className="block">{t('home.heroSubtitle')}</span>
                </h1>
                <p className="max-w-xl text-sm sm:text-base lg:text-lg mb-6 text-black-deep/70">
                  {t('home.heroDesc')}
                </p>
                <Link to="/menu" className="inline-flex items-center justify-center gap-2 bg-black-deep text-white-pure px-6 py-3 rounded-xl text-sm sm:text-base font-semibold shadow-lg hover:bg-gray-900 transition-all duration-300">
                  {t('home.viewMenu')}
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative rounded-[2rem] overflow-hidden shadow-lg aspect-[4/3] sm:aspect-auto sm:h-[360px] bg-transparent">
                <img src={PPImage} alt="PP" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Design sobre avec fond sombre */}
      <section className="w-full py-10 bg-gray-light">
        <div className="container-responsive">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">{t('home.categories')}</h2>
            <p className="text-gray-dark text-sm">{t('home.categoriesDesc')}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {categories.map(cat => (
              <Link 
                key={cat.name} 
                to={cat.link}
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-32 sm:h-36 overflow-hidden">
                  <img 
                    src={cat.image} 
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Fond sombre uniforme */}
                  <div className="absolute inset-0 bg-black/55 group-hover:bg-black/45 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white-pure font-bold text-xl sm:text-2xl tracking-wide">
                      {cat.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Menus Section - Design épuré */}
      <section className="w-full py-16 bg-white">
        <div className="container-responsive">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">{t('home.menus')}</h2>
            <p className="text-gray-dark text-sm">{t('home.menusDesc')}</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white-pure rounded-xl shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-5">
                    <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : menus.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-dark">{t('home.noMenus')}</p>
              <Link to="/menu" className="btn-primary inline-block mt-4">
                {t('home.viewMenu')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(() => {
                const sorted = [...menus].sort((a, b) => new Date(b.dateCreation || 0) - new Date(a.dateCreation || 0));
                const newestIds = new Set(sorted.slice(0, 2).map(m => m.idMenu));
                return menus.map((menu) => {
                  const isNew = newestIds.has(menu.idMenu);
                  return (
                <div 
                  key={menu.idMenu} 
                  className="group bg-white rounded-2xl shadow-md overflow-hidden border-2 border-black-deep/10 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={getImageUrl(menu.photo)} 
                      alt={menu.nomMenu}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=Image+non+disponible'; }}
                    />
                    {isNew && (
                      <div className="absolute top-3 right-3 bg-gold text-black-deep px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        Nouveau
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2">{menu.nomMenu}</h3>
                    <p className="text-gray-dark text-sm mb-4 line-clamp-2">{menu.descriptionMenu || menu.description}</p>
                    
                    {menuNotes[menu.idMenu] > 0 && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-0.5">{renderStars(menuNotes[menu.idMenu])}</div>
                        <span className="text-xs text-gray-500">({menuReviewsCount[menu.idMenu] || 0} avis)</span>
                        <span className="text-xs text-gold font-semibold">{menuNotes[menu.idMenu]}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-black-deep">
                          {Number(menu.prixSpecial || menu.prix || 0).toFixed(2)} €
                        </span>
                        <p className="text-xs text-gray-dark mt-1">{menu.plats?.length || 0} plat(s) inclus</p>
                      </div>
                        <button
                          onClick={() => setSelectedMenu(menu)}
                          className="btn-secondary text-sm py-2 px-4"
                        >
                          {t('menu.discover')}
                        </button>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-gold text-black-deep py-16 border-t border-black-deep/10">
        <div className="container-responsive text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t('home.ready')}</h2>
          <p className="text-sm sm:text-base mb-6 text-black-deep/70">
            {t('home.readyDesc')}
          </p>
          <Link to="/menu" className="inline-flex items-center gap-2 bg-black-deep text-white-pure px-8 py-3 rounded-xl font-bold hover:bg-gray-900 transition-all duration-300">
            {t('home.viewMenu')}
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Modal overlay pour le détail menu */}
      {selectedMenu && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm py-6"
          onClick={() => setSelectedMenu(null)}
        >
          <div
            className="relative w-full max-w-6xl mx-4 my-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMenu(null)}
              className="absolute -top-2 -right-2 z-10 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
            <MenuDetailModal menu={selectedMenu} onBack={() => setSelectedMenu(null)} />
          </div>
        </div>
      )}
    </div>
  );
}