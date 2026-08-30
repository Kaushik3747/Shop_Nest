import { useState } from "react";
import { Search, Eye } from "lucide-react";
import { mockOrders } from "@/data/mockData";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/constants";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { toast } from "sonner";
import type { OrderStatus } from "@/types";

const allStatuses: OrderStatus[] = ["pending", "confirmed", "processing", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState(mockOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);

  const filtered = orders.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
    toast.success(`Order status updated to ${ORDER_STATUS_LABELS[status]}`);
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Order Management</h2>
          <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
        </div>
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
        {["all", ...allStatuses].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={cn("px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0 capitalize",
              statusFilter === s ? "bg-brand-500 text-white" : "border border-border text-muted-foreground hover:border-brand-400")}>
            {s === "all" ? "All" : ORDER_STATUS_LABELS[s as OrderStatus]}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by order ID..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-xl bg-card focus:outline-none focus:border-brand-500" />
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Order ID</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Items</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Total</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <p className="text-sm font-semibold text-foreground">{order.id}</p>
                    <p className="text-xs text-muted-foreground capitalize">{order.paymentMethod}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-foreground">{order.address.name}</p>
                    <p className="text-xs text-muted-foreground">{order.address.city}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      {order.items.slice(0, 2).map(({ product }) => (
                        <img key={product.id} src={product.images[0]} className="w-8 h-8 rounded-lg object-cover" alt="" />
                      ))}
                      {order.items.length > 2 && <span className="text-xs text-muted-foreground">+{order.items.length - 2}</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm font-bold text-brand-500">{formatCurrency(order.total)}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", ORDER_STATUS_COLORS[order.status])}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-1.5 ml-auto px-3 py-1.5 text-xs font-medium text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors">
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-background rounded-2xl p-6 w-full max-w-lg shadow-xl animate-scale-in max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground">{selectedOrder.id}</h3>
              <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", ORDER_STATUS_COLORS[selectedOrder.status])}>
                {ORDER_STATUS_LABELS[selectedOrder.status]}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{selectedOrder.address.name} • {selectedOrder.address.city} • {formatDate(selectedOrder.createdAt)}</p>
            <div className="space-y-2 mb-4">
              {selectedOrder.items.map(({ product, quantity, price }) => (
                <div key={product.id} className="flex items-center gap-3">
                  <img src={product.images[0]} className="w-10 h-10 rounded-lg object-cover" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{product.name}</p>
                    <p className="text-xs text-muted-foreground">×{quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-brand-500">{formatCurrency(price * quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 mb-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-brand-500">{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {allStatuses.map((s) => (
                  <button key={s} onClick={() => updateStatus(selectedOrder.id, s)}
                    className={cn("px-3 py-1.5 rounded-xl text-xs font-medium transition-colors",
                      selectedOrder.status === s ? "bg-brand-500 text-white" : "border border-border hover:border-brand-400 text-muted-foreground")}>
                    {ORDER_STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
