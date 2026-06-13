import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, Truck, Banknote, CheckCircle } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { commandeService } from '../services/commandeService';
import { getImageUrl } from '../utils/imageUtils';
import { useTranslation } from '../i18n/I18nContext';
import toast from 'react-hot-toast';

export default function Cart() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tableInfo, setTableInfo] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  /*useEffect(() => {
    const selectedTable = localStorage.getItem('selectedTable');
    if (selectedTable) {
      setTableInfo(JSON.parse(selectedTable));
    }
  }, []);*/

  useEffect(() => {
  const selectedTable = localStorage.getItem('selectedTable');
  if (selectedTable) {
    const parsed = JSON.parse(selectedTable);
    console.log('📦 Objet complet:', parsed);
    
    // ✅ Ajoutez 'idTables' à la recherche
    const tableId = parsed.idTable || parsed.ID_TABLES || parsed.idTables || parsed.id || parsed.tableId;
    
    console.log('🔍 ID trouvé:', tableId);
    
    setTableInfo({
      ...parsed,
      idTable: tableId
    });
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
      instructions.push(`Cuisson: ${item.cuisson === 'saignant' ? t('orders.cooking.rare') : item.cuisson === 'a_point' ? t('orders.cooking.medium') : t('orders.cooking.wellDone')}`);
    }
    if (item.supplements?.length > 0) {
      instructions.push(item.supplements.map(s => s.label).join(', '));
    }
    if (item.allergie) {
      instructions.push(`⚠️ ${t('orders.allergy')}: ${item.allergie}`);
    }
    if (item.commentaire) {
      instructions.push(`${t('orders.note')}: ${item.commentaire}`);
    }
    return instructions.join(' · ');
  };

  const TVA_RATE = 0.10;
  const sousTotal = getTotalPrice();
  const tva = sousTotal * TVA_RATE;
  const total = sousTotal + tva;

  const handleProceedToPayment = () => {
    if (!isAuthenticated()) {
      toast.error(t('cart.loginRequired'));
      navigate('/login');
      return;
    }
    
    if (!tableInfo) {
      toast.error(t('cart.selectTableRequired'));
      navigate('/tables');
      return;
    }
    
    setShowPaymentModal(true);
  };

  /*const handleCheckout = async () => {
    if (!paymentMethod) {
      toast.error('Veuillez choisir un mode de paiement');
      return;
    }
    
    const userId = user?.idUser || user?.id;
    if (!userId) {
      toast.error('Utilisateur non identifié');
      return;
    }
    
    setLoading(true);
    
    const commandeData = {
      userId: parseInt(userId),
      tablesId: parseInt(tableInfo.idTable),
      plats: cartItems.map(item => ({
        platId: parseInt(item.idPlat),
        quantite: parseInt(item.quantity || 1),
        instructionSpeciale: getItemInstruction(item) || ""
      }))
    };*/

    const handleCheckout = async () => {
  if (!paymentMethod) {
    toast.error('Veuillez choisir un mode de paiement');
    return;
  }
  
  const userId = user?.idUser || user?.id;
  if (!userId) {
    toast.error('Utilisateur non identifié');
    return;
  }
  
    setLoading(true);
    
    const commandeData = {
      userId: parseInt(userId),
      tablesId: parseInt(tableInfo.idTable),
      plats: cartItems.map(item => ({
        platId: parseInt(item.idPlat),
        quantite: parseInt(item.quantite || item.quantity || 1),
        instructionSpeciale: getItemInstruction(item) || ""
      }))
    };

    try {
      const response = await commandeService.create(commandeData);
      toast.success(t('cart.orderSuccess'));
      clearCart();
      localStorage.removeItem('selectedTable');
      
      if (paymentMethod === 'CB') {
        toast.info(t('cart.stripeComing'));
      }
      
      navigate('/mes-commandes');
    } catch (error) {
      console.error('Erreur commande:', error);
      toast.error(error.response?.data?.message || t('cart.orderError'));
    } finally {
      setLoading(false);
      setShowPaymentModal(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{t('cart.empty')}</h2>
            <p className="text-gray-500 mb-6">{t('cart.emptyDesc')}</p>
            <Link to="/menu" className="inline-flex items-center gap-2 bg-black-deep text-white px-6 py-3 rounded-xl font-semibold">
              {t('cart.discoverMenu')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{t('cart.title')}</h1>
          <p className="text-gray-500 text-sm">{cartItems.length} {t('cart.items')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item) => (
              <div key={item.idPlat} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img 
                      src={getImageUrl(item.imagePlat)}
                      alt={item.nomPlat}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://placehold.co/100x100/e2e8f0/64748b?text=No+img'; }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.nomPlat}</h3>
                    {getItemInstruction(item) && (
                      <p className="text-gray-500 text-xs mt-1">{getItemInstruction(item)}</p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateItemQuantity(item.idPlat, (item.quantite || 1) - 1)}
                          className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-semibold w-8 text-center">{item.quantite || 1}</span>
                        <button
                          onClick={() => updateItemQuantity(item.idPlat, (item.quantite || 1) + 1)}
                          className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-black-deep">{(item.prix * (item.quantite || 1)).toFixed(2)} €</p>
                          <button onClick={() => removeFromCart(item.idPlat)} className="text-red-500 text-xs hover:text-red-700 mt-1">
                            {t('cart.remove')}
                          </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-bold text-lg mb-4 pb-2 border-b border-gray-100">{t('cart.summary')}</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('cart.subtotal')}</span>
                  <span className="font-medium">{sousTotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('cart.delivery')}</span>
                  <span className="text-green-600 font-medium">{t('cart.free')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('cart.vat')}</span>
                  <span className="font-medium">{tva.toFixed(2)} €</span>
                </div>
                
                <div className="border-t border-gray-100 pt-3 mt-2">
                  <div className="flex justify-between">
                    <span className="font-bold">{t('common.total')}</span>
                    <span className="text-black-deep font-bold text-xl">{total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              {tableInfo && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck size={14} className="text-gray-600" />
                    <span className="text-gray-600">{t('cart.selectedTable')}:</span>
                    <span className="font-medium">{t('tables.number')} {tableInfo.numeroTable}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleProceedToPayment}
                className="w-full mt-5 bg-black-deep hover:bg-gray-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                <CreditCard size={18} />
                {t('cart.proceedToPayment')}
              </button>
              
              <Link to="/menu" className="w-full mt-3 block text-center text-gray-500 text-sm hover:text-gray-700">
                ← {t('cart.addMoreItems')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Paiement */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="text-center mb-5">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-7 h-7 text-gray-600" />
              </div>
              <h2 className="text-xl font-bold">{t('cart.paymentMethod')}</h2>
              <p className="text-gray-500 text-sm">{t('cart.choosePayment')}</p>
            </div>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={() => setPaymentMethod('CB')}
                className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                  paymentMethod === 'CB' ? 'border-gray-800 bg-gray-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className="text-gray-600" />
                  <span className="font-medium">{t('cart.card')}</span>
                </div>
                {paymentMethod === 'CB' && <CheckCircle size={20} className="text-gray-800" />}
              </button>
              
              <button
                onClick={() => setPaymentMethod('ESPECES')}
                className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                  paymentMethod === 'ESPECES' ? 'border-gray-800 bg-gray-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Banknote size={20} className="text-gray-600" />
                  <span className="font-medium">{t('cart.cash')}</span>
                </div>
                {paymentMethod === 'ESPECES' && <CheckCircle size={20} className="text-gray-800" />}
              </button>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleCheckout}
                disabled={!paymentMethod || loading}
                className="flex-1 bg-black-deep hover:bg-gray-800 text-white py-2.5 rounded-xl font-semibold disabled:opacity-50"
              >
                {loading ? t('cart.orderInProgress') : t('cart.confirmOrder')}
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}