import { TrendingUp, ShoppingBag, Users, Package, DollarSign, Clock, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { generateAnalyticsData, mockProducts, mockOrders } from "@/data/mockData";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/constants";
import { formatCurrency, formatNumber, formatDate, cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const data = generateAnalyticsData();
const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#6366f1"];

interface StatCardProps {
  title: string;
  value: string;
  growth: number;
  icon: React.ElementType;
  color: string;
}

function StatCard({ title, value, growth, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 card-hover">
      <div className="flex items-center justify-between mb-3">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className={cn("text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1", growth >= 0 ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" : "text-red-500 bg-red-50 dark:bg-red-900/20")}>
          <TrendingUp className="w-3 h-3" />
          {growth >= 0 ? "+" : ""}{growth}%
        </span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{title}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const lowStockProducts = mockProducts.filter((p) => p.stock > 0 && p.stock <= 20);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`₹${formatNumber(data.totalRevenue)}`} growth={data.revenueGrowth} icon={DollarSign} color="bg-brand-500" />
        <StatCard title="Total Orders" value={formatNumber(data.totalOrders)} growth={data.ordersGrowth} icon={ShoppingBag} color="bg-blue-500" />
        <StatCard title="Customers" value={formatNumber(data.totalCustomers)} growth={data.customersGrowth} icon={Users} color="bg-emerald-500" />
        <StatCard title="Products" value={String(data.totalProducts)} growth={5.2} icon={Package} color="bg-purple-500" />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-foreground">Revenue Overview</h3>
            <span className="text-xs text-muted-foreground">Last 30 days</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.dailySales}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number) => [formatCurrency(v), "Revenue"]} contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", background: "hsl(var(--popover))", color: "hsl(var(--foreground))" }} />
              <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-bold text-foreground mb-5">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={data.topCategories} dataKey="percentage" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                {data.topCategories.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`, "Share"]} contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", background: "hsl(var(--popover))" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-3">
            {data.topCategories.map((cat, i) => (
              <div key={cat.category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-muted-foreground">{cat.category}</span>
                </div>
                <span className="text-xs font-semibold text-foreground">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs text-brand-500 hover:text-brand-600 font-medium">View All →</Link>
          </div>
          <div className="space-y-3">
            {mockOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <img src={order.items[0].product.images[0]} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-brand-500">{formatCurrency(order.total)}</p>
                  <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded-full", ORDER_STATUS_COLORS[order.status])}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <h3 className="font-bold text-foreground">Low Stock Alert</h3>
            </div>
            <Link to="/admin/products" className="text-xs text-brand-500 hover:text-brand-600 font-medium">Manage →</Link>
          </div>
          <div className="space-y-3">
            {lowStockProducts.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center gap-3">
                <img src={product.images[0]} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" alt={product.name} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-1">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.brand}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className={cn("text-xs font-bold px-2 py-1 rounded-full", product.stock <= 5 ? "bg-red-100 text-red-600 dark:bg-red-900/20" : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20")}>
                    {product.stock} left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
