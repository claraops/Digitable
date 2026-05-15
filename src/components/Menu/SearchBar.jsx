import { Search, X } from 'lucide-react';

export default function SearchBar({ searchTerm, onSearchChange, placeholder }) {
  return (
    <div className="relative max-w-md mx-auto">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-dark" size={20} />
      <input
        type="text"
        placeholder={placeholder || "Rechercher un plat..."}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="input pl-12 pr-10"
      />
      {searchTerm && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-dark hover:text-gold"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}