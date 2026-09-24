import React from 'react';
import { ProductCardSkeleton } from './ProductCardSkeleton';

interface ProductGridSkeletonProps {
  count?: number;
  columns?: string; // custom grid layout class
}

export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({ 
  count = 6,
  columns = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
}) => {
  return (
    <div className={columns}>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={`skeleton-card-${index}`} />
      ))}
    </div>
  );
};
