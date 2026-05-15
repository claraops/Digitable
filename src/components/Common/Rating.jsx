import { Star } from 'lucide-react';

export default function Rating({ rating, totalReviews, size = 'md' }) {
  const sizes = {
    sm: 14,
    md: 18,
    lg: 24,
  };

  const starSize = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={starSize}
            className={star <= rating ? 'fill-gold text-gold' : 'text-gray-light'}
          />
        ))}
      </div>
      {totalReviews && (
        <span className="text-gray-dark text-sm">({totalReviews} avis)</span>
      )}
    </div>
  );
}