import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Star } from 'lucide-react';
import { platService } from '../services/platService';
import { menuService } from '../services/menuService';
import { avisService } from '../services/avisService';
import { getImageUrl } from '../utils/imageUtils';
import { useCart } from '../hooks/useCart';
import toast from 'react-hot-toast';

export default function Menu() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
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

  const categories = ['Tous', 'Entrées', 'Plats', 'Desserts', 'Boissons'];
  const categoryMap = {
    'Entrées': 'ENTREE',
    'Plats': 'PLAT_PRINCIPAL',
    'Desserts': 'DESSERT',
    'Boissons': 'BOISSON'
  };

  const categoryLabels = {
    'APERO': 'Apéro',
    'ENTREE': 'Entrées',
    'PLAT_PRINCIPAL': 'Plats',
    'DESSERT': 'Desserts',
    'BOISSON': 'Boissons'
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
        
        /* Récupérer les avis depuis la base de données
        try {
          const avisRes = await avisService.getAll();
          if (Array.isArray(avisRes.data)) {
            // Calculer la note moyenne par plat
            const notesMap = {};
            const countMap = {};
            avisRes.data.forEach(avis => {
              const platId = avis.commande?.idCommande;
              if (platId) {
                const note = parseInt(avis.note) || 0;
                notesMap[platId] = (notesMap[platId] || 0) + note;
                countMap[platId] = (countMap[platId] || 0) + 1;
              }
            });
            
            const avgMap = {};
            Object.keys(notesMap).forEach(platId => {
              avgMap[platId] = (notesMap[platId] / countMap[platId]).toFixed(1);
            });
            setAvisData(avgMap);
          }
        } catch (e) {
          console.warn('Erreur chargement avis:', e);
        }*/
       // Dans le useEffect, remplacez le bloc d'appel avis par :

// Récupérer les avis depuis la base de données
try {
  // Vérifier si avisService existe et a la méthode getAll
  if (avisService && typeof avisService.getAll === 'function') {
    const avisRes = await avisService.getAll();
    if (avisRes && Array.isArray(avisRes.data)) {
      // Calculer la note moyenne par plat
      const notesMap = {};
      const countMap = {};
      avisRes.data.forEach(avis => {
        // Adapter selon votre structure : avis.commande?.idCommande ou avis._ID_COMMANDE
        const platId = avis.commande?.idCommande || avis._ID_COMMANDE;
        if (platId) {
          const note = parseInt(avis.note) || 0;
          notesMap[platId] = (notesMap[platId] || 0) + note;
          countMap[platId] = (countMap[platId] || 0) + 1;
        }
      });
      
      const avgMap = {};
      Object.keys(notesMap).forEach(platId => {
        avgMap[platId] = notesMap[platId] / countMap[platId];
      });
      setAvisData(avgMap);
    }
  } else {
    console.warn('avisService non disponible');
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
        setError('Impossible de charger le menu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [menuIdParam]);

  // Fonction pour afficher les étoiles
  const renderStars = (rating) => {
    const stars = [];
    const numStars = Math.round(parseFloat(rating) || 0);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={16} 
          className={i <= numStars ? 'fill-gold text-gold' : 'text-gray-300 fill-gray-300'}
        />
      );
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
          <button onClick={() => window.location.reload()} className="bg-gold text-black-deep px-6 py-2 rounded-lg">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Vue détail menu
  if (selectedMenu) {
    return (
      <div className="min-h-screen py-12 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/menu" className="inline-flex items-center gap-2 text-gray-500 hover:text-gold mb-6">
            <ArrowLeft size={20} />
            Retour à la carte
          </Link>
          
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            {selectedMenu.photo && (
              <div className="relative h-72 bg-gray-100">
                <img 
                  src={getImageUrl(selectedMenu.photo)} 
                  alt={selectedMenu.nomMenu}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://placehold.co/600x400/e2e8f0/64748b?text=Menu'; }}
                />
              </div>
            )}
            <div className="p-8">
              <h1 className="text-3xl font-bold mb-3">{selectedMenu.nomMenu}</h1>
              <p className="text-gray-600 mb-6">{selectedMenu.descriptionMenu || selectedMenu.description}</p>
              <div className="flex justify-between items-center border-t pt-4">
                <span className="text-2xl font-bold text-gold">
                  {Number(selectedMenu.prixSpecial || selectedMenu.prix || 0).toFixed(2)} €
                </span>
                <span className="text-sm text-gray-500">{selectedMenu.plats?.length || 0} plats inclus</span>
              </div>
              
              <h2 className="text-xl font-bold mt-8 mb-4">Plats inclus :</h2>
              <div className="space-y-4">
                {selectedMenu.plats?.map(plat => (
                  <div key={plat.idPlat} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <span className="font-medium text-base">{plat.nomPlat}</span>
                      <span className="text-gray-500 text-sm ml-2">({categoryLabels[plat.categorie] || plat.categorie})</span>
                    </div>
                    <span className="text-gold font-semibold">{plat.prix?.toFixed(2)} €</span>
                  </div>
                ))}
              </div>
              
              <button onClick={() => navigate('/tables')} className="w-full bg-gold text-black-deep py-3 rounded-xl font-semibold mt-8 hover:bg-gold/90 transition">
                Commander ce menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold">Menu Complet</h1>
        </div>

        {/* Search Bar - grande, arrondie, avec bordure */}
        <div className="mb-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Rechercher un plat..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)} 
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all text-base"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Categories Filter - boutons à côté */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(c => (
            <button 
              key={c} 
              onClick={() => setCategory(c)}
              className={`px-5 py-2 rounded-full transition-all text-sm font-medium ${
                category === c 
                  ? 'bg-gold text-black-deep' 
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-gold hover:text-gold'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grille des plats - cadres plus grands */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-96 animate-pulse bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        ) : filteredPlats.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">Aucun plat trouvé.</p>
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
                      {/* Image */}
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
                            Pas d'image
                          </div>
                        )}
                        {/* Avis étoiles en haut à droite */}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <div className="flex items-center gap-0.5">
                            {renderStars(rating)}
                          </div>
                          <span className="text-xs text-gray-600 ml-1">{rating > 0 ? rating : '0'}</span>
                        </div>
                        {!plat.disponibilite && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            Indisponible
                          </div>
                        )}
                      </div>
                      
                      {/* Infos */}
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-gold transition-colors">
                          {plat.nomPlat}
                        </h3>
                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                          {plat.description || 'Description non disponible'}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-gold font-bold text-xl">{plat.prix?.toFixed(2)} €</span>
                          <button 
                            onClick={(e) => handleAddToCart(e, plat)}
                            className="bg-gold hover:bg-gold/90 text-black-deep px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!plat.disponibilite}
                          >
                            {plat.disponibilite ? 'Ajouter' : 'Indisponible'}
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
                        Pas d'image
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
                        Indisponible
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-gold transition-colors">
                      {plat.nomPlat}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                      {plat.description || 'Description non disponible'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gold font-bold text-xl">{plat.prix?.toFixed(2)} €</span>
                      <button 
                        onClick={(e) => handleAddToCart(e, plat)}
                        className="bg-gold hover:bg-gold/90 text-black-deep px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!plat.disponibilite}
                      >
                        {plat.disponibilite ? 'Ajouter' : 'Indisponible'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Menus section */}
        {menus.filter(m => m.actif).length > 0 && (
          <section className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-center mb-8">Nos Menus</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {menus.filter(m => m.actif).slice(0, 3).map((menu) => (
                <Link 
                  key={menu.idMenu} 
                  to={`/menu?menu=${menu.idMenu}`}
                  className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-lg transition-all group"
                >
                  <h3 className="font-bold text-xl mb-2 group-hover:text-gold transition-colors">{menu.nomMenu}</h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{menu.descriptionMenu || menu.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-gold font-bold text-lg">{Number(menu.prixSpecial || menu.prix || 0).toFixed(2)} €</span>
                    <span className="text-gold text-sm group-hover:translate-x-1 transition-transform">Voir le menu →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}