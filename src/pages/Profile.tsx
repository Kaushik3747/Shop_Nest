import { useState } from "react";
import { User, Package, MapPin, Settings, Bell, LogOut, Camera, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useNavigate, Link } from "react-router-dom";
import { mockOrders } from "@/data/mockData";
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, ACCENT_COLORS, CURRENCIES, LANGUAGES } from "@/constants";
import { formatCurrency, formatDate, getInitials, cn } from "@/lib/utils";

type Tab = "profile" | "orders" | "addresses" | "settings";

export default function Profile() {
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [editName, setEditName] = useState(user?.name || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");
  const [saved, setSaved] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold mb-4">Please login to view your profile</h2>
        <Link to="/login" className="px-6 py-3 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600">Login</Link>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "profile", label: "Personal Info", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const saveProfile = () => {
    updateUser({ name: editName, phone: editPhone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-800 to-navy-700 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/10 rounded-full translate-x-24 -translate-y-24" />
        <div className="flex items-center gap-4 relative">
          <div className="relative">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-brand-400" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center text-2xl font-bold">
                {getInitials(user?.name || "")}
              </div>
            )}
            <button className="absolute bottom-0 right-0 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center border-2 border-white">
              <Camera className="w-3 h-3 text-white" />
            </button>
          </div>
          <div>
            <h1 className="text-xl font-bold">{user?.name}</h1>
            <p className="text-white/70 text-sm">{user?.email}</p>
            <span className="text-xs bg-brand-500/30 text-brand-200 px-2 py-0.5 rounded-full mt-1 inline-block capitalize">{user?.role}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-52 flex-shrink-0">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={cn("flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-colors",
                  activeTab === id ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 border-r-2 border-brand-500" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
            <div className="border-t border-border">
              <button onClick={() => { logout(); navigate("/"); }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-bold text-foreground mb-5">Personal Information</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                  <input value={editName} onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input value={user?.email} disabled
                    className="w-full px-3 py-2.5 border border-border rounded-xl text-sm bg-muted/50 text-muted-foreground cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number</label>
                  <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="+91 XXXXX XXXXX"
                    className="w-full px-3 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Member Since</label>
                  <input value={user?.createdAt ? formatDate(user.createdAt) : ""} disabled
                    className="w-full px-3 py-2.5 border border-border rounded-xl text-sm bg-muted/50 text-muted-foreground cursor-not-allowed" />
                </div>
              </div>
              <button onClick={saveProfile}
                className="flex items-center gap-2 px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-semibold transition-colors">
                {saved ? <><Check className="w-4 h-4" /> Saved!</> : "Save Changes"}
              </button>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-3">
              <h2 className="font-bold text-foreground">Recent Orders</h2>
              {mockOrders.slice(0, 5).map((order) => (
                <Link key={order.id} to={`/orders/${order.id}`}
                  className="flex items-center gap-3 bg-card border border-border rounded-2xl p-4 hover:border-brand-300 transition-colors">
                  <img src={order.items[0].product.images[0]} className="w-12 h-12 rounded-xl object-cover" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)} • {order.items.length} item(s)</p>
                  </div>
                  <div className="text-right">
                    <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", ORDER_STATUS_COLORS[order.status])}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                    <p className="text-sm font-bold text-brand-500 mt-1">{formatCurrency(order.total)}</p>
                  </div>
                </Link>
              ))}
              <Link to="/orders" className="block text-center text-sm text-brand-500 hover:text-brand-600 font-medium py-2">View All Orders →</Link>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-foreground">Saved Addresses</h2>
                <button className="text-sm text-brand-500 font-medium">+ Add New</button>
              </div>
              {user?.addresses.map((addr) => (
                <div key={addr.id} className={cn("bg-card border-2 rounded-2xl p-4", addr.isDefault ? "border-brand-500" : "border-border")}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full capitalize">{addr.type}</span>
                      {addr.isDefault && <span className="text-xs bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 px-2 py-0.5 rounded-full">Default</span>}
                    </div>
                    <div className="flex gap-2">
                      <button className="text-xs text-brand-500 font-medium hover:text-brand-600">Edit</button>
                      <button className="text-xs text-red-500 font-medium hover:text-red-600">Delete</button>
                    </div>
                  </div>
                  <p className="font-semibold text-foreground text-sm">{addr.name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{addr.line1}{addr.line2 && `, ${addr.line2}`}</p>
                  <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} — {addr.pincode}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">📞 {addr.phone}</p>
                </div>
              ))}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-5">
              {/* Theme */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-bold text-foreground mb-4">Theme</h3>
                <div className="grid grid-cols-3 gap-3">
                  {(["light", "dark", "system"] as const).map((t) => (
                    <button key={t} onClick={() => setTheme(t)}
                      className={cn("py-3 rounded-xl border-2 text-sm font-medium capitalize transition-all", theme === t ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400" : "border-border text-muted-foreground hover:border-brand-300")}>
                      {t === "light" ? "☀️ Light" : t === "dark" ? "🌙 Dark" : "💻 System"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-bold text-foreground mb-4">Accent Color</h3>
                <div className="flex gap-3 flex-wrap">
                  {ACCENT_COLORS.map((color) => (
                    <button key={color.value} title={color.name}
                      className="w-9 h-9 rounded-full border-2 border-white dark:border-card shadow-md hover:scale-110 transition-transform"
                      style={{ backgroundColor: color.value }}>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Bell className="w-4 h-4" />Notifications</h3>
                <div className="space-y-3">
                  {[
                    { key: "orders", label: "Order Updates", desc: "Get notified about order status changes" },
                    { key: "promotions", label: "Promotions", desc: "Deals, coupons and offers" },
                    { key: "priceDrops", label: "Price Drops", desc: "When wishlist items go on sale" },
                    { key: "backInStock", label: "Back in Stock", desc: "Products back in stock" },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm font-medium text-foreground">{label}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                      <button
                        onClick={() => updateUser({ preferences: { ...user!.preferences, notifications: { ...user!.preferences.notifications, [key]: !user!.preferences.notifications[key as keyof typeof user.preferences.notifications] } } })}
                        className={cn("w-10 h-6 rounded-full relative transition-colors", user?.preferences.notifications[key as keyof typeof user.preferences.notifications] ? "bg-brand-500" : "bg-muted")}>
                        <div className={cn("w-4 h-4 bg-white rounded-full absolute top-1 transition-transform", user?.preferences.notifications[key as keyof typeof user.preferences.notifications] ? "translate-x-5" : "translate-x-1")} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Currency & Language */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-bold text-foreground mb-4">Preferences</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Currency</label>
                    <select className="w-full px-3 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-brand-500">
                      {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.symbol} {c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Language</label>
                    <select className="w-full px-3 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-brand-500">
                      {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
