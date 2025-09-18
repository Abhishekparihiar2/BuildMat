import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Material, User } from "@shared/schema";

export default function MaterialDetail() {
  const [match, params] = useRoute("/materials/:id");
  const materialId = params?.id;

  const { data: materialData, isLoading, error } = useQuery<Material & { seller: User }>({
    queryKey: ["/api/materials", materialId],
    queryFn: async () => {
      const response = await fetch(`/api/materials/${materialId}`);
      if (!response.ok) throw new Error("Material not found");
      return response.json();
    },
    enabled: !!materialId,
  });

  if (!match || !materialId) {
    return <div>Material not found</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-muted rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !materialData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-destructive mb-4" data-testid="icon-error"></i>
          <h1 className="text-2xl font-bold text-foreground mb-2" data-testid="text-error-title">
            Material Not Found
          </h1>
          <p className="text-muted-foreground" data-testid="text-error-description">
            The material you're looking for doesn't exist or has been removed.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const material = materialData;

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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="main-material-detail">
        {/* Image Gallery */}
        <div className="mb-8">
          {material.images && material.images.length > 0 ? (
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <img
                src={material.images[0]}
                alt={material.title}
                className="w-full h-full object-cover"
                data-testid="img-material"
              />
            </div>
          ) : (
            <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
              <i className="fas fa-image text-6xl text-muted-foreground" data-testid="placeholder-image"></i>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Material Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-material-title">
                    {material.title}
                  </h1>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className={getConditionColor(material.condition)} data-testid="badge-condition">
                      {material.condition}
                    </Badge>
                    <span className="text-sm text-muted-foreground" data-testid="text-category">
                      Category: {material.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  {material.price ? (
                    <div>
                      <span className="text-3xl font-bold text-foreground" data-testid="text-price">
                        ${material.price}
                      </span>
                      <span className="text-muted-foreground text-lg" data-testid="text-unit">
                        /{material.unit}
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-green-600" data-testid="text-free">
                      Free
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-1" data-testid="text-quantity-label">Quantity</h3>
                  <p className="text-muted-foreground" data-testid="text-quantity">{material.quantity}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1" data-testid="text-location-label">Location</h3>
                  <p className="text-muted-foreground" data-testid="text-location">
                    <i className="fas fa-map-marker-alt mr-1"></i>
                    {material.location}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="pt-6">
                <h3 className="font-semibold text-foreground mb-3" data-testid="text-description-label">Description</h3>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-description">
                  {material.description}
                </p>
              </div>
            </div>
          </div>

          {/* Seller Contact Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24" data-testid="card-seller">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" data-testid="text-seller-title">
                  <i className="fas fa-user"></i>
                  Seller Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground" data-testid="text-seller-name">
                    {material.seller?.name || "Anonymous Seller"}
                  </h4>
                  <p className="text-sm text-muted-foreground" data-testid="text-posted-time">
                    Posted {material.createdAt ? timeAgo(new Date(material.createdAt)) : "recently"}
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h5 className="font-medium text-foreground" data-testid="text-contact-heading">Contact Seller</h5>
                  
                  {material.contactPreference === "email" || material.contactPreference === "both" ? (
                    <Button 
                      className="w-full"
                      onClick={() => window.location.href = `mailto:${material.seller?.email}`}
                      data-testid="button-email"
                    >
                      <i className="fas fa-envelope mr-2"></i>
                      Send Email
                    </Button>
                  ) : null}

                  {material.contactPreference === "phone" || material.contactPreference === "both" ? (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.location.href = `tel:${material.seller?.phone}`}
                      data-testid="button-phone"
                    >
                      <i className="fas fa-phone mr-2"></i>
                      Call Seller
                    </Button>
                  ) : null}

                  <div className="text-center">
                    <p className="text-xs text-muted-foreground" data-testid="text-contact-note">
                      Contact the seller directly to discuss pickup, payment, and availability.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="text-center">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="text-xs"
                    data-testid="button-report"
                  >
                    <i className="fas fa-flag mr-1"></i>
                    Report Listing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
