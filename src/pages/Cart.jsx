import { useCart } from '../hooks/useCart';
import { commandeService } from '../services/commandeService';
import toast from 'react-hot-toast';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();

  const handleCheckout = async () => {
    const userId = localStorage.getItem('userId') || 1;
    const commandeData = {
      userId: parseInt(userId),
      tablesId: 1,
      plats: cartItems.map(item => ({
        platId: item.idPlat,
        quantite: item.quantite,
        instructionsSpeciales: ""
      }))
    };

    try {
      await commandeService.create(commandeData);
      toast.success('Commande passée avec succès !');
      clearCart();
    } catch {
      toast.error('Erreur lors de la commande');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Votre panier est vide</h2>
        <p className="text-gray-dark text-sm sm:text-base mb-6 sm:mb-8">
          Ajoutez des plats à votre panier pour continuer
        </p>
        <Link to="/menu" className="btn-primary gap-2">
          <ArrowLeft size={20} />
          Voir le menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-light section-padding">
      <div className="container-responsive max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="mb-1 sm:mb-2">Mon Panier</h1>
            <p className="text-gray-dark text-sm">
              {cartItems.length} article{cartItems.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link to="/menu" className="btn-secondary gap-2 self-start sm:self-auto">
            <ArrowLeft size={20} />
            Continuer vos achats
          </Link>
        </div>

        {/* Cart Items */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          {cartItems.map(item => (
            <div 
              key={item.idPlat} 
              className="bg-white-pure rounded-lg p-3 sm:p-4 border border-gray-light"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                {/* Item Details */}
                <div className="flex-grow min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-black-deep line-clamp-2">
                    {item.nomPlat}
                  </h3>
                  <p className="text-gold font-bold text-xs sm:text-sm mt-1">
                    {item.prix.toFixed(2)} €
                  </p>
                </div>

                {/* Quantity and Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-dark">Sous-total</p>
                    <p className="font-bold text-sm sm:text-base text-gold">
                      {(item.prix * item.quantite).toFixed(2)} €
                    </p>
                  </div>
                  
                  <span className="text-xs sm:text-sm font-semibold bg-gray-light px-2 sm:px-3 py-1 rounded">
                    Qty: {item.quantite}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.idPlat)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300"
                    aria-label="Supprimer"
                  >
                    <Trash2 size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white-pure rounded-lg p-4 sm:p-6 border border-gray-light shadow-sm">
          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-gray-dark">Sous-total</span>
              <span className="font-semibold">
                {getTotalPrice().toFixed(2)} €
              </span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-gray-dark">Frais de livraison</span>
              <span className="font-semibold">Gratuit</span>
            </div>
            <div className="border-t border-gray-light pt-3 sm:pt-4" />
            <div className="flex justify-between text-base sm:text-lg font-bold">
              <span>Total</span>
              <span className="text-gold text-lg sm:text-2xl">
                {getTotalPrice().toFixed(2)} €
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 sm:space-y-3">
            <button
              onClick={handleCheckout}
              className="btn-primary w-full py-3 sm:py-4 text-base sm:text-lg font-bold"
            >
              Passer la commande
            </button>
            <button
              onClick={clearCart}
              className="btn-secondary w-full py-2 sm:py-3 text-sm sm:text-base"
            >
              Vider le panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}