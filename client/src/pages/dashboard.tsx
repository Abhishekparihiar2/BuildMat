import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Material } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentUser] = useState({ id: "temp-user-id", name: "John Doe" }); // TODO: Replace with actual auth

  const { data: userMaterials = [], isLoading } = useQuery<Material[]>({
    queryKey: ["/api/users", currentUser?.id, "materials"],
    enabled: !!currentUser?.id,
  });

  const deleteMaterialMutation = useMutation({
    mutationFn: async (materialId: string) => {
      return await apiRequest("DELETE", `/api/materials/${materialId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", currentUser?.id, "materials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/materials"] });
      toast({
        title: "Success!",
        description: "Material listing has been deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete listing",
        variant: "destructive",
      });
    },
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: async ({ materialId, isAvailable }: { materialId: string; isAvailable: boolean }) => {
      return await apiRequest("PUT", `/api/materials/${materialId}`, { isAvailable });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", currentUser?.id, "materials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/materials"] });
      toast({
        title: "Success!",
        description: "Material availability updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update availability",
        variant: "destructive",
      });
    },
  });

  const handleDeleteMaterial = (materialId: string) => {
    if (window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      deleteMaterialMutation.mutate(materialId);
    }
  };

  const handleToggleAvailability = (materialId: string, currentAvailability: boolean) => {
    toggleAvailabilityMutation.mutate({
      materialId,
      isAvailable: !currentAvailability,
    });
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

  if (!currentUser) {
    setLocation("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="main-dashboard">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-page-title">
              Dashboard
            </h1>
            <p className="text-muted-foreground" data-testid="text-welcome">
              Welcome back, {currentUser.name}! Manage your material listings here.
            </p>
          </div>
          <Button
            onClick={() => setLocation("/add-listing")}
            className="bg-primary text-primary-foreground hover:opacity-90"
            data-testid="button-add-listing"
          >
            <i className="fas fa-plus mr-2"></i>
            Add New Listing
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card data-testid="card-total-listings">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground" data-testid="text-total-count">
                {userMaterials.length}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-active-listings">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600" data-testid="text-active-count">
                {userMaterials.filter(m => m.isAvailable).length}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-inactive-listings">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Sold/Unavailable</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-muted-foreground" data-testid="text-inactive-count">
                {userMaterials.filter(m => !m.isAvailable).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Materials List */}
        <Card>
          <CardHeader>
            <CardTitle data-testid="text-listings-title">Your Material Listings</CardTitle>
            <CardDescription data-testid="text-listings-description">
              Manage your posted materials, update availability, and track views
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-muted rounded animate-pulse" data-testid={`skeleton-${i}`}></div>
                ))}
              </div>
            ) : userMaterials.length > 0 ? (
              <div className="space-y-4">
                {userMaterials.map((material) => (
                  <div 
                    key={material.id} 
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    data-testid={`listing-${material.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {material.images && material.images.length > 0 ? (
                            <img
                              src={material.images[0]}
                              alt={material.title}
                              className="w-16 h-16 object-cover rounded"
                              data-testid={`img-${material.id}`}
                            />
                          ) : (
                            <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                              <i className="fas fa-image text-muted-foreground" data-testid={`placeholder-${material.id}`}></i>
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-foreground" data-testid={`title-${material.id}`}>
                                {material.title}
                              </h3>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  className={getConditionColor(material.condition)}
                                  data-testid={`condition-${material.id}`}
                                >
                                  {material.condition}
                                </Badge>
                                <Badge 
                                  variant={material.isAvailable ? "default" : "secondary"}
                                  data-testid={`availability-${material.id}`}
                                >
                                  {material.isAvailable ? "Available" : "Sold/Unavailable"}
                                </Badge>
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground text-sm mb-2 line-clamp-2" data-testid={`description-${material.id}`}>
                              {material.description}
                            </p>
                            
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <span data-testid={`quantity-${material.id}`}>
                                <i className="fas fa-cubes mr-1"></i>
                                {material.quantity} {material.unit}
                              </span>
                              {material.price && (
                                <span data-testid={`price-${material.id}`}>
                                  <i className="fas fa-dollar-sign mr-1"></i>
                                  ${material.price}/{material.unit}
                                </span>
                              )}
                              <span data-testid={`location-${material.id}`}>
                                <i className="fas fa-map-marker-alt mr-1"></i>
                                {material.location}
                              </span>
                              <span data-testid={`time-${material.id}`}>
                                <i className="fas fa-clock mr-1"></i>
                                {material.createdAt ? timeAgo(new Date(material.createdAt)) : "Recently"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setLocation(`/materials/${material.id}`)}
                          data-testid={`button-view-${material.id}`}
                        >
                          <i className="fas fa-eye mr-1"></i>
                          View
                        </Button>
                        
                        <Button
                          size="sm"
                          variant={material.isAvailable ? "secondary" : "default"}
                          onClick={() => handleToggleAvailability(material.id, material.isAvailable!)}
                          disabled={toggleAvailabilityMutation.isPending}
                          data-testid={`button-toggle-${material.id}`}
                        >
                          {material.isAvailable ? (
                            <>
                              <i className="fas fa-eye-slash mr-1"></i>
                              Mark Sold
                            </>
                          ) : (
                            <>
                              <i className="fas fa-eye mr-1"></i>
                              Mark Available
                            </>
                          )}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteMaterial(material.id)}
                          disabled={deleteMaterialMutation.isPending}
                          data-testid={`button-delete-${material.id}`}
                        >
                          <i className="fas fa-trash mr-1"></i>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="fas fa-plus-circle text-4xl text-muted-foreground mb-4" data-testid="icon-empty"></i>
                <h3 className="text-lg font-semibold text-foreground mb-2" data-testid="text-empty-title">
                  No materials listed yet
                </h3>
                <p className="text-muted-foreground mb-6" data-testid="text-empty-description">
                  Start by adding your first material listing to connect with potential buyers.
                </p>
                <Button
                  onClick={() => setLocation("/add-listing")}
                  className="bg-primary text-primary-foreground hover:opacity-90"
                  data-testid="button-add-first"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Add Your First Listing
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
