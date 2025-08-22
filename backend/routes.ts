import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { replyGenerationSchema } from "@shared/schema";
import { generateReply } from "./services/huggingface";

export async function registerRoutes(app: Express): Promise<Server> {
  // Reply generation endpoint
  app.post("/api/generate-reply", async (req, res) => {
    try {
      const startTime = Date.now();
      
      // Validate request body
      const validation = replyGenerationSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: "Invalid request", 
          details: validation.error.errors 
        });
      }

      const { message, relationship, mood } = validation.data;

      // Generate reply using OpenAI
      const reply = await generateReply({ message, relationship, mood });
      const responseTime = Date.now() - startTime;

      res.json({
        reply,
        responseTime
      });

    } catch (error) {
      console.error("Reply generation error:", error);
      res.status(500).json({ 
        error: "Failed to generate reply", 
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
