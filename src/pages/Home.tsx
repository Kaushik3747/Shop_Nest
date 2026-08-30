import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Shield, RotateCcw, Headphones, ChevronRight, TrendingUp, Star } from "lucide-react";
import { mockProducts, categories } from "@/data/mockData";
import ProductCard from "@/components/features/ProductCard";
import SkeletonCard from "@/components/ui-custom/SkeletonCard";
import heroBanner from "@/assets/hero-banner.jpg";

const testimonials = [
  {
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    text: "ShopNest has completely transformed my online shopping experience. The quality of products and lightning-fast delivery are unmatched!",
    location: "Mumbai",
  },
  {
    name: "Rahul Verma",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    text: "I've been using ShopNest for 2 years and the customer service is exceptional. Returns are hassle-free and refunds are super quick.",
    location: "Delhi",
  },
  {
    name: "Anita Kapoor",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    text: "The curated product selection and genuine reviews make ShopNest my go-to platform for all electronics and fashion purchases.",
    location: "Bengaluru",
  },
];

const features = [
  { icon: Zap, title: "Fast Delivery", desc: "Same day delivery available in select cities" },
  { icon: Shield, title: "Secure Payments", desc: "100% safe & encrypted transactions" },
  { icon: RotateCcw, title: "Easy Returns", desc: "30-day hassle-free return policy" },
  { icon: Headphones, title: "24/7 Support", desc: "Expert help whenever you need it" },
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const featuredProducts = mockProducts.filter((p) => p.isFeatured).slice(0, 8);
  const trendingProducts = mockProducts.filter((p) => p.isTrending).slice(0, 4);
  const newArrivals = mockProducts.filter((p) => p.isNewArrival).slice(0, 4);
  const bestSellers = mockProducts.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="relative h-[420px] md:h-[520px] lg:h-[600px]">
          <img
            src={heroBanner}
            alt="ShopNest Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-900/60 to-transparent" />
          
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 md:px-8">
              <div className="max-w-xl animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-brand-500/20 border border-brand-500/40 rounded-full text-brand-300 text-xs font-semibold tracking-wider uppercase">
                    ✨ New Season, New Deals
                  </span>
                </div>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                  Discover
                  <span className="text-brand-400 block">Premium Products</span>
                  For Everyone
                </h1>
                <p className="text-white/80 text-lg mb-8 leading-relaxed">
                  Millions of products. Unbeatable prices. Delivered to your door.
                </p>

                {/* Search */}
                <form
                  onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery)}`); }}
                  className="flex gap-2 mb-6"
                >
                  <input
                    type="text"
                    placeholder='Try "iPhone 15 Pro" or "Nike shoes"...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/15 backdrop-blur border border-white/30 text-white placeholder:text-white/50 focus:outline-none focus:border-brand-400 focus:bg-white/20 text-sm"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold text-sm transition-colors flex-shrink-0"
                  >
                    Search
                  </button>
                </form>

                <div className="flex flex-wrap gap-2">
                  {["Electronics", "Fashion", "Home", "Beauty", "Sports"].map((tag) => (
                    <Link
                      key={tag}
                      to={`/products?category=${tag.toLowerCase()}`}
                      className="px-3 py-1.5 bg-white/15 hover:bg-white/25 border border-white/20 rounded-full text-white/90 text-xs font-medium transition-all"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-navy-800 dark:bg-navy-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 py-4 px-4 md:px-6">
                <div className="w-10 h-10 bg-brand-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-brand-400" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-white/50">{desc}</p>
                </div>
                <div className="sm:hidden">
                  <p className="text-xs font-semibold text-white">{title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Shop by Category</h2>
            <p className="text-muted-foreground text-sm mt-1">Explore our wide range of product categories</p>
          </div>
          <Link to="/products" className="flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600 font-medium transition-colors">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center gap-2 p-3 bg-card border border-border rounded-2xl hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/10 transition-all card-hover text-center"
            >
              <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <span className="text-xs font-semibold text-foreground">{cat.name}</span>
              <span className="text-xs text-muted-foreground">{cat.productCount}+</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Sale Banner */}
      <section className="container mx-auto px-4 mb-12">
        <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-brand-500 rounded-3xl p-6 md:p-10 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white translate-x-32 -translate-y-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white -translate-x-24 translate-y-24" />
          </div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                <span className="text-yellow-300 font-bold text-sm tracking-wider uppercase">Flash Sale</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Up to 50% Off!</h2>
              <p className="text-white/80 text-sm">Limited time offer on select products. Shop now before it's gone!</p>
            </div>
            <div className="flex items-center gap-4">
              {[
                { label: "Hours", value: "08" },
                { label: "Minutes", value: "47" },
                { label: "Seconds", value: "23" },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{value}</span>
                  </div>
                  <span className="text-xs text-white/70 mt-1">{label}</span>
                </div>
              ))}
            </div>
            <Link
              to="/products?discount=30"
              className="flex items-center gap-2 px-6 py-3 bg-white text-red-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors flex-shrink-0"
            >
              Shop Flash Sale <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-6 container mx-auto px-4 mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Featured Products</h2>
            <p className="text-muted-foreground text-sm mt-1">Handpicked selections just for you</p>
          </div>
          <Link to="/products?featured=true" className="flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600 font-medium">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)
            : featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
          }
        </div>
      </section>

      {/* Trending + New Arrivals side by side */}
      <section className="container mx-auto px-4 mb-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Trending */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-500" />
                <h2 className="text-xl font-bold text-foreground">Trending Now</h2>
              </div>
              <Link to="/products?trending=true" className="text-sm text-brand-500 hover:text-brand-600 font-medium flex items-center gap-1">
                See All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {loading
                ? Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)
                : trendingProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
              }
            </div>
          </div>

          {/* New Arrivals */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">🆕</span>
                <h2 className="text-xl font-bold text-foreground">New Arrivals</h2>
              </div>
              <Link to="/products?new=true" className="text-sm text-brand-500 hover:text-brand-600 font-medium flex items-center gap-1">
                See All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {loading
                ? Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)
                : newArrivals.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
              }
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12 bg-muted/30 dark:bg-navy-950">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-brand-500 fill-brand-500" />
              <h2 className="text-2xl font-bold text-foreground">Best Sellers</h2>
            </div>
            <Link to="/products?bestseller=true" className="flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600 font-medium">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)
              : bestSellers.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
            }
          </div>
        </div>
      </section>

      {/* Promo Banners */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative bg-gradient-to-br from-navy-800 to-navy-900 rounded-3xl overflow-hidden p-8 min-h-[200px] group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop"
              alt="Electronics"
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="relative">
              <span className="text-brand-400 text-xs font-bold uppercase tracking-wider">Electronics</span>
              <h3 className="text-2xl font-bold text-white mt-1 mb-2">Premium Tech<br />Up to 30% Off</h3>
              <Link to="/products?category=electronics" className="flex items-center gap-1 text-brand-400 text-sm font-semibold hover:text-brand-300">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="relative bg-gradient-to-br from-rose-600 to-pink-700 rounded-3xl overflow-hidden p-8 min-h-[200px] group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop"
              alt="Fashion"
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="relative">
              <span className="text-pink-200 text-xs font-bold uppercase tracking-wider">Fashion</span>
              <h3 className="text-2xl font-bold text-white mt-1 mb-2">New Season<br />Styles Arrived</h3>
              <Link to="/products?category=fashion" className="flex items-center gap-1 text-pink-200 text-sm font-semibold hover:text-white">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-muted/20 dark:bg-navy-950/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">What Our Customers Say</h2>
            <p className="text-muted-foreground mt-2">Trusted by millions of happy shoppers across India</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-card border border-border rounded-2xl p-6 card-hover">
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: t.rating }, (_, i) => (
                    <Star key={i} className="w-4 h-4 text-brand-400 fill-brand-400" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
