import { useParams, Link } from "react-router-dom";
import { Package, Truck, CheckCircle, Clock, XCircle, Download, RotateCcw } from "lucide-react";
import { mockOrders } from "@/data/mockData";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/constants";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const TRACKING_STEPS: OrderStatus[] = ["pending", "confirmed", "processing", "packed", "shipped", "out_for_delivery", "delivered"];

const statusIcons: Partial<Record<OrderStatus, React.ElementType>> = {
  pending: Clock,
  confirmed: CheckCircle,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const order = mockOrders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Order not found</h2>
        <p className="text-muted-foreground mb-4">This order may not exist or belongs to another account.</p>
        <Link to="/orders" className="text-brand-500 hover:text-brand-600 font-medium">← Back to Orders</Link>
      </div>
    );
  }

  const currentStepIndex = TRACKING_STEPS.indexOf(order.status);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/orders" className="text-sm text-muted-foreground hover:text-brand-500 mb-1 flex items-center gap-1">
            ← My Orders
          </Link>
          <h1 className="text-xl font-bold text-foreground">{order.id}</h1>
          <p className="text-sm text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <span className={cn("text-sm font-semibold px-3 py-1.5 rounded-full", ORDER_STATUS_COLORS[order.status])}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      {/* Tracking Timeline */}
      {order.status !== "cancelled" && order.status !== "returned" && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-5">
          <h2 className="font-bold text-foreground mb-5">Order Tracking</h2>
          <div className="space-y-0">
            {TRACKING_STEPS.map((status, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const timelineEntry = order.timeline.find((t) => t.status === status);
              return (
                <div key={status} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 z-10",
                      isCompleted ? "bg-brand-500 text-white" : "bg-muted text-muted-foreground"
                    )}>
                      {isCompleted ? "✓" : index + 1}
                    </div>
                    {index < TRACKING_STEPS.length - 1 && (
                      <div className={cn("w-0.5 h-8 mt-0", isCompleted && index < currentStepIndex ? "bg-brand-500" : "bg-border")} />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className={cn("text-sm font-semibold", isCompleted ? "text-foreground" : "text-muted-foreground")}>
                      {ORDER_STATUS_LABELS[status]}
                      {isCurrent && <span className="ml-2 text-xs text-brand-500 font-normal animate-pulse">● Current</span>}
                    </p>
                    {timelineEntry && (
                      <p className="text-xs text-muted-foreground mt-0.5">{timelineEntry.description} • {formatDate(timelineEntry.timestamp)}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {order.trackingId && (
            <p className="text-sm text-muted-foreground mt-2">Tracking ID: <span className="font-semibold text-foreground">{order.trackingId}</span></p>
          )}
        </div>
      )}

      {/* Order Items */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-5">
        <h2 className="font-bold text-foreground mb-4">Order Items</h2>
        <div className="space-y-3">
          {order.items.map(({ product, quantity, price, selectedColor, selectedSize }) => (
            <div key={product.id} className="flex gap-3">
              <Link to={`/products/${product.id}`}>
                <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-xl border border-border hover:opacity-90 transition-opacity" />
              </Link>
              <div className="flex-1">
                <Link to={`/products/${product.id}`}>
                  <p className="font-semibold text-foreground text-sm hover:text-brand-500 line-clamp-2">{product.name}</p>
                </Link>
                <p className="text-xs text-muted-foreground">
                  {selectedColor && `${selectedColor}`}{selectedSize && ` | ${selectedSize}`} | Qty: {quantity}
                </p>
              </div>
              <p className="font-bold text-brand-500 text-sm">{formatCurrency(price * quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery & Payment */}
      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-bold text-foreground mb-3">Delivery Address</h2>
          <p className="font-semibold text-foreground text-sm">{order.address.name}</p>
          <p className="text-sm text-muted-foreground mt-1">{order.address.line1}</p>
          {order.address.line2 && <p className="text-sm text-muted-foreground">{order.address.line2}</p>}
          <p className="text-sm text-muted-foreground">{order.address.city}, {order.address.state} — {order.address.pincode}</p>
          <p className="text-sm text-muted-foreground mt-1">📞 {order.address.phone}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-bold text-foreground mb-3">Payment Summary</h2>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
            {order.couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-600"><span>Coupon ({order.couponCode})</span><span>-{formatCurrency(order.couponDiscount)}</span></div>
            )}
            <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatCurrency(order.tax)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{order.shipping === 0 ? "FREE" : formatCurrency(order.shipping)}</span></div>
            <div className="flex justify-between font-bold text-base border-t border-border pt-1.5">
              <span>Total</span><span className="text-brand-500">{formatCurrency(order.total)}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-sm text-muted-foreground">Payment: <span className="font-semibold text-foreground capitalize">{order.paymentMethod}</span></p>
            <p className="text-sm text-muted-foreground">Status: <span className={cn("font-semibold capitalize", order.paymentStatus === "paid" ? "text-emerald-600" : "text-yellow-600")}>{order.paymentStatus}</span></p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-semibold hover:border-brand-400 transition-colors">
          <Download className="w-4 h-4" /> Download Invoice
        </button>
        {order.status === "delivered" && (
          <button className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-semibold hover:border-brand-400 transition-colors">
            <RotateCcw className="w-4 h-4" /> Return Items
          </button>
        )}
        {["pending", "confirmed"].includes(order.status) && (
          <button className="flex items-center gap-2 px-4 py-2.5 border border-red-300 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <XCircle className="w-4 h-4" /> Cancel Order
          </button>
        )}
        <Link to="/products" className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-semibold hover:bg-brand-600 transition-colors">
          <Package className="w-4 h-4" /> Reorder
        </Link>
      </div>
    </div>
  );
}
