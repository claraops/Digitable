import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { menuService } from '../services/menuService';
import PPImage from '../assets/pp-canva.png';
import petitPlat from '../assets/ptit-plat.avif';
import petitEntre from '../assets/petit-entre.avif';
import petitDessert from '../assets/.petit-dessert.avif';
import petiteBoisson from '../assets/petite-boisson.avif';

export default function Home() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const menuResponse = await menuService.getActifs();
        let menusData = [];
        if (Array.isArray(menuResponse.data)) {
          menusData = menuResponse.data;
        } else if (menuResponse.data?.content) {
          menusData = menuResponse.data.content;
        } else {
          menusData = [];
        }
        setMenus(menusData);
      } catch (error) {
        console.error('Erreur chargement menus:', error);
        setMenus([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/api/v1/images/')) return `http://localhost:8080${imagePath}`;
    return `http://localhost:8080/api/v1/images/${imagePath}`;
  };

  const categories = [
    { name: 'Entrées', image: petitEntre, link: '/menu?category=entrees' },
    { name: 'Nos Plats', image: petitPlat, link: '/menu?category=plats' },
    { name: 'Desserts', image: petitDessert, link: '/menu?category=desserts' },
    { name: 'Boissons', image: petiteBoisson, link: '/menu?category=boissons' }
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="w-full pt-12 pb-8 sm:pt-16 sm:pb-12 bg-gold text-black-deep overflow-hidden">
        <div className="container-responsive">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="max-w-2xl">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 text-black-deep">
                  Commandez vos meilleurs plats <span className="block">et soyez servi sur place en deux clics</span>
                </h1>
                <p className="max-w-xl text-sm sm:text-base lg:text-lg mb-6 text-black-deep/70">
                  Menu digital pour restaurant : passez votre commande directement depuis votre table et recevez votre plat sans attendre.
                </p>
                <Link to="/menu" className="inline-flex items-center justify-center gap-2 bg-black-deep text-white-pure px-6 py-3 rounded-xl text-sm sm:text-base font-semibold shadow-lg hover:bg-gray-900 transition-all duration-300">
                  Voir la carte
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative rounded-[2rem] overflow-hidden shadow-lg min-h-[280px] sm:min-h-[360px] bg-transparent">
                <img src={PPImage} alt="PP" className="h-full w-full object-cover object-center" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Design sobre avec fond sombre */}
      <section className="w-full py-10 bg-gray-light">
        <div className="container-responsive">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Nos Catégories</h2>
            <p className="text-gray-dark text-sm">Découvrez nos spécialités</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {categories.map(cat => (
              <Link 
                key={cat.name} 
                to={cat.link}
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-32 sm:h-36 overflow-hidden">
                  <img 
                    src={cat.image} 
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Fond sombre uniforme */}
                  <div className="absolute inset-0 bg-black/55 group-hover:bg-black/45 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white-pure font-bold text-xl sm:text-2xl tracking-wide">
                      {cat.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Menus Section - Design épuré */}
      <section className="w-full py-16 bg-white">
        <div className="container-responsive">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Nos Menus</h2>
            <p className="text-gray-dark text-sm">Des compositions savoureuses à prix avantageux</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white-pure rounded-xl shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-5">
                    <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : menus.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-dark">Aucun menu disponible pour le moment.</p>
              <Link to="/menu" className="btn-primary inline-block mt-4">
                Voir la carte
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {menus.map((menu) => (
                <div 
                  key={menu.idMenu} 
                  className="group bg-white-pure rounded-xl shadow-md overflow-hidden border border-gray-light hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={getImageUrl(menu.photo)} 
                      alt={menu.nomMenu}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=Image+non+disponible'; }}
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2">{menu.nomMenu}</h3>
                    <p className="text-gray-dark text-sm mb-4 line-clamp-2">{menu.descriptionMenu || menu.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-gold">
                          {Number(menu.prixSpecial || menu.prix || 0).toFixed(2)} €
                        </span>
                        <p className="text-xs text-gray-dark mt-1">{menu.plats?.length || 0} plat(s) inclus</p>
                      </div>
                      <Link 
                        to={`/menu?menu=${menu.idMenu}`} 
                        className="btn-secondary text-sm py-2 px-4"
                      >
                        Voir le menu
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-gold text-black-deep py-12">
        <div className="container-responsive text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Prêt à commander ?</h2>
          <p className="text-sm sm:text-base mb-6 text-black-deep/70">
            Choisissez vos plats et recevez-les directement à votre table
          </p>
          <Link to="/menu" className="inline-flex items-center gap-2 bg-black-deep text-white-pure px-8 py-3 rounded-xl font-bold hover:bg-gray-900 transition-all duration-300">
            Voir la carte
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}