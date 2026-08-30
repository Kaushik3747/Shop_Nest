import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DEMO_ADMIN, DEMO_USER } from "@/constants";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate("/");
  };

  const fillDemo = (type: "user" | "admin") => {
    const creds = type === "admin" ? DEMO_ADMIN : DEMO_USER;
    setEmail(creds.email);
    setPassword(creds.password);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-navy-900 to-navy-700 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-brand-500" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-brand-400" />
        </div>
        <div className="relative text-center text-white">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="flex items-center">
              <span className="font-display text-3xl font-bold">Shop</span>
              <span className="font-display text-3xl font-bold text-brand-400">Nest</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Welcome back!</h2>
          <p className="text-white/70 text-lg max-w-sm mx-auto leading-relaxed">
            Sign in to access your orders, wishlist, and personalized recommendations.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-xs mx-auto">
            {["🛍️", "📦", "❤️"].map((e, i) => (
              <div key={i} className="aspect-square bg-white/10 rounded-2xl flex items-center justify-center text-3xl">
                {e}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-2xl font-bold text-foreground">Shop<span className="text-brand-500">Nest</span></span>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-1">Sign In</h1>
          <p className="text-muted-foreground text-sm mb-6">Enter your credentials to continue</p>

          {/* Demo Credentials */}
          <div className="flex gap-2 mb-6">
            <button onClick={() => fillDemo("user")}
              className="flex-1 py-2 text-xs bg-muted hover:bg-muted/80 border border-border rounded-xl font-medium transition-colors text-foreground">
              👤 Try as User
            </button>
            <button onClick={() => fillDemo("admin")}
              className="flex-1 py-2 text-xs bg-brand-50 dark:bg-brand-900/20 hover:bg-brand-100 dark:hover:bg-brand-900/30 border border-brand-200 dark:border-brand-800 rounded-xl font-medium transition-colors text-brand-700 dark:text-brand-400">
              🔑 Try as Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-foreground">Password</label>
                <button type="button" className="text-xs text-brand-500 hover:text-brand-600 font-medium">Forgot password?</button>
              </div>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-brand-500/30 disabled:opacity-70">
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-brand-500 hover:text-brand-600 font-semibold">Create Account</Link>
          </p>

          <div className="mt-4 p-3 bg-muted/50 rounded-xl text-xs text-muted-foreground space-y-1">
            <p><span className="font-medium">User:</span> {DEMO_USER.email} / {DEMO_USER.password}</p>
            <p><span className="font-medium">Admin:</span> {DEMO_ADMIN.email} / {DEMO_ADMIN.password}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
