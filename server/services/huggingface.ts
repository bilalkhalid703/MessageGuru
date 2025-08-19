interface ReplyRequest {
  message: string;
  relationship: string;
  mood: string;
}

export async function generateReply(request: ReplyRequest): Promise<string> {
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

  } catch (error: any) {
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

function generateFallbackReply(request: ReplyRequest): string {
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

  const moodReplies = fallbacks[mood as keyof typeof fallbacks] || fallbacks.funny;
  const randomReply = moodReplies[Math.floor(Math.random() * moodReplies.length)];
  
  return randomReply;
}

function getRelationshipContext(relationship: string): string {
  const contexts = {
    friend: "close friend",
    girlfriend: "girlfriend",
    boyfriend: "boyfriend", 
    family: "family member",
    colleague: "work colleague",
    stranger: "acquaintance"
  };
  return contexts[relationship as keyof typeof contexts] || "friend";
}

function getMoodContext(mood: string): string {
  const contexts = {
    funny: "humorous and light-hearted",
    witty: "clever and smart",
    serious: "serious and thoughtful",
    romantic: "romantic and affectionate",
    flirty: "playful and flirty",
    sarcastic: "sarcastic but not mean"
  };
  return contexts[mood as keyof typeof contexts] || "friendly";
}