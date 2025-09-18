import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CategoryGrid from "@/components/materials/category-grid";
import MaterialCard from "@/components/materials/material-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Material } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  // Fetch featured materials (latest 3)
  const { data: materials = [], isLoading } = useQuery<Material[]>({
    queryKey: ["/api/materials"],
  });

  const featuredMaterials = materials.slice(0, 3);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    if (searchLocation) params.set("location", searchLocation);
    setLocation(`/browse?${params.toString()}`);
  };

  const handleBrowseMaterials = () => {
    setLocation("/browse");
  };

  const handleSellMaterials = () => {
    setLocation("/add-listing");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="gradient-bg py-20 lg:py-28" data-testid="section-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg" data-testid="text-hero-title">
              Buy & Sell Construction Materials
            </h1>
            <p className="text-xl md:text-2xl text-white opacity-95 mb-12 max-w-3xl mx-auto drop-shadow-md" data-testid="text-hero-subtitle">
              Connect directly with material owners and seekers. Reduce waste, save money, and build sustainably.
            </p>
            
            {/* Search Bar */}
            <div className="bg-card p-6 rounded-lg shadow-xl max-w-4xl mx-auto mb-12" data-testid="component-hero-search">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search for materials (lumber, concrete, metal...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full"
                    data-testid="input-hero-search"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Enter location"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full"
                    data-testid="input-hero-location"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  className="bg-primary text-primary-foreground hover:opacity-90"
                  data-testid="button-hero-search"
                >
                  <i className="fas fa-search mr-2"></i>Search
                </Button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleBrowseMaterials}
                className="bg-card text-foreground hover:shadow-lg px-8 py-4 text-lg font-semibold"
                size="lg"
                data-testid="button-browse-materials"
              >
                <i className="fas fa-search mr-2"></i>Browse Materials
              </Button>
              <Button
                onClick={handleSellMaterials}
                variant="outline"
                className="bg-white bg-opacity-20 text-white border-2 border-white hover:bg-white hover:text-secondary backdrop-blur-sm px-8 py-4 text-lg font-semibold transition-all duration-300"
                size="lg"
                data-testid="button-sell-materials"
              >
                <i className="fas fa-plus mr-2"></i>Sell Your Materials
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Material Categories */}
      <CategoryGrid />

      {/* Featured Materials */}
      <section className="py-16 bg-background" data-testid="section-featured">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2" data-testid="text-featured-heading">
                Featured Materials
              </h2>
              <p className="text-muted-foreground" data-testid="text-featured-description">
                Recently listed materials from trusted sellers
              </p>
            </div>
            <Button
              variant="link"
              onClick={handleBrowseMaterials}
              className="text-primary hover:underline font-medium"
              data-testid="button-view-all"
            >
              View All <i className="fas fa-arrow-right ml-1"></i>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg shadow-md h-96 animate-pulse" data-testid={`skeleton-${i}`}></div>
              ))}
            </div>
          ) : featuredMaterials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredMaterials.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-box-open text-4xl text-muted-foreground mb-4" data-testid="icon-empty"></i>
              <p className="text-muted-foreground text-lg" data-testid="text-no-materials">
                No materials listed yet. Be the first to list your materials!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-muted" data-testid="section-how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-how-it-works-heading">
              How MaterialMart Works
            </h2>
            <p className="text-muted-foreground text-lg" data-testid="text-how-it-works-description">
              Simple steps to buy and sell construction materials
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* For Material Seekers */}
            <div data-testid="section-seekers">
              <h3 className="text-2xl font-bold text-secondary mb-8 text-center">
                <i className="fas fa-search mr-2"></i>For Material Seekers
              </h3>
              <div className="space-y-8">
                <div className="flex items-start" data-testid="step-search">
                  <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 mt-1">1</div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Search & Browse</h4>
                    <p className="text-muted-foreground">Use our search function or browse categories to find the materials you need.</p>
                  </div>
                </div>
                <div className="flex items-start" data-testid="step-view">
                  <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 mt-1">2</div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">View Details</h4>
                    <p className="text-muted-foreground">Check material condition, quantity, location, and photos to ensure it meets your needs.</p>
                  </div>
                </div>
                <div className="flex items-start" data-testid="step-contact">
                  <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 mt-1">3</div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Contact Seller</h4>
                    <p className="text-muted-foreground">Reach out directly to the material owner to arrange pickup and payment.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Material Owners */}
            <div data-testid="section-owners">
              <h3 className="text-2xl font-bold text-secondary mb-8 text-center">
                <i className="fas fa-plus mr-2"></i>For Material Owners
              </h3>
              <div className="space-y-8">
                <div className="flex items-start" data-testid="step-list">
                  <div className="bg-secondary text-secondary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 mt-1">1</div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">List Your Materials</h4>
                    <p className="text-muted-foreground">Create a detailed listing with photos, description, quantity, and condition.</p>
                  </div>
                </div>
                <div className="flex items-start" data-testid="step-contacted">
                  <div className="bg-secondary text-secondary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 mt-1">2</div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Get Contacted</h4>
                    <p className="text-muted-foreground">Interested buyers will reach out to you directly through the platform.</p>
                  </div>
                </div>
                <div className="flex items-start" data-testid="step-complete">
                  <div className="bg-secondary text-secondary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 mt-1">3</div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Complete Sale</h4>
                    <p className="text-muted-foreground">Arrange pickup, receive payment, and help reduce construction waste!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-background" data-testid="section-cta">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-cta-heading">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground text-lg mb-8" data-testid="text-cta-description">
            Join thousands of contractors, builders, and DIY enthusiasts trading materials sustainably.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleBrowseMaterials}
              className="bg-primary text-primary-foreground hover:opacity-90 px-8 py-4 text-lg font-semibold"
              size="lg"
              data-testid="button-browse-now"
            >
              <i className="fas fa-search mr-2"></i>Browse Materials Now
            </Button>
            <Button
              onClick={handleSellMaterials}
              className="bg-secondary text-secondary-foreground hover:opacity-90 px-8 py-4 text-lg font-semibold"
              size="lg"
              data-testid="button-list-now"
            >
              <i className="fas fa-plus mr-2"></i>List Your Materials
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
