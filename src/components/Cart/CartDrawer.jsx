import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag } from 'lucide-react';
import CartItem from './CartItem';
import { useCart } from '../../hooks/useCart';

export default function CartDrawer({ isOpen, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black-deep bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white-pure shadow-xl z-50 transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-light">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingBag size={24} className="text-gold" />
              Mon Panier ({cartItems.length})
            </h2>
            <button onClick={onClose} className="text-gray-dark hover:text-gold">
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-dark mb-4">Votre panier est vide</p>
                <Link to="/menu" onClick={onClose} className="btn-primary inline-block">
                  Voir le menu
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map(item => (
                  <CartItem
                    key={item.idPlat}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-light p-4">
              <div className="flex justify-between mb-4">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-gold">{getTotalPrice().toFixed(2)} €</span>
              </div>
              <Link to="/cart" onClick={onClose} className="btn-primary w-full text-center block">
                Commander
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}