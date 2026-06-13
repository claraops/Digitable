import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Minus, Plus, ShoppingBag, ChefHat, Clock, AlertCircle, MessageSquare, Coffee, IceCream, Salad } from 'lucide-react';
import { platService } from '../services/platService';
import { avisService } from '../services/avisService';
import { useCart } from '../hooks/useCart';
import { getImageUrl } from '../utils/imageUtils';
import { commandeService } from '../services/commandeService';
import toast from 'react-hot-toast';

export default function PlatDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [plat, setPlat] = useState(null);
  const [avisPlat, setAvisPlat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedCuisson, setSelectedCuisson] = useState('a_point');
  const [supplements, setSupplements] = useState([]);
  const [allergie, setAllergie] = useState('');
  const [commentaire, setCommentaire] = useState('');
  
  // Options de cuisson (uniquement pour les plats principaux)
  const cuissonOptions = [
    { id: 'saignant', label: 'Saignant' },
    { id: 'a_point', label: 'À point' },
    { id: 'bien_cuit', label: 'Bien cuit' }
  ];
  
  // Suppléments (uniquement pour les plats principaux)
  const supplementsOptions = [
    { id: 'piment', label: 'Piment', price: 1.00 },
    { id: 'fromage', label: 'Fromage râpé', price: 1.50 },
    { id: 'sauce', label: 'Sauce supplément', price: 0.80 },
    { id: 'oignons', label: 'Oignons caramélisés', price: 1.20 }
  ];

  // Options pour les boissons
  const boissonOptions = [
    { id: 'glaçons', label: 'Glaçons', price: 0.00 },
    { id: 'citron', label: 'Tranche de citron', price: 0.50 },
    { id: 'menthe', label: 'Feuilles de menthe', price: 0.50 },
    { id: 'sirop', label: 'Sirop supplément', price: 0.80 }
  ];

  // Options pour les entrées
  const entreeOptions = [
    { id: 'sauce_supp', label: 'Sauce supplément', price: 1.00 },
    { id: 'pain_supp', label: 'Pain supplémentaire', price: 0.80 },
    { id: 'dressing', label: 'Dressing', price: 0.50 }
  ];

  // Options pour les desserts
  const dessertOptions = [
    { id: 'chantilly', label: 'Chantilly', price: 1.00 },
    { id: 'glace', label: 'Boule de glace', price: 1.50 },
    { id: 'coulis', label: 'Coulis au choix', price: 0.80 }
  ];

  // Catégories concernées par la cuisson
  const categoriesAvecCuisson = ['PLAT_PRINCIPAL', 'VIANDE', 'POISSON'];
  // Catégories concernées par les suppléments standards
  const categoriesAvecSupplements = ['PLAT_PRINCIPAL', 'ENTREE'];
  
  const estPlatPrincipal = plat?.categorie === 'PLAT_PRINCIPAL';
  const estEntree = plat?.categorie === 'ENTREE';
  const estDessert = plat?.categorie === 'DESSERT';
  const estBoisson = plat?.categorie === 'BOISSON';
  const estApero = plat?.categorie === 'APERO';

  // Obtenir les options spécifiques à la catégorie
  const getCategoryOptions = () => {
    if (estBoisson) return boissonOptions;
    if (estEntree) return entreeOptions;
    if (estDessert) return dessertOptions;
    return supplementsOptions;
  };

  const getCategoryIcon = () => {
    if (estBoisson) return <Coffee size={20} className="text-gold" />;
    if (estDessert) return <IceCream size={20} className="text-gold" />;
    if (estEntree) return <Salad size={20} className="text-gold" />;
    return <ChefHat size={20} className="text-gold" />;
  };

  const getCategoryLabel = () => {
    if (estBoisson) return 'Options boisson';
    if (estDessert) return 'Suppléments dessert';
    if (estEntree) return 'Suppléments entrée';
    if (estApero) return 'Options apéro';
    return 'Suppléments';
  };

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
    return (sum / avisPlat.length).toFixed(2);
  };

  /*useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const platRes = await platService.getById(id);
        setPlat(platRes.data);
        
        try {
          const avisRes = await avisService.getAll();
          if (Array.isArray(avisRes.data)) {
            const platAvis = avisRes.data.filter(avis => avis.commande?.idCommande);
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
  }, [id, navigate]);*/

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const [platRes, avisRes] = await Promise.all([
        platService.getById(id),
        avisService.getByPlatId(id),
      ]);
      setPlat(platRes.data);
      setAvisPlat(Array.isArray(avisRes.data) ? avisRes.data : []);
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

  const handleAddToCart = () => {
    if (!plat) return;
    
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
      commentaire: commentaire,
      categorie: plat.categorie
    });
    
    toast.success(`${plat.nomPlat} ajouté au panier`);
    navigate('/cart');
  };

  const renderStars = (rating, size = 14) => {
    const stars = [];
    const numStars = Math.round(parseFloat(rating) || 0);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={size} 
          className={i <= numStars ? 'fill-gold text-gold' : 'text-gray-300 fill-gray-300'}
        />
      );
    }
    return stars;
  };

  const formatRelativeDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (diffSec < 60) return "à l'instant";
    if (diffMin < 60) return `il y a ${diffMin} min`;
    if (diffHour < 24) return `il y a ${diffHour} h`;
    if (diffDay === 1) return 'hier';
    if (diffDay < 30) return `il y a ${diffDay} jours`;
    if (diffMonth < 12) return `il y a ${diffMonth} mois`;
    return `il y a ${diffYear} ans`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!plat) return null;

  // Afficher le badge de catégorie
  const getCategorieBadge = () => {
    const badges = {
      'APERO': 'bg-purple-100 text-purple-700',
      'ENTREE': 'bg-orange-100 text-orange-700',
      'PLAT_PRINCIPAL': 'bg-green-100 text-green-700',
      'DESSERT': 'bg-pink-100 text-pink-700',
      'BOISSON': 'bg-blue-100 text-blue-700'
    };
    const labels = {
      'APERO': 'Apéritif',
      'ENTREE': 'Entrée',
      'PLAT_PRINCIPAL': 'Plat principal',
      'DESSERT': 'Dessert',
      'BOISSON': 'Boisson'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[plat.categorie] || 'bg-gray-100 text-gray-700'}`}>
        {labels[plat.categorie] || plat.categorie}
      </span>
    );
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <Link to="/menu" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-5 transition-colors">
          <ArrowLeft size={18} />
          Retour à la carte
        </Link>

        {/* Carte principale du plat - 2 colonnes */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-md border-2 border-black-deep/15">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            
            {/* COLONNE GAUCHE : Image + Avis */}
            <div className="space-y-4">
              {/* Image */}
              <div className="relative rounded-xl overflow-hidden bg-gray-100 h-80 lg:h-96">
                <img 
                  src={getImageUrl(plat.imagePlat)} 
                  alt={plat.nomPlat}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://placehold.co/500x500/e2e8f0/64748b?text=Image+non+disponible'; }}
                />
                {/* Badge catégorie sur l'image */}
                <div className="absolute top-3 right-3">
                  {getCategorieBadge()}
                </div>
              </div>
              
              {/* Avis Section - Professional Redesign */}
              <div className="bg-white rounded-xl p-5 border-2 border-black-deep/10 shadow-sm">
                {/* Overall Rating Header */}
                {avisPlat.length > 0 && (
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div className="text-center">
                      <span className="text-4xl font-bold text-black-deep">{getRatingAverage()}</span>
                      <div className="flex items-center gap-0.5 mt-1">
                        {renderStars(getRatingAverage(), 16)}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{avisPlat.length} avis clients</p>
                    </div>
                  </div>
                )}
                
                {/* Rating Breakdown */}
                {avisPlat.length > 0 && (
                  <div className="mb-4 pb-4 border-b border-gray-100 space-y-1.5">
                    {[5, 4, 3, 2, 1].map(star => {
                      const count = avisPlat.filter(a => parseInt(a.note) === star).length;
                      const pct = avisPlat.length > 0 ? (count / avisPlat.length) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500 w-2 text-right">{star}</span>
                          <Star size={12} className="text-gold fill-gold" />
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-gray-400 text-xs w-8 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* Individual Review Cards */}
                {avisPlat.length === 0 ? (
                  <div className="text-center py-6">
                    <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Aucun avis pour ce plat pour le moment.</p>
                    <p className="text-gray-300 text-xs mt-1">Soyez le premier à donner votre avis !</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {avisPlat.map((a, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-black-deep">
                              {a.utilisateurPrenom || a.utilisateurNom ? `${a.utilisateurPrenom || ''} ${a.utilisateurNom || ''}`.trim() : 'Anonyme'}
                            </span>
                            <div className="flex items-center gap-0.5">
                              {renderStars(parseInt(a.note) || 0, 12)}
                            </div>
                          </div>
                          <span className="text-xs text-gray-400">
                            {formatRelativeDate(a.dateAvis)}
                          </span>
                        </div>
                        {a.commentaire && (
                          <p className="text-gray-600 text-xs leading-relaxed">{a.commentaire}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* COLONNE DROITE : Infos plat */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold">{plat.nomPlat}</h1>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {plat.description || 'Description non disponible'}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-5 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-1">
                  {getCategoryIcon()}
                  <span>{getCategorieBadge()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>Prêt en {estBoisson ? '2-5 min' : estDessert ? '5-10 min' : '15-20 min'}</span>
                </div>
              </div>

              {/* ========== SECTION OPTIONS SPECIFIQUES PAR CATEGORIE ========== */}
              
              {/* Cuisson - UNIQUEMENT pour les plats principaux */}
              {estPlatPrincipal && (
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
              )}

              {/* Message pour les boissons */}
              {estBoisson && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700 flex items-center gap-2">
                    <Coffee size={16} />
                    Rafraîchissement garanti - Servi frais ou à température ambiante selon votre choix
                  </p>
                </div>
              )}

              {/* Message pour les desserts */}
              {estDessert && (
                <div className="mb-4 p-3 bg-pink-50 rounded-lg">
                  <p className="text-sm text-pink-700 flex items-center gap-2">
                    <IceCream size={16} />
                    Fait maison par notre chef pâtissier
                  </p>
                </div>
              )}

              {/* Suppléments - Adaptés à la catégorie */}
              {(estPlatPrincipal || estEntree || estDessert || estBoisson) && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2 text-sm text-gray-700 flex items-center gap-2">
                    {getCategoryIcon()}
                    {getCategoryLabel()}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {getCategoryOptions().map(supp => (
                      <label key={supp.id} className="flex items-center justify-between gap-2 cursor-pointer p-2 rounded-lg border border-gray-100 hover:border-gray-300 transition-colors">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={!!supplements.find(s => s.id === supp.id)}
                            onChange={() => toggleSupplement(supp)}
                            className="w-4 h-4 accent-gold"
                          />
                          <span className="text-sm">{supp.label}</span>
                        </div>
                        {supp.price > 0 && (
                          <span className="text-gold text-sm font-semibold">+{supp.price.toFixed(2)} €</span>
                        )}
                        {supp.price === 0 && (
                          <span className="text-green-500 text-xs">Gratuit</span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Note spéciale pour les apéros */}
              {estApero && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2 text-sm text-gray-700">Accompagnement</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 p-2 rounded-lg border border-gray-100">
                      <input type="checkbox" className="w-4 h-4 accent-gold" />
                      <span className="text-sm">Olives vertes</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-lg border border-gray-100">
                      <input type="checkbox" className="w-4 h-4 accent-gold" />
                      <span className="text-sm">Cacahuètes</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-lg border border-gray-100">
                      <input type="checkbox" className="w-4 h-4 accent-gold" />
                      <span className="text-sm">Crackers</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Zone Allergie et Commentaire - pour toutes les catégories */}
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
                    className="w-full p-2 rounded-lg border border-gray-200 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 text-sm"
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
                      className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-semibold w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-300 transition-colors"
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
                  className="w-full bg-black-deep hover:bg-gray-800 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all"
                  disabled={!plat.disponibilite}
                >
                  <ShoppingBag size={18} />
                  {plat.disponibilite ? 'Ajouter au panier' : 'Indisponible'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}