
import React from 'react';
import { StarIcon } from './IconComponents';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  size?: number;
  showText?: boolean;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, totalStars = 5, size = 20, showText = false, className }) => {
  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <StarIcon
            key={index}
            size={size}
            filled={starValue <= rating}
            className={starValue <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
          />
        );
      })}
      {showText && <span className="ml-2 text-sm text-text-muted-light dark:text-text-muted-dark">{rating.toFixed(1)} out of {totalStars}</span>}
    </div>
  );
};

export default StarRating;
