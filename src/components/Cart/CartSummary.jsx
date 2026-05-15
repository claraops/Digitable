export default function CartSummary({ totalPrice, onCheckout, loading }) {
  const fraisLivraison = totalPrice > 30 ? 0 : 3.90;
  const totalFinal = totalPrice + fraisLivraison;

  return (
    <div className="bg-gray-light rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Récapitulatif</h3>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-dark">Sous-total</span>
          <span className="font-semibold">{totalPrice.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-dark">Livraison</span>
          <span className="font-semibold">
            {fraisLivraison === 0 ? 'Gratuite' : `${fraisLivraison.toFixed(2)} €`}
          </span>
        </div>
        <div className="border-t border-gray-dark pt-3">
          <div className="flex justify-between">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-bold text-gold">{totalFinal.toFixed(2)} €</span>
          </div>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={loading || totalPrice === 0}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Commande en cours...' : 'Passer la commande'}
      </button>
    </div>
  );
}