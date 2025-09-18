import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen" data-testid="loading-auth">
      <Loader2 className="h-8 w-8 animate-spin text-border" />
    </div>
  );
}

function LoginRedirect() {
  return <Redirect to="/login" />;
}

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Route path={path} component={LoadingScreen} />;
  }

  if (!user) {
    return <Route path={path} component={LoginRedirect} />;
  }

  return <Route path={path} component={Component} />;
}