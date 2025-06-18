import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic, log } from "./vite";
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

function startProductionServer() {
  try {
    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = 5000;
    const server = app.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
    });

    // Register API routes first
    registerRoutes(app);

    // Serve static files for production
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
  } catch (err: any) {
    logger.fatal("Failed to start server", { error: err.message, stack: err.stack });
    process.exit(1);
  }
}

// Start server without async wrapper
startProductionServer();

export default app;