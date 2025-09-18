import { MATERIAL_CATEGORIES } from "@/lib/constants";
import { useLocation } from "wouter";

interface CategoryGridProps {
  onCategorySelect?: (category: string) => void;
}

export default function CategoryGrid({ onCategorySelect }: CategoryGridProps) {
  const [, setLocation] = useLocation();

  const handleCategoryClick = (categoryId: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    } else {
      setLocation(`/browse?category=${categoryId}`);
    }
  };

  return (
    <section id="categories" className="py-16 bg-muted" data-testid="section-categories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-categories-heading">
            Material Categories
          </h2>
          <p className="text-muted-foreground text-lg" data-testid="text-categories-description">
            Find exactly what you need from our organized categories
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {MATERIAL_CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="category-card bg-card p-6 rounded-lg shadow-sm hover:shadow-md cursor-pointer text-center"
              onClick={() => handleCategoryClick(category.id)}
              data-testid={`card-category-${category.id}`}
            >
              <div className="text-3xl text-primary mb-3">
                <i className={category.icon} data-testid={`icon-${category.id}`}></i>
              </div>
              <h3 className="font-semibold text-foreground" data-testid={`text-category-${category.id}`}>
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1" data-testid={`text-count-${category.id}`}>
                {category.count} items
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
