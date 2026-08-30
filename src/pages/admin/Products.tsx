import { useState } from "react";
import { Plus, Search, Edit, Trash2, Package, Filter } from "lucide-react";
import { mockProducts } from "@/data/mockData";
import type { Product } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";
import StarRating from "@/components/ui-custom/StarRating";

export default function AdminProducts() {
  const [products, setProducts] = useState(mockProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const categories = ["all", ...Array.from(new Set(mockProducts.map((p) => p.category)))];

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Product deleted");
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Product Management</h2>
          <p className="text-sm text-muted-foreground">{products.length} total products</p>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Products", value: products.length, color: "text-brand-500" },
          { label: "In Stock", value: products.filter(p => p.stock > 0).length, color: "text-emerald-500" },
          { label: "Low Stock", value: products.filter(p => p.stock > 0 && p.stock <= 20).length, color: "text-yellow-500" },
          { label: "Out of Stock", value: products.filter(p => p.stock === 0).length, color: "text-red-500" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-3 text-center">
            <p className={cn("text-xl font-bold", color)}>{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-xl bg-card focus:outline-none focus:border-brand-500" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:border-brand-500">
          {categories.map((c) => <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Product</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Category</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Price</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Stock</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Rating</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground line-clamp-1 max-w-[180px]">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">{product.category}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-semibold text-brand-500">{formatCurrency(product.price)}</p>
                      {product.discount > 0 && <p className="text-xs text-muted-foreground line-through">{formatCurrency(product.originalPrice)}</p>}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn("text-xs font-semibold px-2 py-1 rounded-full",
                      product.stock === 0 ? "bg-red-100 text-red-600 dark:bg-red-900/20" :
                      product.stock <= 20 ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20" :
                      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20")}>
                      {product.stock === 0 ? "Out of Stock" : `${product.stock} units`}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <StarRating rating={product.rating} size="sm" />
                      <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button className="p-1.5 text-muted-foreground hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteProduct(product.id)}
                        className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-background rounded-2xl p-6 w-full max-w-lg shadow-xl animate-scale-in">
            <h3 className="font-bold text-foreground text-lg mb-5">Add New Product</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Product Name</label>
                  <input placeholder="e.g. iPhone 16 Pro" className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none focus:border-brand-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Brand</label>
                  <input placeholder="e.g. Apple" className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none focus:border-brand-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Price (₹)</label>
                  <input type="number" placeholder="0" className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none focus:border-brand-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Stock</label>
                  <input type="number" placeholder="0" className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none focus:border-brand-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Category</label>
                <select className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none focus:border-brand-500">
                  {categories.filter(c => c !== "all").map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Description</label>
                <textarea rows={3} placeholder="Product description..." className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none focus:border-brand-500 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-semibold hover:bg-muted transition-colors">Cancel</button>
              <button onClick={() => { toast.success("Product added successfully!"); setShowAddModal(false); }}
                className="flex-1 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-semibold transition-colors">Add Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
