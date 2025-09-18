import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SearchFilters from "@/components/materials/search-filters";
import MaterialCard from "@/components/materials/material-card";
import { Material } from "@shared/schema";

export default function BrowseMaterials() {
  const [location] = useLocation();
  const [filters, setFilters] = useState<{
    query?: string;
    category?: string;
    location?: string;
    condition?: string;
  }>({});

  // Parse URL parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialFilters = {
      query: urlParams.get("query") || undefined,
      category: urlParams.get("category") || undefined,
      location: urlParams.get("location") || undefined,
      condition: urlParams.get("condition") || undefined,
    };
    setFilters(initialFilters);
  }, [location]);

  const { data: materials = [], isLoading } = useQuery<Material[]>({
    queryKey: ["/api/materials", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      
      const response = await fetch(`/api/materials?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch materials");
      return response.json();
    },
  });

  const handleSearch = (newFilters: typeof filters) => {
    setFilters(newFilters);
    
    // Update URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    
    const newUrl = `/browse${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.pushState({}, "", newUrl);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="main-browse">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-page-title">
            Browse Construction Materials
          </h1>
          <p className="text-muted-foreground" data-testid="text-page-description">
            Find the materials you need from local suppliers and contractors
          </p>
        </div>

        <div className="mb-8">
          <SearchFilters 
            onSearch={handleSearch}
            initialFilters={filters}
          />
        </div>

        <div className="mb-6">
          <p className="text-muted-foreground" data-testid="text-results-count">
            {isLoading ? "Loading..." : `${materials.length} materials found`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-lg shadow-md h-96 animate-pulse" data-testid={`skeleton-${i}`}></div>
            ))}
          </div>
        ) : materials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <i className="fas fa-search text-4xl text-muted-foreground mb-4" data-testid="icon-no-results"></i>
            <h3 className="text-xl font-semibold text-foreground mb-2" data-testid="text-no-results-title">
              No materials found
            </h3>
            <p className="text-muted-foreground mb-6" data-testid="text-no-results-description">
              Try adjusting your search filters or check back later for new listings.
            </p>
            <button 
              onClick={() => handleSearch({})}
              className="text-primary hover:underline font-medium"
              data-testid="button-clear-filters"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
