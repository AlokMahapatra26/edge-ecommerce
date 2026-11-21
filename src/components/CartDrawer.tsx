import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, subtotal, clearCart } =
    useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any>(null);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          customerEmail: 'alex.buyer@example.com',
          customerName: 'Alex Mercer',
        }),
      });

      const data = await response.json<{
        url?: string;
        orderNumber?: string;
        totalAmount?: number;
      }>();

      if (data.url) {
        // Real Stripe Checkout redirect
        window.location.href = data.url;
      } else {
        // Demo simulation
        setOrderComplete(data);
        clearCart();
      }
    } catch (err) {
      console.error('Checkout error', err);
      alert('Unable to complete checkout. Please verify connection.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-background border-l border-border shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-border/60 flex items-center justify-between">
            <h2 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
              <span>Shopping Cart</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary font-bold text-muted-foreground">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </h2>
            <button
              onClick={closeCart}
              className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {orderComplete ? (
              <div className="text-center py-12 px-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black">Order Placed Successfully!</h3>
                <p className="text-sm text-muted-foreground">
                  Order Number: <strong className="text-foreground">{orderComplete.orderNumber}</strong>
                </p>
                <div className="p-4 rounded-xl bg-secondary/50 text-left text-xs space-y-1">
                  <p><strong>Total:</strong> {formatPrice(orderComplete.totalAmount || 0)}</p>
                  <p><strong>Fulfillment:</strong> Edge Worker dispatched receipt to customer email.</p>
                </div>
                <button
                  onClick={() => {
                    setOrderComplete(null);
                    closeCart();
                  }}
                  className="w-full py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm"
                >
                  Continue Shopping
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
                  🛒
                </div>
                <h3 className="font-bold text-base text-foreground">Your cart is empty</h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Looks like you haven't added anything to your cart yet.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex gap-4 p-3 rounded-xl border border-border/50 bg-card hover:border-border transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 rounded-lg object-cover bg-secondary shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm text-foreground leading-tight line-clamp-1">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.productId, item.variantId)}
                          className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {item.variantTitle && (
                        <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                          {item.variantTitle}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-border rounded-lg bg-background">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.variantId, item.quantity - 1)
                          }
                          className="px-2.5 py-1 text-xs hover:bg-secondary font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.variantId, item.quantity + 1)
                          }
                          className="px-2.5 py-1 text-xs hover:bg-secondary font-bold"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-black text-sm text-foreground">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {!orderComplete && items.length > 0 && (
            <div className="p-6 border-t border-border/60 bg-secondary/30 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-bold text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="font-bold text-emerald-600">
                    {subtotal > 10000 ? 'FREE' : formatPrice(1500)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-foreground pt-2 border-t border-border/50">
                  <span>Total</span>
                  <span>
                    {formatPrice(subtotal + (subtotal > 10000 ? 0 : 1500))}
                  </span>
                </div>
              </div>

              <button
                disabled={isCheckingOut}
                onClick={handleCheckout}
                className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-black text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Edge Checkout...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Stripe Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>256-Bit Encrypted End-to-End Edge Security</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
