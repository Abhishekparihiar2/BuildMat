import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MATERIAL_CATEGORIES, MATERIAL_CONDITIONS } from "@/lib/constants";

interface SearchFiltersProps {
  onSearch: (filters: {
    query?: string;
    category?: string;
    location?: string;
    condition?: string;
  }) => void;
  initialFilters?: {
    query?: string;
    category?: string;
    location?: string;
    condition?: string;
  };
}

export default function SearchFilters({ onSearch, initialFilters = {} }: SearchFiltersProps) {
  const [query, setQuery] = useState(initialFilters.query || "");
  const [category, setCategory] = useState(initialFilters.category || "all");
  const [location, setLocation] = useState(initialFilters.location || "");
  const [condition, setCondition] = useState(initialFilters.condition || "any");

  const handleSearch = () => {
    onSearch({
      query: query || undefined,
      category: category && category !== "all" ? category : undefined,
      location: location || undefined,
      condition: condition && condition !== "any" ? condition : undefined,
    });
  };

  const handleClear = () => {
    setQuery("");
    setCategory("all");
    setLocation("");
    setCondition("any");
    onSearch({});
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md" data-testid="component-search-filters">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <Input
            type="text"
            placeholder="Search materials..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            data-testid="input-search-query"
          />
        </div>
        
        <div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger data-testid="select-category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" data-testid="option-all-categories">All Categories</SelectItem>
              {MATERIAL_CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id} data-testid={`option-category-${cat.id}`}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            data-testid="input-location"
          />
        </div>
        
        <div>
          <Select value={condition} onValueChange={setCondition}>
            <SelectTrigger data-testid="select-condition">
              <SelectValue placeholder="Any Condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any" data-testid="option-any-condition">Any Condition</SelectItem>
              {MATERIAL_CONDITIONS.map((cond) => (
                <SelectItem key={cond.value} value={cond.value} data-testid={`option-condition-${cond.value}`}>
                  {cond.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={handleSearch}
          className="bg-primary text-primary-foreground hover:opacity-90"
          data-testid="button-search"
        >
          <i className="fas fa-search mr-2"></i>
          Search
        </Button>
        <Button 
          variant="outline" 
          onClick={handleClear}
          data-testid="button-clear"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
