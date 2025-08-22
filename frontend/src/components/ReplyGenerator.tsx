import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Copy, RotateCcw, Plus, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReplyGenerationRequest {
  message: string;
  relationship: string;
  mood: string;
}

interface ReplyResponse {
  reply: string;
  responseTime: number;
}

export default function ReplyGenerator() {
  const [formData, setFormData] = useState<ReplyGenerationRequest>({
    message: "",
    relationship: "friend",
    mood: "friendly"
  });
  const [generatedReply, setGeneratedReply] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [responseTime, setResponseTime] = useState<number>(0);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof ReplyGenerationRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateReply = async () => {
    if (!formData.message.trim()) {
      setError("Please enter a message to reply to.");
      return;
    }

    setIsLoading(true);
    setError("");
    setShowResults(false);

    try {
      const response = await fetch("/api/generate-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }

      const data: ReplyResponse = await response.json();
      setGeneratedReply(data.reply);
      setResponseTime(data.responseTime);
      setShowResults(true);

      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById("results-section");
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);

    } catch (err) {
      console.error("Error generating reply:", err);
      setError(err instanceof Error ? err.message : "Unable to generate reply. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedReply);
      toast({
        title: "Copied!",
        description: "Reply copied to clipboard",
        duration: 2000,
      });
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = generatedReply;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast({
        title: "Copied!",
        description: "Reply copied to clipboard",
        duration: 2000,
      });
    }
  };

  const regenerateReply = () => {
    generateReply();
  };

  const startNewReply = () => {
    setFormData({
      message: "",
      relationship: "friend",
      mood: "friendly"
    });
    setGeneratedReply("");
    setError("");
    setShowResults(false);
    setResponseTime(0);
    // Focus on message input
    const messageInput = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
    if (messageInput) {
      messageInput.focus();
    }
  };

  const relationshipOptions = [
    { value: "partner", label: "Partner 💕" },
    { value: "friend", label: "Friend 🤝" },
    { value: "family", label: "Family 👨‍👩‍👧‍👦" },
    { value: "colleague", label: "Colleague 💼" },
    { value: "other", label: "Other ✨" }
  ];

  const moodOptions = [
    { value: "friendly", label: "Friendly 😊" },
    { value: "professional", label: "Professional 🤝" },
    { value: "casual", label: "Casual 😎" },
    { value: "empathetic", label: "Empathetic 🤗" },
    { value: "humorous", label: "Humorous 😄" },
    { value: "romantic", label: "Romantic 💕" },
    { value: "apologetic", label: "Apologetic 🙏" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-mint-50">
      {/* Header */}
      <header className="w-full py-6">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-3xl">💬</span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Reply <span style={{ color: 'hsl(var(--primary-500))' }}>Baba</span>
            </h1>
          </div>
          <p className="text-gray-600 text-sm md:text-base">
            Generate thoughtful replies with AI • Free • No signup required
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
            Stuck on what to reply? We've got you covered.
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto">
            Paste any message, choose your relationship and tone, and get the perfect AI-generated reply in seconds.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden" style={{ boxShadow: '0 20px 25px -5px hsl(var(--primary-100)), 0 10px 10px -5px hsl(var(--primary-100))' }}>
          <div className="p-6 md:p-8">
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); generateReply(); }}>
              {/* Message Input */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                  Message you received
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="e.g., Hey, why didn't you call me back yesterday?"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 custom-input transition-all duration-300 resize-none text-gray-800 placeholder-gray-400"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  required
                />
              </div>

              {/* Selectors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Relationship Selector */}
                <div className="space-y-2">
                  <Label htmlFor="relationship" className="text-sm font-medium text-gray-700">
                    Who sent this?
                  </Label>
                  <Select value={formData.relationship} onValueChange={(value) => handleInputChange("relationship", value)}>
                    <SelectTrigger className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 custom-select transition-all duration-300 bg-white text-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {relationshipOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Mood Selector */}
                <div className="space-y-2">
                  <Label htmlFor="mood" className="text-sm font-medium text-gray-700">
                    Reply tone
                  </Label>
                  <Select value={formData.mood} onValueChange={(value) => handleInputChange("mood", value)}>
                    <SelectTrigger className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 custom-select transition-all duration-300 bg-white text-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {moodOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex justify-center pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 btn-primary-gradient text-white font-medium rounded-2xl shadow-primary hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Generating...
                    </>
                  ) : (
                    "Generate Reply"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Error Section */}
        {error && (
          <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-3xl p-6 md:p-8 animate-slide-up">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-red-800">Oops! Something went wrong</h3>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <Button
              onClick={generateReply}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-100"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Results Section */}
        {showResults && generatedReply && (
          <section id="results-section" className="mt-6">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-slide-up" style={{ boxShadow: '0 20px 25px -5px hsl(var(--mint-100)), 0 10px 10px -5px hsl(var(--mint-100))' }}>
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Your AI-Generated Reply</h3>
                  <div className="text-sm text-gray-500">
                    Generated in {(responseTime / 1000).toFixed(1)}s
                  </div>
                </div>

                {/* Generated Reply Display */}
                <div className="rounded-2xl p-6 mb-6" style={{ background: 'linear-gradient(135deg, hsl(var(--mint-50)), hsl(var(--primary-50)))' }}>
                  <p className="text-gray-800 leading-relaxed text-base md:text-lg">
                    {generatedReply}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button
                    onClick={copyToClipboard}
                    className="px-6 py-2.5 btn-mint-gradient text-white font-medium rounded-xl shadow-mint hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-mint-100"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Reply
                  </Button>
                  <Button
                    onClick={regenerateReply}
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-100"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button
                    onClick={startNewReply}
                    className="px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl border-2 border-gray-200 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-100"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Reply
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-2">
              Made with ❤️ for better communication
            </p>
            <p className="text-xs text-gray-500">
              Your messages are processed securely and not stored. AI responses are suggestions - use your judgment.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
