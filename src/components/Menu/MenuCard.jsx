import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import toast from 'react-hot-toast';

export default function MenuCard({ plat, onViewDetails }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({
      idPlat: plat.idPlat,
      nomPlat: plat.nomPlat,
      prix: plat.prix,
      quantite: 1,
      image: plat.image || null
    });
    toast.success(`${plat.nomPlat} ajouté au panier !`);
  };

  return (
    <div 
      onClick={() => onViewDetails && onViewDetails(plat)}
      className="card-hover h-full"
    >
      {/* Image Container - Responsive height */}
      <div className="relative w-full aspect-video sm:aspect-square bg-gradient-to-br from-gray-light to-gray-200 overflow-hidden">
        {plat.image ? (
          <img 
            src={plat.image} 
            alt={plat.nomPlat}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl sm:text-6xl">
            🍔
          </div>
        )}
        
        {/* Unavailable Overlay */}
        {!plat.disponibilite && (
          <div className="absolute inset-0 bg-black-deep bg-opacity-50 flex items-center justify-center">
            <span className="text-white-pure font-semibold px-2 py-1 sm:px-3 sm:py-2 bg-black-deep bg-opacity-75 rounded-lg text-xs sm:text-sm">
              Indisponible
            </span>
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white-pure px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold text-gold shadow-md">
          ⭐ {plat.note || '4.8'}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 h-full">
        {/* Title */}
        <div>
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-black-deep line-clamp-2">
            {plat.nomPlat}
          </h3>
        </div>
        
        {/* Description */}
        <p className="text-gray-dark text-xs sm:text-sm text-clamp-2 flex-grow">
          {plat.description || "Délicieux plat préparé avec des ingrédients frais"}
        </p>
        
        {/* Footer: Price and Button */}
        <div className="flex items-end justify-between gap-2 pt-2 border-t border-gray-light">
          <div className="flex-1">
            <span className="text-base sm:text-lg lg:text-xl font-bold text-gold block">
              {plat.prix.toFixed(2)} €
            </span>
            {plat.ancienPrix && (
              <span className="text-xs sm:text-sm text-gray-dark line-through">
                {plat.ancienPrix.toFixed(2)} €
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!plat.disponibilite}
            className="btn-icon bg-gold text-black-deep hover:bg-gold/80 disabled:opacity-50 disabled:cursor-not-allowed p-2"
            aria-label="Ajouter au panier"
          >
            <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}