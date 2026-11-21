import React from 'react';
import { Plus } from 'lucide-react';
import type { Product } from '../types';
import { formatPrice } from '../lib/utils';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.basePrice;

  return (
    <div className="group relative flex flex-col bg-background text-foreground transition-all duration-300">
      {/* Fashion Aspect Ratio 3:4 Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900 cursor-pointer">
        <img
          src={product.primaryImage}
          alt={product.title}
          loading="lazy"
          onClick={() => onQuickView(product)}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Minimalist Pill Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {hasDiscount && (
            <span className="px-2.5 py-1 bg-black text-white text-[10px] font-bold tracking-[0.15em] uppercase">
              Sale
            </span>
          )}
          {product.featured && (
            <span className="px-2.5 py-1 bg-neutral-900/90 backdrop-blur-sm text-neutral-200 text-[10px] font-semibold tracking-[0.15em] uppercase">
              Limited
            </span>
          )}
        </div>

        {/* Quick Add Slide-Up Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
          className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 py-3 bg-white/95 hover:bg-white text-black text-xs font-bold uppercase tracking-[0.15em] shadow-lg flex items-center justify-center gap-1.5 backdrop-blur-sm active:scale-98"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Quick Add</span>
        </button>
      </div>

      {/* Product Typography (Luxury Retail Format) */}
      <div className="flex flex-col pt-4 space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3
            onClick={() => onQuickView(product)}
            className="font-medium text-sm text-foreground tracking-tight cursor-pointer hover:underline line-clamp-1"
          >
            {product.title}
          </h3>
          <div className="flex items-baseline gap-2 shrink-0">
            <span className="text-sm font-bold text-foreground">
              {formatPrice(product.basePrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through font-normal">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground font-light line-clamp-1">
          {product.description}
        </p>
      </div>
    </div>
  );
};
