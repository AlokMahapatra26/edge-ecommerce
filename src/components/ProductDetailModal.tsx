import React, { useState } from 'react';
import { X, Check, ShieldCheck, Truck } from 'lucide-react';
import type { Product } from '../types';
import { formatPrice } from '../lib/utils';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product.variants?.[0]?.id
  );

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const activePrice = selectedVariant?.priceOverride || product.basePrice;

  const handleAdd = () => {
    addToCart(product, selectedVariantId, selectedVariant?.title);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-3xl rounded-3xl bg-background border border-border p-6 sm:p-8 shadow-2xl z-10 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Main Image */}
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-secondary/30 border border-border/40">
            <img
              src={product.primaryImage}
              alt={product.title}
              className="h-full w-full object-cover object-center"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                In Stock & Ready to Ship
              </span>
              <h2 className="text-2xl font-black text-foreground tracking-tight mt-1">
                {product.title}
              </h2>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-2xl font-black text-foreground">
                  {formatPrice(activePrice)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-muted-foreground line-through font-medium">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">
                  Select Option:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        selectedVariantId === v.id
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'bg-secondary/60 hover:bg-secondary text-foreground border-border'
                      }`}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart CTA */}
            <button
              onClick={handleAdd}
              className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-black text-sm hover:opacity-90 transition-all shadow-md active:scale-98"
            >
              Add to Bag • {formatPrice(activePrice)}
            </button>

            {/* Guarantees */}
            <div className="pt-4 border-t border-border/50 grid grid-cols-2 gap-3 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-blue-500" />
                <span>Express Worldwide Shipping</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>30-Day Money Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
