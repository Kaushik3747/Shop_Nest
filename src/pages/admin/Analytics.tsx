import { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, BarChart2 } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { generateAnalyticsData } from "@/data/mockData";
import { formatCurrency, formatNumber, cn } from "@/lib/utils";

const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#6366f1"];
const DATE_FILTERS = ["Today", "7 Days", "30 Days", "3 Months", "6 Months", "1 Year"];

export default function AdminAnalytics() {
  const [dateFilter, setDateFilter] = useState("30 Days");
  const data = generateAnalyticsData();

  const kpis = [
    { label: "Total Revenue", value: formatCurrency(data.totalRevenue), growth: data.revenueGrowth, icon: DollarSign, up: true, color: "bg-brand-500" },
    { label: "Total Orders", value: formatNumber(data.totalOrders), growth: data.ordersGrowth, icon: ShoppingBag, up: true, color: "bg-blue-500" },
    { label: "Avg Order Value", value: formatCurrency(data.averageOrderValue), growth: 5.1, icon: BarChart2, up: true, color: "bg-purple-500" },
    { label: "New Customers", value: formatNumber(data.totalCustomers), growth: data.customersGrowth, icon: Users, up: true, color: "bg-emerald-500" },
    { label: "Conversion Rate", value: `${data.conversionRate}%`, growth: -0.3, icon: TrendingUp, up: false, color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Date Filter */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold text-foreground">Analytics</h2>
        <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
          {DATE_FILTERS.map((f) => (
            <button key={f} onClick={() => setDateFilter(f)}
              className={cn("px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0",
                dateFilter === f ? "bg-brand-500 text-white" : "border border-border text-muted-foreground hover:border-brand-400")}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpis.map(({ label, value, growth, icon: Icon, up, color }) => (
          <div key={label} className="bg-card border border-border rounded-2xl p-4 card-hover">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-3", color)}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-lg font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
            <div className={cn("flex items-center gap-1 mt-1.5", up && growth > 0 ? "text-emerald-500" : "text-red-500")}>
              {up && growth > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span className="text-xs font-semibold">{growth > 0 ? "+" : ""}{growth}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-bold text-foreground mb-5">Revenue & Orders Over Time</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data.dailySales}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", background: "hsl(var(--popover))", color: "hsl(var(--foreground))" }} />
            <Legend />
            <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#f59e0b" strokeWidth={2} fill="url(#revGrad)" />
            <Area yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#3b82f6" strokeWidth={2} fill="url(#ordGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Charts */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Category Revenue */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-bold text-foreground mb-5">Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.topCategories} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="category" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/100000).toFixed(1)}L`} />
              <Tooltip formatter={(v: number) => [formatCurrency(v), "Revenue"]} contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", background: "hsl(var(--popover))" }} />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Status */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-bold text-foreground mb-5">Orders by Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.ordersByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} innerRadius={45}>
                {data.ordersByStatus.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number, name: string) => [v, name]} contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", background: "hsl(var(--popover))" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {data.ordersByStatus.map((item, i) => (
              <div key={item.status} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="text-xs text-muted-foreground capitalize">{item.status.replace("_", " ")} ({item.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-bold text-foreground mb-4">Top Performing Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Product</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Orders</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Revenue</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.topProducts.map(({ product, orders, revenue }) => (
                <tr key={product.id} className="hover:bg-muted/30">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img src={product.images[0]} className="w-8 h-8 rounded-lg object-cover" alt="" />
                      <div>
                        <p className="text-sm font-medium text-foreground line-clamp-1 max-w-[200px]">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right text-sm font-medium text-foreground">{orders}</td>
                  <td className="py-3 px-3 text-right text-sm font-bold text-brand-500">{formatCurrency(revenue)}</td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-muted rounded-full h-1.5">
                        <div className="bg-brand-500 h-full rounded-full" style={{ width: `${Math.min(100, (revenue / data.totalRevenue) * 100 * 8)}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{((revenue / data.totalRevenue) * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
