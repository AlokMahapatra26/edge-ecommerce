import React from 'react';
import { Plus, Eye } from 'lucide-react';
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
    <div className="group relative flex flex-col rounded-2xl border border-border/50 bg-card hover:border-border transition-all duration-300 hover:shadow-lg overflow-hidden">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-secondary/30">
        <img
          src={product.primaryImage}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Discount / Featured Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {hasDiscount && (
            <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
              Sale
            </span>
          )}
          {product.featured && (
            <span className="px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-wider shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Floating Quick View Button */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 px-4 py-2 rounded-full bg-background/90 hover:bg-background text-foreground text-xs font-bold shadow-md flex items-center gap-1.5 backdrop-blur-sm"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </button>
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-5">
        <h3
          onClick={() => onQuickView(product)}
          className="font-bold text-base text-foreground tracking-tight cursor-pointer hover:underline line-clamp-1"
        >
          {product.title}
        </h3>

        <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price & Action */}
        <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-foreground">
              {formatPrice(product.basePrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through font-medium">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="p-2.5 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground transition-all duration-200 flex items-center justify-center active:scale-90"
            title="Add to Cart"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
