const categories = [
  { id: 'all', name: 'Tous', icon: '🍽️' },
  { id: 'entrees', name: 'Entrées', icon: '🥗' },
  { id: 'plats', name: 'Plats', icon: '🍝' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
  { id: 'boissons', name: 'Boissons', icon: '🥤' },
];

export default function CategoryFilter({ selectedCategory, onSelectCategory }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id === 'all' ? null : cat.id)}
          className={`px-5 py-2 rounded-full transition-all duration-300 flex items-center gap-2
            ${selectedCategory === (cat.id === 'all' ? null : cat.id)
              ? 'bg-gold text-black-deep font-semibold shadow-lg scale-105'
              : 'bg-gray-light text-gray-dark hover:bg-gray-light/80'
            }`}
        >
          <span className="text-lg">{cat.icon}</span>
          <span>{cat.name}</span>
        </button>
      ))}
    </div>
  );
}