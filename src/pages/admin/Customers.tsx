import { useState } from "react";
import { Search, UserCheck, UserX, Eye } from "lucide-react";
import { mockDemoUser, mockAdminUser } from "@/data/mockData";
import { formatDate, getInitials, cn } from "@/lib/utils";
import { toast } from "sonner";

const demoCustomers = [
  { ...mockDemoUser, ordersCount: 12, totalSpent: 245000 },
  { ...mockAdminUser, ordersCount: 0, totalSpent: 0 },
  { id: "u3", name: "Priya Sharma", email: "priya@example.com", role: "customer" as const, phone: "+91 98123 45678", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", addresses: [], preferences: mockDemoUser.preferences, createdAt: "2023-08-15T00:00:00Z", isActive: true, ordersCount: 5, totalSpent: 67000 },
  { id: "u4", name: "Rahul Verma", email: "rahul@example.com", role: "customer" as const, phone: "+91 97654 32100", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", addresses: [], preferences: mockDemoUser.preferences, createdAt: "2023-11-20T00:00:00Z", isActive: true, ordersCount: 3, totalSpent: 34500 },
  { id: "u5", name: "Anita Kapoor", email: "anita@example.com", role: "customer" as const, phone: "+91 99887 76655", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", addresses: [], preferences: mockDemoUser.preferences, createdAt: "2024-01-05T00:00:00Z", isActive: false, ordersCount: 1, totalSpent: 12000 },
];

export default function AdminCustomers() {
  const [customers, setCustomers] = useState(demoCustomers);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof demoCustomers[0] | null>(null);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleActive = (id: string) => {
    setCustomers((prev) => prev.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c));
    toast.success("Customer status updated");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Customer Management</h2>
          <p className="text-sm text-muted-foreground">{customers.length} registered customers</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Customers", value: customers.length, color: "text-brand-500" },
          { label: "Active", value: customers.filter(c => c.isActive).length, color: "text-emerald-500" },
          { label: "Inactive", value: customers.filter(c => !c.isActive).length, color: "text-red-500" },
          { label: "Admins", value: customers.filter(c => c.role === "admin").length, color: "text-purple-500" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-3 text-center">
            <p className={cn("text-xl font-bold", color)}>{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-xl bg-card focus:outline-none focus:border-brand-500" />
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Role</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Orders</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Joined</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {customer.avatar ? (
                        <img src={customer.avatar} alt={customer.name} className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-bold">
                          {getInitials(customer.name)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-foreground">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn("text-xs font-semibold px-2 py-1 rounded-full capitalize",
                      customer.role === "admin" ? "bg-purple-100 text-purple-600 dark:bg-purple-900/20" : "bg-muted text-muted-foreground")}>
                      {customer.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm font-medium text-foreground">{customer.ordersCount}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-muted-foreground">{formatDate(customer.createdAt)}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn("text-xs font-semibold px-2 py-1 rounded-full",
                      customer.isActive ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20" : "bg-red-100 text-red-600 dark:bg-red-900/20")}>
                      {customer.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => setSelected(customer)} className="p-1.5 text-muted-foreground hover:text-brand-500 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => toggleActive(customer.id)}
                        className={cn("p-1.5 rounded-lg transition-colors", customer.isActive ? "text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" : "text-muted-foreground hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20")}>
                        {customer.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
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
