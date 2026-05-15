import { Trash2, Minus, Plus } from 'lucide-react';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-light rounded-lg hover:shadow-md transition-all">
      {/* Item Info */}
      <div className="flex items-center gap-3 flex-grow min-w-0">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-light rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
          🍔
        </div>
        <div className="min-w-0 flex-grow">
          <h3 className="font-semibold text-black-deep text-sm sm:text-base line-clamp-2">
            {item.nomPlat}
          </h3>
          <p className="text-gold font-bold text-xs sm:text-sm">
            {item.prix.toFixed(2)} € × {item.quantite} = {(item.prix * item.quantite).toFixed(2)} €
          </p>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
        {/* Quantity Controls */}
        <div className="flex items-center gap-2 bg-gray-light rounded-lg p-1 sm:p-1.5">
          <button
            onClick={() => onUpdateQuantity(item.idPlat, Math.max(1, item.quantite - 1))}
            className="p-1 hover:bg-white-pure rounded transition-all duration-300 flex-center"
            aria-label="Diminuer la quantité"
          >
            <Minus size={16} className="sm:w-5 sm:h-5" />
          </button>
          <span className="w-6 sm:w-8 text-center font-semibold text-sm">
            {item.quantite}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.idPlat, item.quantite + 1)}
            className="p-1 hover:bg-white-pure rounded transition-all duration-300 flex-center"
            aria-label="Augmenter la quantité"
          >
            <Plus size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onRemove(item.idPlat)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300"
          aria-label="Supprimer"
        >
          <Trash2 size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}