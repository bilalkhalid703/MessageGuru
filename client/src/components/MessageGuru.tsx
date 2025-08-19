import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Copy, AlertCircle } from "lucide-react";
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

export default function MessageGuru() {
  const [formData, setFormData] = useState<ReplyGenerationRequest>({
    message: "",
    relationship: "friend",
    mood: "funny"
  });
  const [generatedReply, setGeneratedReply] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
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
    setGeneratedReply("");

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
        throw new Error(errorData.message || "Oops! Message Guru is taking a nap. Try again!");
      }

      const data: ReplyResponse = await response.json();
      setGeneratedReply(data.reply);

    } catch (err) {
      console.error("Error generating reply:", err);
      setError(err instanceof Error ? err.message : "Oops! Message Guru is taking a nap. Try again!");
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

  const relationshipOptions = [
    { value: "friend", label: "Friend" },
    { value: "girlfriend", label: "Girlfriend" },
    { value: "boyfriend", label: "Boyfriend" },
    { value: "family", label: "Family" },
    { value: "colleague", label: "Colleague" },
    { value: "stranger", label: "Stranger" }
  ];

  const moodOptions = [
    { value: "funny", label: "Funny" },
    { value: "witty", label: "Witty" },
    { value: "serious", label: "Serious" },
    { value: "romantic", label: "Romantic" },
    { value: "flirty", label: "Flirty" },
    { value: "sarcastic", label: "Sarcastic" }
  ];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, hsl(318, 100%, 95%), hsl(320, 100%, 98%), hsl(210, 100%, 95%))" }}>
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Message Guru
          </h1>
          <p className="text-gray-600 text-lg">
            Your virtual message guru for smart, witty replies
          </p>
        </header>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-6 md:p-8 mb-6">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); generateReply(); }}>
            {/* Message Input */}
            <div className="space-y-3">
              <Label htmlFor="message" className="text-lg font-semibold text-gray-800">
                Paste the incoming message:
              </Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Hey, how are you?"
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none text-gray-800 placeholder-gray-400 text-lg"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                required
              />
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* From Whom */}
              <div className="space-y-3">
                <Label htmlFor="relationship" className="text-lg font-semibold text-gray-800">
                  From whom:
                </Label>
                <Select value={formData.relationship} onValueChange={(value) => handleInputChange("relationship", value)}>
                  <SelectTrigger className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white text-gray-800 text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {relationshipOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-lg">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mood */}
              <div className="space-y-3">
                <Label htmlFor="mood" className="text-lg font-semibold text-gray-800">
                  Mood:
                </Label>
                <Select value={formData.mood} onValueChange={(value) => handleInputChange("mood", value)}>
                  <SelectTrigger className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white text-gray-800 text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {moodOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-lg">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Generating...
                  </>
                ) : (
                  "Generate Reply"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Error Section */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center mb-3">
              <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
            </div>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Result Box */}
        {generatedReply && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-6 md:p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Reply:</h3>
            
            {/* Reply Display */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border border-blue-100">
              <p className="text-gray-800 text-lg leading-relaxed">
                {generatedReply}
              </p>
            </div>

            {/* Copy Button */}
            <div className="flex justify-center">
              <Button
                onClick={copyToClipboard}
                className="px-6 py-3 text-lg font-semibold bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-200"
              >
                <Copy className="w-5 h-5 mr-2" />
                Copy to Clipboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}