import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "your-api-key-here" 
});

interface ReplyRequest {
  message: string;
  relationship: string;
  mood: string;
}

export async function generateReply(request: ReplyRequest): Promise<string> {
  const { message, relationship, mood } = request;

  const relationshipContext = getRelationshipContext(relationship);
  const moodContext = getMoodContext(mood);

  const prompt = `You are Message Guru, an AI assistant that helps people craft smart, witty, and appropriate text message replies.

Context:
- Incoming message: "${message}"
- Relationship: ${relationshipContext}
- Desired tone: ${moodContext}

Please generate a natural, appropriate reply that:
1. Acknowledges the original message appropriately
2. Matches the specified relationship dynamic and tone
3. Is conversational and authentic
4. Is the right length (not too short, not too long)
5. Uses appropriate language for the relationship type
6. If the tone is funny, witty, or sarcastic, incorporate clever wordplay or humor
7. If the tone is flirty or romantic, be charming but respectful

Respond with ONLY the reply text, no quotes, no extra formatting.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });

    const reply = response.choices[0].message.content?.trim();
    if (!reply) {
      throw new Error("No reply generated");
    }

    return reply;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate reply. Please try again.");
  }
}

function getRelationshipContext(relationship: string): string {
  const contexts = {
    friend: "close friend - casual, supportive, friendly",
    girlfriend: "girlfriend - intimate, caring, romantic, affectionate",
    boyfriend: "boyfriend - intimate, caring, romantic, affectionate",
    family: "family member - warm, respectful, familial",
    colleague: "work colleague or boss - professional yet personable",
    stranger: "stranger or acquaintance - polite, appropriate, measured"
  };
  return contexts[relationship as keyof typeof contexts] || contexts.stranger;
}

function getMoodContext(mood: string): string {
  const contexts = {
    funny: "light-hearted, playful, humorous, and entertaining",
    witty: "clever, smart, sharp, and intellectually amusing",
    serious: "straightforward, honest, mature, and direct",
    romantic: "affectionate, loving, sweet, and charming",
    flirty: "playful, charming, teasing, and subtly romantic",
    sarcastic: "clever, ironic, subtly mocking, but not mean-spirited"
  };
  return contexts[mood as keyof typeof contexts] || contexts.funny;
}
