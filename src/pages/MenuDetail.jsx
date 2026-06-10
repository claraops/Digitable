// MenuDetail.jsx - version corrigée
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChefHat, Clock, Users, Sparkles, ShoppingBag } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';
import { useCart } from '../hooks/useCart';
import { useTranslation } from '../i18n/I18nContext';
import toast from 'react-hot-toast';

export default function MenuDetail({ menu, onBack }) {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { t } = useTranslation();

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

 // MenuDetail.jsx - modifier la fonction handleOrderMenu
const handleOrderMenu = () => {
  if (!menu.plats || menu.plats.length === 0) {
    toast.error(t('menu.emptyMenu'));
    return;
  }
  
  // Ajouter tous les plats du menu au panier
  menu.plats.forEach(plat => {
    // Vérifier si le plat existe déjà dans le panier
    const existingItem = cartItems.find(item => item.idPlat === plat.idPlat);
    
    if (existingItem) {
      // ✅ Remplacer toast.info par toast.success ou toast
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
      <div className="container mx-auto px-4 max-w-5xl">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          {t('common.back')}
        </button>

        <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          {/* Image d'en-tête */}
          <div className="relative h-64 md:h-80 bg-gray-100">
            {menu.photo ? (
              <img
                src={getImageUrl(menu.photo)}
                alt={menu.nomMenu}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://placehold.co/1200x500/e2e8f0/64748b?text=Menu'; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <Sparkles className="w-16 h-16 text-gray-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            
            <div className="absolute top-4 left-4 flex gap-2">
              {isNew && (
                <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  {t('menu.new')}
                </span>
              )}
              {isPromo && (
                <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                  -{Math.round(((menu.prix - menu.prixSpecial) / menu.prix) * 100)}% PROMO
                </span>
              )}
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                {menu.nomMenu}
              </h1>
              <p className="text-white/90 text-sm md:text-base line-clamp-2 drop-shadow">
                {menu.descriptionMenu || menu.description || "Découvrez notre sélection exceptionnelle"}
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-6 pb-6 mb-6 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-600">
                <ChefHat size={18} className="text-gold" />
                <span className="text-sm">{t('menu.preparedByChefs')}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={18} className="text-gold" />
                <span className="text-sm">{t('menu.prepTime')}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users size={18} className="text-gold" />
                <span className="text-sm">{menu.plats?.length || 0} {t('menu.dishPlural')}</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-3xl font-bold text-gold">
                {Number(menu.prixSpecial || menu.prix || 0).toFixed(2)} €
              </span>
              {menu.prix && menu.prixSpecial && menu.prixSpecial < menu.prix && (
                <span className="text-gray-400 text-lg line-through">
                  {Number(menu.prix).toFixed(2)} €
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
              <span className="w-1 h-6 bg-gold rounded-full"></span>
              {t('menu.menuComposition')}
            </h2>

            {Object.entries(platsByCategorie).map(([categorie, plats]) => (
              <div key={categorie} className="mb-8 last:mb-0">
                <h3 className="font-semibold text-lg mb-4 text-gray-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gold rounded-full"></span>
                  {categoryLabels[categorie] || categorie}
                </h3>
                <div className="space-y-3">
                  {plats.map(plat => (
                    <div
                      key={plat.idPlat}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">
                            {plat.nomPlat}
                          </span>
                          {!plat.disponibilite && (
                            <span className="text-xs text-red-500">({t('menu.unavailable')})</span>
                          )}
                        </div>
                        {plat.description && (
                          <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">
                            {plat.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gold font-semibold">
                          {plat.prix?.toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={handleOrderMenu}
              className="w-full mt-8 bg-black-deep hover:bg-gray-800 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
            >
              <ShoppingBag size={18} />
              {t('menu.orderThisMenu')} ({menu.plats?.length || 0} {t('menu.dishes')})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}