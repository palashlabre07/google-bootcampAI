import React, { useState } from 'react';
import { ShopProduct } from '../types';
import { ShoppingBag, Star, Check, Sparkles, Plus, Eye } from 'lucide-react';

interface ScreenShopProps {
  products: ShopProduct[];
  onAddToCart: (product: ShopProduct, option: string) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const ScreenShop: React.FC<ScreenShopProps> = ({
  products,
  onAddToCart,
  cartCount,
  onOpenCart,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const handleOpenDetail = (prod: ShopProduct) => {
    setSelectedProduct(prod);
    setSelectedOption(prod.volumeOrSize[0]);
  };

  const handleAdd = (prod: ShopProduct, option?: string) => {
    const opt = option || prod.volumeOrSize[0];
    onAddToCart(prod, opt);
    setAddedNotice(prod.name);
    setTimeout(() => setAddedNotice(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6 pb-24 text-stone-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-medium text-stone-400">Cold-Pressed & Sustainable</div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-100 font-display mt-0.5">
            Aura Apothecary
          </h1>
          <div className="text-xs text-stone-400 mt-0.5">
            Crafted in micro-batches from pure organic botanicals.
          </div>
        </div>
        <button
          onClick={onOpenCart}
          className="relative p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors cursor-pointer"
          aria-label="View Shopping Bag"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px] flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Added Notification Banner */}
      {addedNotice && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Added {addedNotice} to your bag</span>
          </div>
          <button
            onClick={onOpenCart}
            className="font-semibold underline cursor-pointer hover:text-emerald-200"
          >
            View Bag
          </button>
        </div>
      )}

      {/* Featured Botanical Spotlight */}
      <div className="rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 group shadow-md">
        <div className="relative h-48 w-full overflow-hidden bg-stone-950">
          <img
            src="/src/assets/images/wellness_product_bottle_1792230967261.jpg"
            alt="Botanical Extract No. 04 Apothecary Bottle"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between text-xs text-amber-400">
            <span className="font-semibold tracking-wider">Staff Pick · Provence Harvest</span>
            <div className="flex items-center gap-1 text-stone-300">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="tabular-nums font-semibold">4.9</span>
              <span className="text-stone-500">(184)</span>
            </div>
          </div>

          <h2 className="text-lg font-bold text-stone-100 font-display mt-1">
            Botanical Extract No. 04 — Rose &amp; Calendula
          </h2>
          <p className="text-xs text-stone-400 mt-1 line-clamp-2">
            Cold-infused on raw travertine stone. Infuses restorative antioxidants to shield
            circadian skin barrier.
          </p>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-800">
            <div>
              <span className="text-xl font-bold text-stone-100 font-display tabular-nums">
                $68
              </span>
              <span className="text-xs text-stone-500 line-through ml-1.5 tabular-nums">
                $82
              </span>
            </div>
            <button
              onClick={() => handleAdd(products[0])}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-transform active:scale-95 cursor-pointer shadow-sm"
            >
              Add to Bag
            </button>
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800 flex flex-col justify-between hover:border-stone-700 transition-colors"
          >
            <div>
              <div className="relative h-32 rounded-xl overflow-hidden bg-stone-950 mb-3 border border-stone-800/80">
                <img
                  src={prod.image}
                  alt={prod.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleOpenDetail(prod)}
                  className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-stone-900/80 hover:bg-stone-800 text-stone-300 text-xs flex items-center gap-1 backdrop-blur-sm cursor-pointer"
                  aria-label={`Quick view ${prod.name}`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Details</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <span>{prod.category}</span>
                <div className="flex items-center gap-1 text-stone-300">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="tabular-nums font-semibold">{prod.rating}</span>
                </div>
              </div>

              <h3 className="text-xs font-bold text-stone-100 mt-1 line-clamp-1 font-display">
                {prod.name}
              </h3>
              <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-2">
                {prod.subtitle}
              </p>
            </div>

            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-stone-800">
              <span className="text-base font-bold text-stone-100 font-display tabular-nums">
                ${prod.price}
              </span>
              <button
                onClick={() => handleAdd(prod)}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-200 text-xs font-medium transition-colors cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                {selectedProduct.category}
              </span>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-xs text-stone-400 hover:text-stone-100 p-1 cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <div className="h-44 rounded-xl overflow-hidden bg-stone-950 border border-stone-800">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-stone-100 font-display">
                {selectedProduct.name}
              </h2>
              <p className="text-xs text-stone-400 mt-1">{selectedProduct.description}</p>
            </div>

            {/* Options */}
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-2">
                Select Specification
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.volumeOrSize.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedOption(opt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      selectedOption === opt
                        ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold'
                        : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:border-stone-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
              <div className="text-[11px] font-semibold text-stone-300 mb-1.5">
                Key Specifications
              </div>
              <ul className="text-[11px] text-stone-400 space-y-1">
                {selectedProduct.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-amber-400" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-800">
              <span className="text-2xl font-bold text-stone-100 font-display tabular-nums">
                ${selectedProduct.price}
              </span>
              <button
                onClick={() => {
                  handleAdd(selectedProduct, selectedOption);
                  setSelectedProduct(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-transform active:scale-95 cursor-pointer"
              >
                Add {selectedOption} to Bag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
