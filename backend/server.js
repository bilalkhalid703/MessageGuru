import express from "express";
import cors from "cors";
import { replyGenerationSchema } from "./shared/schema.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// AI service integration
async function generateReply(request) {
  const { message, relationship, mood } = request;

  const relationshipContext = getRelationshipContext(relationship);
  const moodContext = getMoodContext(mood);

  const prompt = `Generate a ${moodContext} reply to this message from a ${relationshipContext}.

Message: "${message}"

Reply with a natural, appropriate response that matches the relationship and mood. Keep it conversational and authentic. Only return the reply text, no quotes or extra formatting.

Reply:`;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 100,
            temperature: 0.7,
            do_sample: true,
            return_full_text: false
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // Handle different response formats from Hugging Face
    let generatedText = "";
    if (Array.isArray(result) && result.length > 0) {
      generatedText = result[0].generated_text || result[0].text || "";
    } else if (result.generated_text) {
      generatedText = result.generated_text;
    } else if (result.text) {
      generatedText = result.text;
    }

    // Clean up the response
    generatedText = generatedText.trim();
    
    // Remove the original prompt if it's included
    if (generatedText.includes("Reply:")) {
      generatedText = generatedText.split("Reply:").pop()?.trim() || generatedText;
    }

    // If response is too short or empty, use a fallback
    if (!generatedText || generatedText.length < 10) {
      return generateFallbackReply(request);
    }

    return generatedText;

  } catch (error) {
    console.error("Hugging Face API error:", error);
    
    if (error.message?.includes("401")) {
      throw new Error("Authentication error with Hugging Face. Please check your API token.");
    } else if (error.message?.includes("503")) {
      throw new Error("AI service is currently loading. Please try again in a moment!");
    } else {
      // Return a fallback reply instead of throwing an error
      return generateFallbackReply(request);
    }
  }
}

function generateFallbackReply(request) {
  const { message, relationship, mood } = request;
  
  // Simple rule-based fallback replies
  const fallbacks = {
    funny: [
      "Haha, good one! 😄",
      "You always know how to make me laugh!",
      "That's hilarious! Thanks for sharing that with me."
    ],
    witty: [
      "Well played! I see what you did there.",
      "Touché! You got me there.",
      "Clever! I like how you think."
    ],
    serious: [
      "I understand what you're saying.",
      "Thank you for sharing that with me.",
      "I appreciate you being direct about this."
    ],
    romantic: [
      "You always know what to say to make me smile 💕",
      "That means so much to me, thank you!",
      "I feel the same way about you ❤️"
    ],
    flirty: [
      "You're quite charming, you know that? 😉",
      "Is that so? Tell me more...",
      "You always know how to get my attention 😊"
    ],
    sarcastic: [
      "Oh wow, really? I had no idea! 🙄",
      "Well, that's... interesting.",
      "Sure, absolutely. Totally makes sense."
    ]
  };

  const moodReplies = fallbacks[mood] || fallbacks.funny;
  const randomReply = moodReplies[Math.floor(Math.random() * moodReplies.length)];
  
  return randomReply;
}

function getRelationshipContext(relationship) {
  const contexts = {
    friend: "close friend",
    girlfriend: "girlfriend",
    boyfriend: "boyfriend", 
    family: "family member",
    colleague: "work colleague",
    stranger: "acquaintance"
  };
  return contexts[relationship] || "friend";
}

function getMoodContext(mood) {
  const contexts = {
    funny: "humorous and light-hearted",
    witty: "clever and smart",
    serious: "serious and thoughtful",
    romantic: "romantic and affectionate",
    flirty: "playful and flirty",
    sarcastic: "sarcastic but not mean"
  };
  return contexts[mood] || "friendly";
}

// API Routes
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

    // Generate reply using Hugging Face
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

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});