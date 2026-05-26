// components/Menu/MenuCard.jsx
import { useCart } from '../../hooks/useCart';
import API_URL from '../../config';
import toast from 'react-hot-toast';
import { ShoppingBag, Star } from 'lucide-react';

export default function MenuCard({ plat }) {
  const { addToCart } = useCart();

  const getImageUrl = () => {
    if (!plat.imagePlat) return null;
    if (plat.imagePlat.startsWith('http')) return plat.imagePlat;
    return `${API_URL}/api/v1/images/${plat.imagePlat}`;
  };

  const imageUrl = getImageUrl();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({
      idPlat: plat.idPlat,
      nomPlat: plat.nomPlat,
      prix: plat.prix,
      imagePlat: plat.imagePlat
    });
    toast.success(`${plat.nomPlat} ajouté au panier`);
  };

  return (
    <div className="group bg-white-pure rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {imageUrl ? (
          <img 
            src={imageUrl}
            alt={plat.nomPlat}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=Image+non+disponible';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
            <ShoppingBag size={32} className="text-gray-400 mb-2" />
            <span className="text-gray-500 text-sm">Image non disponible</span>
          </div>
        )}
        {!plat.disponibilite && (
          <div className="absolute top-3 left-3 bg-red-500 text-white-pure text-xs px-2 py-1 rounded-full font-semibold">
            Indisponible
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-gold transition-colors">{plat.nomPlat}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {plat.description || 'Description non disponible'}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-gold font-bold text-xl">{plat.prix?.toFixed(2)} €</span>
          <button 
            onClick={handleAddToCart}
            className="bg-gold hover:bg-gold/90 text-black-deep px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!plat.disponibilite}
          >
            {plat.disponibilite ? 'Ajouter' : 'Indisponible'}
          </button>
        </div>
      </div>
    </div>
  );
}