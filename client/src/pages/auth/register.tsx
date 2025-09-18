import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { insertUserSchema, InsertUser } from "@shared/schema";

export default function Register() {
  const [, setLocation] = useLocation();
  const { user, registerMutation } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      name: "",
      phone: "",
      location: "",
    },
  });

  const onSubmit = (data: InsertUser) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        setLocation("/dashboard");
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8" data-testid="page-register">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" data-testid="link-home">
            <h1 className="text-3xl font-bold text-foreground hover:text-primary cursor-pointer">
              <i className="fas fa-hard-hat text-primary mr-2"></i>
              MaterialMart
            </h1>
          </Link>
          <p className="text-muted-foreground mt-2" data-testid="text-subtitle">
            Create your account to get started
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle data-testid="text-card-title">Create Account</CardTitle>
            <CardDescription data-testid="text-card-description">
              Join MaterialMart to buy and sell construction materials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-register">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel data-testid="label-name">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          data-testid="input-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel data-testid="label-username">Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="johndoe"
                          {...field}
                          data-testid="input-username"
                        />
                      </FormControl>
                      <FormDescription>
                        This will be your unique identifier on the platform
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel data-testid="label-email">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel data-testid="label-password">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Create a secure password"
                          {...field}
                          data-testid="input-password"
                        />
                      </FormControl>
                      <FormDescription>
                        Password must be at least 6 characters long
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel data-testid="label-phone">Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="(555) 123-4567"
                          {...field}
                          value={field.value || ""}
                          data-testid="input-phone"
                        />
                      </FormControl>
                      <FormDescription>
                        Buyers can contact you via phone if provided
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel data-testid="label-location">Location (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="City, State"
                          {...field}
                          value={field.value || ""}
                          data-testid="input-location"
                        />
                      </FormControl>
                      <FormDescription>
                        Helps buyers find materials near them
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:opacity-90"
                  disabled={registerMutation.isPending}
                  data-testid="button-register"
                >
                  {registerMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus mr-2"></i>
                      Create Account
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground" data-testid="text-login-prompt">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline" data-testid="link-login">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-back">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
