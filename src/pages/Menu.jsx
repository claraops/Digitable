import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import MenuCard from '../components/Menu/MenuCard';
import { platService } from '../services/platService';

export default function Menu() {
  const [plats, setPlats] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tous');
  const [loading, setLoading] = useState(true);

  const categories = ['Tous', 'Entrées', 'Plats', 'Desserts', 'Boissons'];

  useEffect(() => {
    platService.getAll()
      .then((res) => {
        const payload = res?.data ?? res;
        const data = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.content)
          ? payload.content
          : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.plats)
          ? payload.plats
          : [];
        setPlats(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = plats.filter((plat) => {
    if (category !== 'Tous' && plat.categorie !== category) return false;
    if (search && !plat.nomPlat.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen w-full overflow-x-hidden section-padding">
      <div className="container-responsive">
        <div className="mb-8 sm:mb-12 text-center">
          <h1 className="mb-2 sm:mb-3">Notre Menu</h1>
          <p className="text-gray-dark text-sm sm:text-base">
            Découvrez nos délicieux plats préparés avec passion
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="mx-auto max-w-md">
            <div className="relative">
              <Search 
                className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-dark" 
                size={20} 
              />
              <input 
                type="text" 
                placeholder="Rechercher un plat..." 
                value={search}
                onChange={e => setSearch(e.target.value)} 
                className="input pl-10 sm:pl-12 text-sm sm:text-base"
              />
            </div>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          {categories.map(c => (
            <button 
              key={c} 
              onClick={() => setCategory(c)}
              className={`px-3 sm:px-6 py-2 rounded-full transition-all text-xs sm:text-sm font-medium ${
                category === c 
                  ? 'bg-gold text-black-deep font-semibold' 
                  : 'bg-gray-light text-gray-dark hover:bg-gray-dark hover:text-white-pure'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Plats Grid */}
        {loading ? (
          <div className="grid-responsive">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="card h-80 animate-pulse bg-gray-light"></div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid-responsive">
            {filtered.map(plat => (
              <MenuCard key={plat.idPlat} plat={plat} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-dark text-sm sm:text-base">
              Aucun plat trouvé. Essayez une autre recherche ou catégorie.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}