import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertMaterialSchema, InsertMaterial } from "@shared/schema";
import { MATERIAL_CATEGORIES, MATERIAL_CONDITIONS, CONTACT_PREFERENCES } from "@/lib/constants";

export default function AddListing() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentUser] = useState({ id: "temp-user-id" }); // TODO: Replace with actual auth

  const form = useForm<InsertMaterial>({
    resolver: zodResolver(insertMaterialSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      condition: "",
      quantity: "",
      unit: "",
      price: "",
      location: "",
      contactPreference: "",
      images: [],
    },
  });

  const createMaterialMutation = useMutation({
    mutationFn: async (data: InsertMaterial & { sellerId: string }) => {
      return await apiRequest("POST", "/api/materials", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/materials"] });
      toast({
        title: "Success!",
        description: "Your material listing has been created successfully.",
      });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create listing",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertMaterial) => {
    if (!currentUser?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a listing.",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    createMaterialMutation.mutate({
      ...data,
      sellerId: currentUser.id,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="main-add-listing">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl" data-testid="text-page-title">List Your Construction Material</CardTitle>
            <CardDescription data-testid="text-page-description">
              Create a detailed listing to connect with potential buyers. Provide accurate information to ensure successful transactions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-add-listing">
                {/* Material Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground" data-testid="text-section-material">Material Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-title">Material Title *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Premium Oak Lumber, Steel I-Beams, Concrete Blocks"
                            {...field}
                            data-testid="input-title"
                          />
                        </FormControl>
                        <FormDescription>
                          Use a clear, descriptive title that buyers will easily understand
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel data-testid="label-category">Category *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {MATERIAL_CATEGORIES.map((category) => (
                                <SelectItem key={category.id} value={category.id} data-testid={`option-category-${category.id}`}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel data-testid="label-condition">Condition *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-condition">
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {MATERIAL_CONDITIONS.map((condition) => (
                                <SelectItem key={condition.value} value={condition.value} data-testid={`option-condition-${condition.value}`}>
                                  {condition.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-description">Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the material in detail. Include specifications, dimensions, quality, intended use, etc."
                            className="min-h-24"
                            {...field}
                            data-testid="textarea-description"
                          />
                        </FormControl>
                        <FormDescription>
                          Provide detailed information to help buyers make informed decisions
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Quantity and Pricing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground" data-testid="text-section-quantity">Quantity & Pricing</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel data-testid="label-quantity">Quantity Available *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., 500, 200, 15"
                              {...field}
                              data-testid="input-quantity"
                            />
                          </FormControl>
                          <FormDescription>
                            How many units or what amount is available
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel data-testid="label-unit">Unit of Measurement *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., board feet, blocks, beams, sq ft"
                              {...field}
                              data-testid="input-unit"
                            />
                          </FormControl>
                          <FormDescription>
                            Unit of measurement for the quantity
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-price">Price per Unit (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., 45.00 (leave empty if giving away for free)"
                            type="number"
                            step="0.01"
                            {...field}
                            data-testid="input-price"
                          />
                        </FormControl>
                        <FormDescription>
                          Leave blank if you're giving the material away for free
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Location and Contact */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground" data-testid="text-section-contact">Location & Contact</h3>
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-location">Location *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Brooklyn, NY or 10001"
                            {...field}
                            data-testid="input-location"
                          />
                        </FormControl>
                        <FormDescription>
                          City, state, or ZIP code where material can be picked up
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-contact-preference">Preferred Contact Method *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-contact-preference">
                              <SelectValue placeholder="How would you like to be contacted?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CONTACT_PREFERENCES.map((pref) => (
                              <SelectItem key={pref.value} value={pref.value} data-testid={`option-contact-${pref.value}`}>
                                {pref.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose how buyers can reach out to you
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:opacity-90"
                    disabled={createMaterialMutation.isPending}
                    data-testid="button-submit"
                  >
                    {createMaterialMutation.isPending ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Creating Listing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus mr-2"></i>
                        Create Listing
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/dashboard")}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
