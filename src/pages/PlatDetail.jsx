import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Minus, Plus, ShoppingBag, ChefHat, Clock, AlertCircle, MessageSquare } from 'lucide-react';
import { platService } from '../services/platService';
import { avisService } from '../services/avisService';
import { commandeService } from '../services/commandeService';
import { useCart } from '../hooks/useCart';
import { getImageUrl } from '../utils/imageUtils';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function PlatDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [plat, setPlat] = useState(null);
  const [avisPlat, setAvisPlat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedCuisson, setSelectedCuisson] = useState('a_point');
  const [supplements, setSupplements] = useState([]);
  const [allergie, setAllergie] = useState('');
  const [commentaire, setCommentaire] = useState('');
  
  const cuissonOptions = [
    { id: 'saignant', label: 'Saignant' },
    { id: 'a_point', label: 'À point' },
    { id: 'bien_cuit', label: 'Bien cuit' }
  ];
  
  const supplementsOptions = [
    { id: 'piment', label: 'Piment', price: 1.00 },
    { id: 'fromage', label: 'Fromage râpé', price: 1.50 },
    { id: 'sauce', label: 'Sauce supplément', price: 0.80 },
    { id: 'oignons', label: 'Oignons caramélisés', price: 1.20 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const platRes = await platService.getById(id);
        setPlat(platRes.data);
        
        // Récupérer les avis liés à ce plat via les commandes
        try {
          const avisRes = await avisService.getAll();
          if (Array.isArray(avisRes.data)) {
            // Filtrer les avis des commandes qui contiennent ce plat
            const platAvis = avisRes.data.filter(avis => {
              // Ici vous devez adapter selon votre structure
              // Les avis sont liés aux commandes, et les commandes aux plats
              return avis.commande?.idCommande;
            });
            setAvisPlat(platAvis);
          }
        } catch (e) {
          console.warn('Erreur chargement avis:', e);
          setAvisPlat([]);
        }
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Plat non trouvé');
        navigate('/menu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const toggleSupplement = (supp) => {
    setSupplements(prev => 
      prev.find(s => s.id === supp.id)
        ? prev.filter(s => s.id !== supp.id)
        : [...prev, supp]
    );
  };

  const getSupplementsTotal = () => {
    return supplements.reduce((sum, s) => sum + s.price, 0);
  };

  const getTotalPrice = () => {
    return (plat?.prix || 0) * quantity + getSupplementsTotal();
  };

  const getRatingAverage = () => {
    if (avisPlat.length === 0) return 0;
    const sum = avisPlat.reduce((acc, a) => acc + parseInt(a.note || 0), 0);
    return (sum / avisPlat.length).toFixed(1);
  };

  const handleAddToCart = () => {
    if (!plat) return;
    
    // Sauvegarder les informations allergie et commentaire
    const instructionFinale = `${allergie ? `⚠️ ALLERGIE: ${allergie}` : ''}${commentaire ? `\n📝 Note: ${commentaire}` : ''}`;
    
    addToCart({
      idPlat: plat.idPlat,
      nomPlat: plat.nomPlat,
      prix: plat.prix,
      imagePlat: plat.imagePlat,
      quantity: quantity,
      cuisson: selectedCuisson,
      supplements: supplements,
      instruction: instructionFinale,
      allergie: allergie,
      commentaire: commentaire
    });
    
    toast.success(`${plat.nomPlat} ajouté au panier`);
    navigate('/cart');
  };

  const renderStars = (rating) => {
    const stars = [];
    const numStars = Math.round(parseFloat(rating) || 0);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={14} 
          className={i <= numStars ? 'fill-gold text-gold' : 'text-gray-300 fill-gray-300'}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!plat) return null;

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Breadcrumb */}
        <Link to="/menu" className="inline-flex items-center gap-2 text-gray-500 hover:text-gold mb-5 transition-colors">
          <ArrowLeft size={18} />
          Retour à la carte
        </Link>

        {/* Carte principale du plat */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Image Section - plus petite, coins arrondis */}
            <div className="relative rounded-xl overflow-hidden bg-gray-100 h-80 lg:h-96">
              <img 
                src={getImageUrl(plat.imagePlat)} 
                alt={plat.nomPlat}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://placehold.co/500x500/e2e8f0/64748b?text=Image+non+disponible'; }}
              />
            </div>

            {/* Info Section */}
            <div>
              {/* Header avec note */}
              <div className="flex items-center justify-between mb-3">
                <h1 className="text-2xl font-bold">{plat.nomPlat}</h1>
                <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full">
                  <div className="flex items-center gap-0.5">
                    {renderStars(getRatingAverage())}
                  </div>
                  <span className="text-gray-500 text-xs ml-1">({avisPlat.length} avis)</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {plat.description || 'Description non disponible'}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-5 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-1">
                  <ChefHat size={16} />
                  <span>Préparé par nos chefs</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>Prêt en 15-20 min</span>
                </div>
              </div>

              {/* Cuisson Section */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-sm text-gray-700">Cuisson *</h3>
                <div className="flex gap-4">
                  {cuissonOptions.map(opt => (
                    <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="cuisson"
                        value={opt.id}
                        checked={selectedCuisson === opt.id}
                        onChange={() => setSelectedCuisson(opt.id)}
                        className="w-4 h-4 accent-gold"
                      />
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Supplements Section */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-sm text-gray-700">Suppléments</h3>
                <div className="grid grid-cols-2 gap-2">
                  {supplementsOptions.map(supp => (
                    <label key={supp.id} className="flex items-center justify-between gap-2 cursor-pointer p-2 rounded-lg border border-gray-100 hover:border-gold transition-colors">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!supplements.find(s => s.id === supp.id)}
                          onChange={() => toggleSupplement(supp)}
                          className="w-4 h-4 accent-gold"
                        />
                        <span className="text-sm">{supp.label}</span>
                      </div>
                      <span className="text-gold text-sm font-semibold">+{supp.price.toFixed(2)} €</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Zone Allergie et Commentaire */}
              <div className="mb-4 space-y-3">
                <div>
                  <h3 className="font-semibold mb-1 text-sm text-gray-700 flex items-center gap-2">
                    <AlertCircle size={14} className="text-red-500" />
                    Allergies / Intolérances
                  </h3>
                  <input
                    type="text"
                    value={allergie}
                    onChange={(e) => setAllergie(e.target.value)}
                    placeholder="Ex: allergique aux arachides, lactose, gluten..."
                    className="w-full p-2 rounded-lg border border-gray-200 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold text-sm"
                  />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-sm text-gray-700 flex items-center gap-2">
                    <MessageSquare size={14} />
                    Note spéciale
                  </h3>
                  <textarea
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                    placeholder="Ex: sans oignons, bien cuit, etc."
                    rows="2"
                    className="w-full p-2 rounded-lg border border-gray-200 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold text-sm resize-none"
                  />
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="border-t border-gray-100 pt-4 mt-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-sm">Quantité</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gold transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-semibold w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gold transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Sous-total</span>
                  <span className="font-semibold">{(plat.prix * quantity).toFixed(2)} €</span>
                </div>
                {getSupplementsTotal() > 0 && (
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span className="text-gray-500">Suppléments</span>
                    <span className="text-gold">+{getSupplementsTotal().toFixed(2)} €</span>
                  </div>
                )}
                <div className="flex items-center justify-between mb-4 pt-2 border-t border-gray-100">
                  <span className="font-bold">Total</span>
                  <span className="text-gold font-bold text-xl">{getTotalPrice().toFixed(2)} €</span>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gold hover:bg-gold/90 text-black-deep py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all"
                  disabled={!plat.disponibilite}
                >
                  <ShoppingBag size={18} />
                  {plat.disponibilite ? 'Ajouter au panier' : 'Indisponible'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Avis Section - uniquement les avis concernant ce plat */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {renderStars(getRatingAverage())}
            </div>
            <h2 className="text-lg font-bold">Avis clients</h2>
            <span className="text-gray-400 text-sm">({avisPlat.length} avis)</span>
          </div>
          
          {avisPlat.length === 0 ? (
            <div className="text-center py-6">
              <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Aucun avis pour ce plat pour le moment.</p>
              <p className="text-gray-400 text-xs">Soyez le premier à donner votre avis après votre commande !</p>
            </div>
          ) : (
            <div className="space-y-4">
              {avisPlat.map((a, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      {renderStars(parseInt(a.note) || 0)}
                    </div>
                    <span className="text-xs text-gray-400">
                      {a.dateAvis ? new Date(a.dateAvis).toLocaleDateString('fr-FR') : 'Date inconnue'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{a.commentaire || 'Aucun commentaire'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}