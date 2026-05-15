import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MenuCard from '../components/Menu/MenuCard';
import { platService } from '../services/platService';

export default function Home() {
  const [popularPlats, setPopularPlats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    platService.getDisponibles()
      .then(res => setPopularPlats(res.data.slice(0, 6)))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['Burgers', 'Pizzas', 'Pâtes', 'Salades'];

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-black-deep to-gray-900 text-white-pure section-padding">
        <div className="container-responsive text-center">
          <h1 className="mb-3 sm:mb-4 leading-tight">
            Commandez vos <span className="text-gold">plats préférés</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-light mb-6 sm:mb-8">
            Livraison rapide & qualité garantie
          </p>
          <Link to="/menu" className="btn-primary gap-2">
            Voir le menu complet 
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full section-padding">
        <div className="container-responsive">
          <h2 className="text-center mb-8 sm:mb-12">Catégories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {categories.map(cat => (
              <Link 
                key={cat} 
                to={`/menu?category=${cat.toLowerCase()}`}
                className="bg-gray-light p-4 sm:p-6 rounded-xl text-center hover:bg-gold transition-colors group"
              >
                <span className="text-sm sm:text-base lg:text-lg font-semibold group-hover:text-black-deep">
                  {cat}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Plats Section */}
      <section className="w-full bg-gray-light section-padding">
        <div className="container-responsive">
          <h2 className="text-center mb-2 sm:mb-4">Plats Populaires</h2>
          <p className="text-center text-gray-dark text-sm sm:text-base mb-8 sm:mb-12">
            Découvrez nos plats les plus aimés
          </p>
          
          {loading ? (
            <div className="grid-responsive">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="card h-80 animate-pulse bg-gray-light"></div>
              ))}
            </div>
          ) : popularPlats.length > 0 ? (
            <div className="grid-responsive">
              {popularPlats.map(plat => (
                <MenuCard key={plat.idPlat} plat={plat} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-dark">Aucun plat disponible</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-gradient-to-r from-gold to-yellow-500 text-black-deep section-padding">
        <div className="container-responsive text-center">
          <h2 className="mb-3 sm:mb-4">Prêt à commander ?</h2>
          <p className="text-sm sm:text-base mb-6 sm:mb-8">
            Découvrez toute notre sélection de plats délicieux
          </p>
          <Link to="/menu" className="btn-secondary font-bold gap-2">
            Commander maintenant
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
