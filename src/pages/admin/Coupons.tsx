import { useState } from "react";
import { Plus, Edit, Trash2, Tag, ToggleLeft, ToggleRight } from "lucide-react";
import { mockCoupons } from "@/data/mockData";
import type { Coupon } from "@/types";
import { formatDate, formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState(mockCoupons);
  const [showModal, setShowModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: "", type: "percentage" as Coupon["type"], value: 10, minPurchase: 0, description: "" });

  const toggleCoupon = (id: string) => {
    setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c));
    toast.success("Coupon status updated");
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    toast.success("Coupon deleted");
  };

  const addCoupon = () => {
    if (!newCoupon.code.trim()) { toast.error("Coupon code is required"); return; }
    const coupon: Coupon = {
      id: `c_${Date.now()}`,
      ...newCoupon,
      usageLimit: 100,
      usedCount: 0,
      isActive: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    setCoupons((prev) => [coupon, ...prev]);
    setShowModal(false);
    setNewCoupon({ code: "", type: "percentage", value: 10, minPurchase: 0, description: "" });
    toast.success("Coupon created successfully!");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Coupon Management</h2>
          <p className="text-sm text-muted-foreground">{coupons.length} coupons total</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Coupons", value: coupons.length },
          { label: "Active", value: coupons.filter(c => c.isActive).length },
          { label: "Inactive", value: coupons.filter(c => !c.isActive).length },
          { label: "Total Used", value: coupons.reduce((acc, c) => acc + c.usedCount, 0) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-brand-500">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Coupons Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div key={coupon.id} className={cn("bg-card border-2 rounded-2xl p-5 transition-all", coupon.isActive ? "border-border" : "border-border opacity-60")}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-brand-500" />
                <span className="font-bold text-foreground text-base tracking-wider">{coupon.code}</span>
              </div>
              <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", coupon.isActive ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20" : "bg-muted text-muted-foreground")}>
                {coupon.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{coupon.description}</p>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="bg-muted/50 rounded-lg p-2">
                <p className="text-muted-foreground">Discount</p>
                <p className="font-bold text-foreground">
                  {coupon.type === "percentage" ? `${coupon.value}%` : coupon.type === "fixed" ? formatCurrency(coupon.value) : "Free Shipping"}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-2">
                <p className="text-muted-foreground">Min. Purchase</p>
                <p className="font-bold text-foreground">{formatCurrency(coupon.minPurchase)}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-2">
                <p className="text-muted-foreground">Usage</p>
                <p className="font-bold text-foreground">{coupon.usedCount}/{coupon.usageLimit}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-2">
                <p className="text-muted-foreground">Expires</p>
                <p className="font-bold text-foreground">{formatDate(coupon.expiresAt)}</p>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 mb-3">
              <div className="bg-brand-500 h-full rounded-full" style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }} />
            </div>
            <div className="flex items-center justify-between">
              <button onClick={() => toggleCoupon(coupon.id)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                {coupon.isActive ? <ToggleRight className="w-4 h-4 text-brand-500" /> : <ToggleLeft className="w-4 h-4" />}
                {coupon.isActive ? "Disable" : "Enable"}
              </button>
              <div className="flex gap-2">
                <button className="p-1.5 text-muted-foreground hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => deleteCoupon(coupon.id)} className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-background rounded-2xl p-6 w-full max-w-md shadow-xl animate-scale-in">
            <h3 className="font-bold text-foreground text-lg mb-5">Create New Coupon</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Coupon Code</label>
                <input value={newCoupon.code} onChange={(e) => setNewCoupon((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. SAVE20" className="w-full px-3 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-brand-500 uppercase font-mono font-bold tracking-wider" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Type</label>
                  <select value={newCoupon.type} onChange={(e) => setNewCoupon((p) => ({ ...p, type: e.target.value as Coupon["type"] }))}
                    className="w-full px-3 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-brand-500">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="free_shipping">Free Shipping</option>
                    <option value="first_order">First Order</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Value</label>
                  <input type="number" value={newCoupon.value} onChange={(e) => setNewCoupon((p) => ({ ...p, value: Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-brand-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Min. Purchase (₹)</label>
                <input type="number" value={newCoupon.minPurchase} onChange={(e) => setNewCoupon((p) => ({ ...p, minPurchase: Number(e.target.value) }))}
                  className="w-full px-3 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <input value={newCoupon.description} onChange={(e) => setNewCoupon((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Short description..." className="w-full px-3 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-brand-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-semibold hover:bg-muted transition-colors">Cancel</button>
              <button onClick={addCoupon} className="flex-1 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-semibold transition-colors">Create Coupon</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
