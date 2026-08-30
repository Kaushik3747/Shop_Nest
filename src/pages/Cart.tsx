import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, Tag, ArrowRight, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { mockCoupons } from "@/data/mockData";
import { formatCurrency, cn } from "@/lib/utils";
import { TAX_RATE } from "@/constants";
import { toast } from "sonner";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const navigate = useNavigate();

  const shippingFee = subtotal > 499 ? 0 : 49;
  const couponDiscount = appliedCoupon?.discount || 0;
  const tax = Math.round((subtotal - couponDiscount) * TAX_RATE);
  const total = subtotal - couponDiscount + tax + shippingFee;

  const applyCoupon = () => {
    const coupon = mockCoupons.find((c) => c.code.toLowerCase() === couponCode.toLowerCase() && c.isActive);
    if (!coupon) { toast.error("Invalid or expired coupon code"); return; }
    if (subtotal < coupon.minPurchase) { toast.error(`Minimum purchase ₹${coupon.minPurchase} required`); return; }
    let discount = 0;
    if (coupon.type === "percentage") {
      discount = Math.min(Math.round(subtotal * coupon.value / 100), coupon.maxDiscount || Infinity);
    } else if (coupon.type === "fixed") {
      discount = coupon.value;
    }
    setAppliedCoupon({ code: coupon.code, discount });
    toast.success(`Coupon applied! You saved ₹${discount}`);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-foreground mb-3">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600 transition-colors">
          <ShoppingBag className="w-5 h-5" />
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Shopping Cart ({items.length} items)</h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 font-medium">
          <X className="w-4 h-4" /> Clear Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(({ product, quantity, selectedColor, selectedSize }) => (
            <div key={product.id} className="bg-card border border-border rounded-2xl p-4 flex gap-4 group">
              <Link to={`/products/${product.id}`} className="flex-shrink-0">
                <img src={product.images[0]} alt={product.name} className="w-24 h-24 object-cover rounded-xl group-hover:scale-105 transition-transform" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                    <Link to={`/products/${product.id}`}>
                      <h3 className="font-semibold text-foreground text-sm hover:text-brand-500 line-clamp-2">{product.name}</h3>
                    </Link>
                    {(selectedColor || selectedSize) && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {selectedColor && `Color: ${selectedColor}`}
                        {selectedColor && selectedSize && " | "}
                        {selectedSize && `Size: ${selectedSize}`}
                      </p>
                    )}
                  </div>
                  <button onClick={() => removeFromCart(product.id)} className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-border rounded-xl overflow-hidden">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                    <button onClick={() => updateQuantity(product.id, quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-500">{formatCurrency(product.price * quantity)}</p>
                    {quantity > 1 && <p className="text-xs text-muted-foreground">{formatCurrency(product.price)} each</p>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-brand-500" />
              <h3 className="font-semibold text-foreground text-sm">Apply Coupon</h3>
            </div>
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3">
                <div>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{appliedCoupon.code}</p>
                  <p className="text-xs text-emerald-600">Saved {formatCurrency(appliedCoupon.discount)}</p>
                </div>
                <button onClick={() => { setAppliedCoupon(null); setCouponCode(""); }} className="text-emerald-600 hover:text-emerald-800">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 px-3 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none focus:border-brand-500"
                />
                <button onClick={applyCoupon} className="px-4 py-2 bg-brand-500 text-white rounded-xl text-sm font-semibold hover:bg-brand-600">
                  Apply
                </button>
              </div>
            )}
            <div className="mt-3 space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Available Coupons:</p>
              {mockCoupons.filter(c => c.isActive).slice(0, 2).map(c => (
                <button key={c.code} onClick={() => setCouponCode(c.code)} className="block text-xs text-brand-500 hover:text-brand-600">
                  {c.code} — {c.description}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="font-bold text-foreground mb-4">Order Summary</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount</span>
                  <span>-{formatCurrency(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (18%)</span>
                <span className="font-medium">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className={cn("font-medium", shippingFee === 0 ? "text-emerald-600" : "")}>
                  {shippingFee === 0 ? "FREE" : formatCurrency(shippingFee)}
                </span>
              </div>
              <div className="border-t border-border pt-2.5">
                <div className="flex justify-between font-bold text-base">
                  <span className="text-foreground">Total Amount</span>
                  <span className="text-brand-500">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
            {shippingFee > 0 && (
              <p className="text-xs text-muted-foreground mt-2">Add ₹{499 - subtotal} more for free shipping</p>
            )}
            <button
              onClick={() => navigate("/checkout")}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-brand-500/30"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>
            <Link to="/products" className="block text-center text-sm text-muted-foreground hover:text-brand-500 mt-3 transition-colors">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
