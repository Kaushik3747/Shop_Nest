import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, Search, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { mockOrders } from "@/data/mockData";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/constants";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

export default function Orders() {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold mb-4">Please login to view orders</h2>
        <Link to="/login" className="px-6 py-3 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600">Login</Link>
      </div>
    );
  }

  const statuses = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];
  const filtered = mockOrders.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (mockOrders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">No orders yet</h2>
        <p className="text-muted-foreground mb-6">When you place an order, it will appear here.</p>
        <Link to="/products" className="px-6 py-3 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">My Orders</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by Order ID..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-xl bg-card focus:outline-none focus:border-brand-500" />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
          {statuses.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={cn("px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors capitalize flex-shrink-0",
                statusFilter === s ? "bg-brand-500 text-white" : "border border-border text-muted-foreground hover:border-brand-400")}>
              {s === "all" ? "All Orders" : ORDER_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((order) => (
          <Link key={order.id} to={`/orders/${order.id}`}
            className="block bg-card border border-border rounded-2xl p-4 hover:border-brand-300 transition-colors group card-hover">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-bold text-foreground text-sm">{order.id}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{formatDate(order.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", ORDER_STATUS_COLORS[order.status])}>
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-500 transition-colors" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3 overflow-x-auto scrollbar-thin pb-1">
              {order.items.map(({ product }) => (
                <img key={product.id} src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-border" />
              ))}
              {order.items.length > 3 && (
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-xs text-muted-foreground font-medium flex-shrink-0">
                  +{order.items.length - 3}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{order.items.length} item(s)</span>
              <span className="font-bold text-brand-500">{formatCurrency(order.total)}</span>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No orders found matching your search.</p>
        </div>
      )}
    </div>
  );
}
