import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { User as UserType, insertUserSchema } from "@shared/schema";
import { z } from "zod";

declare global {
  namespace Express {
    interface User extends UserType {}
  }
}

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  return await bcrypt.compare(supplied, stored);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    name: "materialmart-session", // Named session for easier cookie management
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax", // Prevent CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  };

  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }
  
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", // Use email instead of username
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user || !(await comparePasswords(password, user.password))) {
            return done(null, false, { message: "Invalid credentials" });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Register endpoint
  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Check username uniqueness
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(userData.password);
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Regenerate session to prevent session fixation
      req.session.regenerate((err) => {
        if (err) return next(err);
        
        // Log the user in automatically
        req.login(user, (loginErr) => {
          if (loginErr) return next(loginErr);
          
          // Return only safe user fields
          const safeUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            phone: user.phone,
            location: user.location,
            createdAt: user.createdAt,
          };
          
          res.status(201).json({ user: safeUser });
        });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Login endpoint
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: UserType | false, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Regenerate session to prevent session fixation
      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ message: "Session regeneration failed" });
        }
        
        req.login(user, (loginErr) => {
          if (loginErr) {
            return res.status(500).json({ message: "Login failed" });
          }
          
          // Return only safe user fields
          const safeUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            phone: user.phone,
            location: user.location,
            createdAt: user.createdAt,
          };
          
          res.json({ user: safeUser });
        });
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      
      // Destroy the session completely
      req.session.destroy((destroyErr) => {
        if (destroyErr) {
          return res.status(500).json({ message: "Session cleanup failed" });
        }
        
        // Clear the session cookie
        res.clearCookie("materialmart-session");
        res.json({ message: "Logged out successfully" });
      });
    });
  });

  // Get current user endpoint
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    // Return only safe user fields
    const safeUser = {
      id: req.user!.id,
      username: req.user!.username,
      email: req.user!.email,
      name: req.user!.name,
      phone: req.user!.phone,
      location: req.user!.location,
      createdAt: req.user!.createdAt,
    };
    
    res.json({ user: safeUser });
  });
}