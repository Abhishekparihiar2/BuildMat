import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Header() {
  const [location] = useLocation();
  const [currentUser, setCurrentUser] = useState(null); // TODO: Replace with actual auth state

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" data-testid="link-home">
                <h1 className="text-2xl font-bold text-foreground hover:text-primary cursor-pointer">
                  <i className="fas fa-hard-hat text-primary mr-2"></i>
                  MaterialMart
                </h1>
              </Link>
            </div>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link 
                href="/browse" 
                className={`px-3 py-2 text-sm font-medium ${
                  location === '/browse' 
                    ? 'text-foreground border-b-2 border-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                data-testid="link-browse"
              >
                Browse Materials
              </Link>
              <a 
                href="#categories" 
                className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium"
                data-testid="link-categories"
              >
                Categories
              </a>
              <a 
                href="#how-it-works" 
                className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium"
                data-testid="link-how-it-works"
              >
                How It Works
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link href="/dashboard" data-testid="link-dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/add-listing" data-testid="link-add-listing">
                  <Button 
                    className="bg-primary text-primary-foreground hover:opacity-90"
                    size="sm"
                    data-testid="button-list-material"
                  >
                    List Material
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" data-testid="link-login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" data-testid="link-register">
                  <Button 
                    className="bg-primary text-primary-foreground hover:opacity-90"
                    size="sm"
                    data-testid="button-register"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
