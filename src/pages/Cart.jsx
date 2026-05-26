import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, Truck, Receipt, AlertCircle } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { commandeService } from '../services/commandeService';
import toast from 'react-hot-toast';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tableInfo, setTableInfo] = useState(null);

  useEffect(() => {
    // Récupérer les informations de la table sélectionnée
    const selectedTable = localStorage.getItem('selectedTable');
    if (selectedTable) {
      setTableInfo(JSON.parse(selectedTable));
    }
  }, []);

  const updateItemQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const getItemInstruction = (item) => {
    const instructions = [];
    if (item.cuisson) {
      instructions.push(`Cuisson: ${item.cuisson === 'saignant' ? 'Saignant' : item.cuisson === 'a_point' ? 'À point' : 'Bien cuit'}`);
    }
    if (item.supplements && item.supplements.length > 0) {
      instructions.push(item.supplements.map(s => s.label).join(', '));
    }
    if (item.allergie) {
      instructions.push(`⚠️ Allergie: ${item.allergie}`);
    }
    if (item.commentaire) {
      instructions.push(`Note: ${item.commentaire}`);
    }
    return instructions.join(' · ');
  };

  const TVA_RATE = 0.10; // 10% TVA
  const sousTotal = getTotalPrice();
  const tva = sousTotal * TVA_RATE;
  const total = sousTotal + tva;

  const handleCheckout = async () => {
    if (!isAuthenticated()) {
      toast.error('Veuillez vous connecter pour passer commande');
      navigate('/login');
      return;
    }
    
    const userId = user?.idUser || user?.id;
    if (!userId) {
      toast.error('Utilisateur non identifié');
      return;
    }
    
    let tablesId = null;
    try {
      const selectedTableStr = localStorage.getItem('selectedTable');
      if (selectedTableStr) {
        const selectedTable = JSON.parse(selectedTableStr);
        tablesId = selectedTable.idTable;
      }
    } catch (e) {
      console.error('Erreur lecture table:', e);
    }

    if (!tablesId) {
      toast.error('Veuillez d\'abord sélectionner une table');
      navigate('/tables');
      return;
    }
    
    setLoading(true);
    
    const commandeData = {
      userId: parseInt(userId),
      tablesId: parseInt(tablesId),
      plats: cartItems.map(item => ({
        platId: item.idPlat,
        quantite: item.quantity || 1,
        instructionSpeciale: getItemInstruction(item)
      }))
    };

    try {
      const response = await commandeService.create(commandeData);
      toast.success('Commande passée avec succès !');
      clearCart();
      localStorage.removeItem('selectedTable');
      if (response.data?.idCommande) {
        navigate(`/orders/${response.data.idCommande}/track`);
      } else {
        navigate('/commandes');
      }
    } catch (error) {
      console.error('Erreur commande:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Votre panier est vide</h2>
            <p className="text-gray-500 mb-6">Ajoutez des plats à votre panier pour continuer</p>
            <Link to="/menu" className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-black-deep px-6 py-3 rounded-xl font-semibold transition-all">
              Découvrir le menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Mon Panier</h1>
          <p className="text-gray-500 text-sm">{cartItems.length} article(s)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des articles */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item) => (
              <div key={item.idPlat} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Image miniature */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.imagePlat ? (
                      <img 
                        src={`http://localhost:8080/api/v1/images/${item.imagePlat}`}
                        alt={item.nomPlat}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://placehold.co/100x100/e2e8f0/64748b?text=No+img'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No img
                      </div>
                    )}
                  </div>
                  
                  {/* Infos produit */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.nomPlat}</h3>
                    {getItemInstruction(item) && (
                      <p className="text-gray-500 text-xs mt-1">
                        {getItemInstruction(item)}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateItemQuantity(item.idPlat, (item.quantity || 1) - 1)}
                          className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gold transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-semibold w-8 text-center">{item.quantity || 1}</span>
                        <button
                          onClick={() => updateItemQuantity(item.idPlat, (item.quantity || 1) + 1)}
                          className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gold transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gold">
                          {((item.prix || 0) * (item.quantity || 1)).toFixed(2)} €
                        </p>
                        <button
                          onClick={() => removeFromCart(item.idPlat)}
                          className="text-red-500 text-xs hover:text-red-700 mt-1 flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-bold text-lg mb-4 pb-2 border-b border-gray-100">Récapitulatif</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">{sousTotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  <span className="text-green-600 font-medium">Gratuit</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">TVA (10%)</span>
                  <span className="font-medium">{tva.toFixed(2)} €</span>
                </div>
                
                <div className="border-t border-gray-100 pt-3 mt-2">
                  <div className="flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="text-gold font-bold text-xl">{total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              {/* Informations table */}
              {tableInfo && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck size={14} className="text-gold" />
                    <span className="text-gray-600">Table sélectionnée:</span>
                    <span className="font-medium">Table {tableInfo.numeroTable}</span>
                  </div>
                  {tableInfo.reservationDate && tableInfo.reservationDate !== 'maintenant' && (
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <Receipt size={14} className="text-gold" />
                      <span className="text-gray-600">Réservation:</span>
                      <span className="text-sm">
                        {tableInfo.reservationDate} à {tableInfo.reservationTime}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full mt-5 bg-gold hover:bg-gold/90 text-black-deep py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <CreditCard size={18} />
                {loading ? 'Commande en cours...' : 'Commander'}
              </button>
              
              <Link 
                to="/menu" 
                className="w-full mt-3 block text-center text-gray-500 text-sm hover:text-gold transition-colors"
              >
                ← Ajouter d'autres plats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}