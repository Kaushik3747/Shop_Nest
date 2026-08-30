import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Check, MapPin, Truck, CreditCard, ShoppingBag, ChevronRight, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency, generateId } from "@/lib/utils";
import { TAX_RATE, SHIPPING_OPTIONS, PAYMENT_METHODS } from "@/constants";
import { mockOrders } from "@/data/mockData";
import { toast } from "sonner";

const STEPS = [
  { id: 1, label: "Address", icon: MapPin },
  { id: 2, label: "Delivery", icon: Truck },
  { id: 3, label: "Payment", icon: CreditCard },
  { id: 4, label: "Review", icon: ShoppingBag },
];

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(user?.addresses[0]?.id || "");
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [processing, setProcessing] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold mb-4">Please login to checkout</h2>
        <Link to="/login" className="px-6 py-3 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600">Login</Link>
      </div>
    );
  }

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const shippingOption = SHIPPING_OPTIONS.find((s) => s.id === selectedShipping);
  const shippingFee = shippingOption?.price || 49;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax + shippingFee;

  const handlePlaceOrder = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    const orderId = `ORD-2024-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    toast.success(`Order ${orderId} placed successfully! 🎉`);
    clearCart();
    navigate(`/orders/${orderId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 right-0 top-5 h-0.5 bg-border -z-0">
          <div className="h-full bg-brand-500 transition-all" style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }} />
        </div>
        {STEPS.map(({ id, label, icon: Icon }) => (
          <div key={id} className="flex flex-col items-center gap-1.5 z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              id < step ? "bg-brand-500 text-white" : id === step ? "bg-brand-500 text-white ring-4 ring-brand-100 dark:ring-brand-900" : "bg-muted text-muted-foreground"
            }`}>
              {id < step ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${id <= step ? "text-brand-500" : "text-muted-foreground"}`}>{label}</span>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-500" /> Delivery Address
              </h2>
              <div className="space-y-3 mb-4">
                {user?.addresses.map((addr) => (
                  <label key={addr.id} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedAddress === addr.id ? "border-brand-500 bg-brand-50 dark:bg-brand-900/10" : "border-border hover:border-brand-300"
                  }`}>
                    <input type="radio" name="address" value={addr.id} checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)} className="mt-1 accent-brand-500" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground text-sm">{addr.name}</span>
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full capitalize">{addr.type}</span>
                        {addr.isDefault && <span className="text-xs bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 px-2 py-0.5 rounded-full">Default</span>}
                      </div>
                      <p className="text-sm text-muted-foreground">{addr.line1}, {addr.line2 && `${addr.line2}, `}{addr.city}, {addr.state} — {addr.pincode}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">📞 {addr.phone}</p>
                    </div>
                  </label>
                ))}
              </div>
              <button className="flex items-center gap-2 text-sm text-brand-500 hover:text-brand-600 font-medium">
                <Plus className="w-4 h-4" /> Add New Address
              </button>
              <button onClick={() => setStep(2)} disabled={!selectedAddress}
                className="w-full mt-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Delivery */}
          {step === 2 && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-brand-500" /> Shipping Method
              </h2>
              <div className="space-y-3 mb-6">
                {SHIPPING_OPTIONS.map((option) => (
                  <label key={option.id} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedShipping === option.id ? "border-brand-500 bg-brand-50 dark:bg-brand-900/10" : "border-border hover:border-brand-300"
                  }`}>
                    <input type="radio" name="shipping" value={option.id} checked={selectedShipping === option.id}
                      onChange={() => setSelectedShipping(option.id)} className="accent-brand-500" />
                    <div className="flex-1">
                      <p className="font-semibold text-foreground text-sm">{option.name}</p>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                    <span className={`font-bold text-sm ${option.price === 0 ? "text-emerald-600" : "text-foreground"}`}>
                      {option.price === 0 ? "FREE" : formatCurrency(option.price)}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 border border-border rounded-xl text-sm font-semibold hover:bg-muted transition-colors">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-500" /> Payment Method
              </h2>
              <div className="space-y-3 mb-6">
                {PAYMENT_METHODS.map((method) => (
                  <label key={method.id} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPayment === method.id ? "border-brand-500 bg-brand-50 dark:bg-brand-900/10" : "border-border hover:border-brand-300"
                  }`}>
                    <input type="radio" name="payment" value={method.id} checked={selectedPayment === method.id}
                      onChange={() => setSelectedPayment(method.id)} className="accent-brand-500" />
                    <span className="text-xl">{method.icon}</span>
                    <span className="font-medium text-foreground text-sm">{method.name}</span>
                  </label>
                ))}
              </div>
              {selectedPayment === "card" && (
                <div className="space-y-3 p-4 bg-muted/50 rounded-xl mb-4">
                  <input placeholder="Card Number" className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none focus:border-brand-500" />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="MM/YY" className="px-3 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none focus:border-brand-500" />
                    <input placeholder="CVV" className="px-3 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none focus:border-brand-500" />
                  </div>
                  <input placeholder="Card Holder Name" className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none focus:border-brand-500" />
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-3 border border-border rounded-xl text-sm font-semibold hover:bg-muted transition-colors">Back</button>
                <button onClick={() => setStep(4)} className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                  Review Order <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-bold text-foreground mb-4">Order Review</h2>
              <div className="space-y-3 mb-4">
                {items.map(({ product, quantity, selectedColor, selectedSize }) => (
                  <div key={product.id} className="flex gap-3">
                    <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-xl" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground line-clamp-1">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedColor} {selectedSize && `| ${selectedSize}`} | Qty: {quantity}</p>
                      <p className="text-sm font-bold text-brand-500 mt-0.5">{formatCurrency(product.price * quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="flex-1 py-3 border border-border rounded-xl text-sm font-semibold hover:bg-muted transition-colors">Back</button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {processing ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</>
                  ) : (
                    <><Check className="w-4 h-4" />Place Order — {formatCurrency(total)}</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-card border border-border rounded-2xl p-5 h-fit sticky top-24">
          <h3 className="font-bold text-foreground mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm mb-4">
            {items.slice(0, 3).map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center gap-2">
                <img src={product.images[0]} className="w-8 h-8 rounded-lg object-cover" alt="" />
                <span className="flex-1 text-muted-foreground line-clamp-1">{product.name}</span>
                <span className="font-medium text-xs">×{quantity}</span>
              </div>
            ))}
            {items.length > 3 && <p className="text-xs text-muted-foreground">+{items.length - 3} more items</p>}
          </div>
          <div className="border-t border-border pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax (18%)</span><span>{formatCurrency(tax)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shippingFee === 0 ? "FREE" : formatCurrency(shippingFee)}</span></div>
            <div className="flex justify-between font-bold text-base border-t border-border pt-2">
              <span>Total</span><span className="text-brand-500">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
