import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { logger } from "./logger";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import os from "os";
import process from "process";

// Initialize Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Capture JSON response for logging
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  // Log request completion
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      // Use our enhanced logger
      logger.logApiRequest(req, res, duration, 
        capturedJsonResponse ? JSON.stringify(capturedJsonResponse).substring(0, 200) : undefined);
      
      // Keep the old logging for console display
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.fatal('Uncaught Exception', { 
    error: error.message, 
    stack: error.stack,
    memory: process.memoryUsage(),
    cpu: os.loadavg()
  });
  
  // Give logger time to write before exiting
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

// ALWAYS serve the app on port 5000
// this serves both the API and the client.
// It is the only port that is not firewalled.
const port = 5000;
const server = app.listen(port, "0.0.0.0", () => {
  log(`serving on port ${port}`);
});

// Register API routes first
registerRoutes(app);

// Setup Vite for development or static files for production
// This must come BEFORE the 404 handler so it can catch all non-API routes
if (app.get("env") === "development") {
  setupVite(app, server).then(() => {
    // Add handlers after Vite is set up
    app.use(notFoundHandler);
    app.use(errorHandler);
    
    logger.info(`Server started in development mode`, {
      port,
      nodeEnv: process.env.NODE_ENV,
      nodeVersion: process.version,
      platform: os.platform(),
      memory: process.memoryUsage(),
    });
  }).catch(err => {
    logger.fatal("Failed to setup Vite", { error: err.message, stack: err.stack });
    process.exit(1);
  });
} else {
  // Production mode - no async operations needed
  serveStatic(app);
  
  // Add 404 handler for non-matched routes (only after static setup)
  app.use(notFoundHandler);
  
  // Add global error handler
  app.use(errorHandler);
  
  logger.info(`Server started in production mode`, {
    port,
    nodeEnv: process.env.NODE_ENV,
    nodeVersion: process.version,
    platform: os.platform(),
    memory: process.memoryUsage(),
  });
}
