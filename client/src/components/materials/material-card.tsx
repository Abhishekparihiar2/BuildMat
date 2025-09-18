import { Material, User } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

interface MaterialCardProps {
  material: Material & { seller?: User };
}

export default function MaterialCard({ material }: MaterialCardProps) {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    setLocation(`/materials/${material.id}`);
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "new":
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "fair":
        return "bg-yellow-100 text-yellow-800";
      case "surplus":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const timeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  return (
    <Card 
      className="material-card overflow-hidden cursor-pointer"
      onClick={handleClick}
      data-testid={`card-material-${material.id}`}
    >
      {material.images && material.images.length > 0 ? (
        <img
          src={material.images[0]}
          alt={material.title}
          className="w-full h-48 object-cover"
          data-testid={`img-material-${material.id}`}
        />
      ) : (
        <div className="w-full h-48 bg-muted flex items-center justify-center">
          <i className="fas fa-image text-4xl text-muted-foreground" data-testid={`placeholder-${material.id}`}></i>
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-foreground line-clamp-1" data-testid={`text-title-${material.id}`}>
            {material.title}
          </h3>
          <Badge 
            className={getConditionColor(material.condition)}
            data-testid={`badge-condition-${material.id}`}
          >
            {material.condition}
          </Badge>
        </div>
        
        <p className="text-muted-foreground mb-3 line-clamp-2" data-testid={`text-description-${material.id}`}>
          {material.description}
        </p>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            {material.price ? (
              <>
                <span className="text-2xl font-bold text-foreground" data-testid={`text-price-${material.id}`}>
                  ${material.price}
                </span>
                <span className="text-muted-foreground" data-testid={`text-unit-${material.id}`}>
                  /{material.unit}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-green-600" data-testid={`text-free-${material.id}`}>
                Free
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground" data-testid={`text-quantity-${material.id}`}>
            {material.quantity} available
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-muted-foreground">
            <i className="fas fa-map-marker-alt mr-1"></i>
            <span data-testid={`text-location-${material.id}`}>{material.location}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <i className="fas fa-clock mr-1"></i>
            <span data-testid={`text-time-${material.id}`}>
              {material.createdAt ? timeAgo(new Date(material.createdAt)) : "Recently"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
