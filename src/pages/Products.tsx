import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Grid3X3, List, SlidersHorizontal, ChevronDown } from "lucide-react";
import type { FilterState } from "@/types";
import { mockProducts } from "@/data/mockData";
import ProductCard from "@/components/features/ProductCard";
import FilterSidebar from "@/components/features/FilterSidebar";
import SkeletonCard, { SkeletonList } from "@/components/ui-custom/SkeletonCard";
import { SORT_OPTIONS, ITEMS_PER_PAGE } from "@/constants";
import { cn } from "@/lib/utils";

const defaultFilters: FilterState = {
  categories: [],
  brands: [],
  priceRange: [0, 200000],
  rating: 0,
  discount: 0,
  availability: "all",
  colors: [],
  sizes: [],
  sortBy: "recommended",
};

export default function Products() {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<FilterState>(() => {
    const cat = searchParams.get("category");
    return {
      ...defaultFilters,
      categories: cat ? [cat] : [],
    };
  });
  const [page, setPage] = useState(1);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const updateFilters = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  const activeFilterCount = [
    filters.categories.length > 0,
    filters.brands.length > 0,
    filters.priceRange[1] < 200000,
    filters.rating > 0,
    filters.discount > 0,
    filters.availability !== "all",
    filters.colors.length > 0,
  ].filter(Boolean).length;

  const filteredProducts = useMemo(() => {
    let products = [...mockProducts];

    if (filters.categories.length > 0) {
      products = products.filter((p) =>
        filters.categories.some((c) => p.category.toLowerCase().includes(c.toLowerCase()) || c.includes(p.category.toLowerCase()))
      );
    }
    if (filters.brands.length > 0) {
      products = products.filter((p) => filters.brands.includes(p.brand));
    }
    if (filters.priceRange[1] < 200000) {
      products = products.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);
    }
    if (filters.rating > 0) {
      products = products.filter((p) => p.rating >= filters.rating);
    }
    if (filters.discount > 0) {
      products = products.filter((p) => p.discount >= filters.discount);
    }
    if (filters.availability === "in_stock") {
      products = products.filter((p) => p.stock > 0);
    }

    switch (filters.sortBy) {
      case "newest": products.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
      case "price_asc": products.sort((a, b) => a.price - b.price); break;
      case "price_desc": products.sort((a, b) => b.price - a.price); break;
      case "rating_desc": products.sort((a, b) => b.rating - a.rating); break;
      case "discount_desc": products.sort((a, b) => b.discount - a.discount); break;
      case "reviews_desc": products.sort((a, b) => b.reviewCount - a.reviewCount); break;
      case "best_selling": products.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0)); break;
    }
    return products;
  }, [filters]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-brand-500">Home</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Products</span>
        {filters.categories.length === 1 && (
          <>
            <span>/</span>
            <span className="text-foreground font-medium capitalize">{filters.categories[0]}</span>
          </>
        )}
      </div>

      <div className="flex gap-6">
        {/* Sidebar — desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <FilterSidebar
              filters={filters}
              onChange={updateFilters}
              onClear={clearFilters}
              activeCount={activeFilterCount}
            />
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        <FilterSidebar
          filters={filters}
          onChange={updateFilters}
          onClear={clearFilters}
          activeCount={activeFilterCount}
          isOpen={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-medium hover:border-brand-400 transition-colors"
                onClick={() => setFilterDrawerOpen(true)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredProducts.length}</span> products found
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilters({ sortBy: e.target.value })}
                  className="appearance-none pl-3 pr-8 py-2 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="flex border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setView("grid")}
                  className={cn("p-2 transition-colors", view === "grid" ? "bg-brand-500 text-white" : "text-muted-foreground hover:bg-muted")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={cn("p-2 transition-colors", view === "list" ? "bg-brand-500 text-white" : "text-muted-foreground hover:bg-muted")}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Products */}
          {loading ? (
            <div className={cn(view === "grid" ? "grid grid-cols-2 sm:grid-cols-3 gap-4" : "space-y-3")}>
              {Array.from({ length: 6 }, (_, i) =>
                view === "grid" ? <SkeletonCard key={i} /> : <SkeletonList key={i} />
              )}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-2xl border border-border">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground text-sm mb-4">Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className="px-4 py-2 bg-brand-500 text-white rounded-xl text-sm font-semibold hover:bg-brand-600">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={cn(
              view === "grid"
                ? "grid grid-cols-2 sm:grid-cols-3 gap-4"
                : "space-y-3"
            )}>
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} view={view} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-border rounded-xl text-sm font-medium disabled:opacity-40 hover:border-brand-400 transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={cn(
                      "w-9 h-9 rounded-xl text-sm font-semibold transition-colors",
                      page === pageNum ? "bg-brand-500 text-white" : "border border-border hover:border-brand-400"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-border rounded-xl text-sm font-medium disabled:opacity-40 hover:border-brand-400 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
