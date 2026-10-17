import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBag, ArrowRight, Check } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, option: string, delta: number) => void;
  onRemoveItem: (productId: string, option: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [coupon, setCoupon] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [orderComplete, setOrderComplete] = useState<boolean>(false);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const finalDiscount = (subtotal * discount) / 100;
  const shipping = subtotal > 100 || items.length === 0 ? 0 : 12;
  const total = Math.max(0, subtotal - finalDiscount + shipping);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === 'CIRCADIAN15') {
      setDiscount(15);
      setCouponError(null);
    } else {
      setCouponError('Invalid code. Try CIRCADIAN15 for 15% off.');
    }
  };

  const handleCompleteOrder = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      setTimeout(() => {
        setOrderComplete(false);
        onClearCart();
        onClose();
      }, 2500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/75 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-900 border-l border-stone-800 p-6 flex flex-col justify-between shadow-2xl text-stone-100">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold font-display text-stone-100">
                Aura Bag ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping progress */}
          <div className="py-3">
            <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1.5">
              <span>
                {subtotal >= 100
                  ? '✨ Compliments of Aura: Free Studio Shipping unlocked'
                  : `Add $${100 - subtotal} more for complimentary studio delivery`}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-300"
                style={{ width: `${Math.min(100, (subtotal / 100) * 100)}%` }}
              />
            </div>
          </div>

          {/* Cart Items list */}
          <div className="flex-1 overflow-y-auto py-2 space-y-3 pr-1">
            {orderComplete ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold font-display text-stone-100">
                  Ritual Order Confirmed
                </h3>
                <p className="text-xs text-stone-400">
                  Your cold-pressed botanical essentials are being prepared with care in our Provence laboratory.
                </p>
              </div>
            ) : items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-3 text-stone-500">
                <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                <div className="text-sm font-medium">Your shopping bag is empty</div>
                <div className="text-xs text-stone-600">
                  Explore our cold-pressed botanicals and mindful movement essentials.
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedOption}`}
                  className="p-3 rounded-2xl bg-stone-950/60 border border-stone-800 flex items-center gap-3"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-900 shrink-0 border border-stone-800">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-stone-100 truncate">
                      {item.product.name}
                    </h4>
                    <div className="text-[11px] text-stone-400 truncate">
                      {item.selectedOption}
                    </div>
                    <div className="text-xs font-mono font-bold text-amber-400 mt-1 tabular-nums">
                      ${item.product.price}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-stone-800 rounded-lg bg-stone-900">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.selectedOption, -1)
                        }
                        className="px-2 py-0.5 text-xs text-stone-400 hover:text-stone-100 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-mono font-semibold tabular-nums text-stone-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.selectedOption, 1)
                        }
                        className="px-2 py-0.5 text-xs text-stone-400 hover:text-stone-100 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        onRemoveItem(item.product.id, item.selectedOption)
                      }
                      className="p-1.5 text-stone-500 hover:text-rose-400 transition-colors cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout info */}
          {items.length > 0 && !orderComplete && (
            <div className="pt-4 border-t border-stone-800 flex flex-col gap-3">
              {/* Coupon input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Code: CIRCADIAN15"
                  className="flex-1 px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-400 uppercase font-mono"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-200 cursor-pointer transition-colors"
                >
                  Apply
                </button>
              </form>
              {couponError && (
                <div className="text-[11px] text-amber-400">{couponError}</div>
              )}
              {discount > 0 && (
                <div className="text-[11px] text-emerald-400">
                  Circadian Member 15% discount applied!
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-400 pt-2 border-t border-stone-800/60 font-mono">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums text-stone-200">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Member Discount (15%)</span>
                    <span className="tabular-nums">-${finalDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Carbon-Neutral Delivery</span>
                  <span className="tabular-nums text-stone-200">
                    {shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-100 pt-2 border-t border-stone-800 font-display">
                  <span>Total Amount</span>
                  <span className="text-amber-400 tabular-nums">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCompleteOrder}
                disabled={isCheckingOut}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-[0.98] cursor-pointer shadow-lg shadow-amber-500/10"
              >
                {isCheckingOut ? (
                  <span>Processing Ritual Order...</span>
                ) : (
                  <>
                    <span>Proceed to Secure Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
