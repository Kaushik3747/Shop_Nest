import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, X, TrendingUp, Clock } from "lucide-react";
import { mockProducts } from "@/data/mockData";
import ProductCard from "@/components/features/ProductCard";
import SkeletonCard from "@/components/ui-custom/SkeletonCard";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { debounce } from "@/lib/utils";

const POPULAR_SEARCHES = ["iPhone 15", "Nike shoes", "Sony headphones", "MacBook", "Samsung TV", "Yoga mat"];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(query);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>("shopnest_searches", []);

  useEffect(() => {
    if (query) {
      setLoading(true);
      const t = setTimeout(() => setLoading(false), 400);
      setRecentSearches((prev) => [query, ...prev.filter((s) => s !== query)].slice(0, 8));
      return () => clearTimeout(t);
    }
  }, [query]);

  const results = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return mockProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  const debouncedSearch = debounce((val: string) => {
    if (val.trim()) {
      setSearchParams({ q: val.trim() });
    }
  }, 400);

  const handleInput = (val: string) => {
    setInputValue(val);
    debouncedSearch(val);
  };

  const doSearch = (q: string) => {
    setInputValue(q);
    setSearchParams({ q });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Box */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Search products, brands, categories..."
            className="w-full pl-12 pr-10 py-4 text-base border border-border rounded-2xl bg-card focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 shadow-sm transition-all"
            autoFocus
          />
          {inputValue && (
            <button onClick={() => { setInputValue(""); setSearchParams({}); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* No query state */}
      {!query && (
        <div className="max-w-2xl mx-auto">
          {recentSearches.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2"><Clock className="w-4 h-4" />Recent Searches</h3>
                <button onClick={() => setRecentSearches([])} className="text-xs text-muted-foreground hover:text-brand-500">Clear</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((s) => (
                  <button key={s} onClick={() => doSearch(s)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/70 rounded-xl text-sm text-foreground transition-colors">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-brand-500" />Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((s) => (
                <button key={s} onClick={() => doSearch(s)}
                  className="px-3 py-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-800 rounded-xl text-sm font-medium hover:bg-brand-100 dark:hover:bg-brand-900/30 transition-colors">
                  🔥 {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {query && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-muted-foreground text-sm">
              {loading ? "Searching..." : (
                <><span className="font-bold text-foreground">{results.length}</span> results for "<span className="font-semibold text-brand-500">{query}</span>"</>
              )}
            </p>
            <Link to={`/products?q=${encodeURIComponent(query)}`} className="text-sm text-brand-500 hover:text-brand-600 font-medium">
              Advanced Filters →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20 max-w-sm mx-auto">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-foreground mb-2">No results found</h3>
              <p className="text-muted-foreground text-sm mb-6">We couldn't find anything for "{query}". Try different keywords.</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {POPULAR_SEARCHES.slice(0, 4).map((s) => (
                  <button key={s} onClick={() => doSearch(s)}
                    className="px-3 py-1.5 bg-muted rounded-xl text-sm text-foreground hover:bg-muted/70">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
