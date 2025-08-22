import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Copy, AlertCircle, Sparkles, MessageSquare } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Message Guru
              </h1>
            </div>
          </div>
          <p className="text-center text-gray-600 mt-2 text-lg">
            Smart AI-powered message replies • Professional • Instant
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Ad Space */}
          <div className="lg:col-span-2 hidden lg:block">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 h-96 flex items-center justify-center text-gray-400 text-sm">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-3"></div>
                <p>Advertisement Space</p>
                <p className="text-xs mt-1">300x250</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Reply Generation</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Never Be Lost for Words Again
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Generate perfect, contextual replies for any message. Whether it's your boss, your crush, or your mom - we've got the perfect response ready in seconds.
              </p>
            </div>

            {/* Main Form */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-6 border-b border-gray-100">
                <h3 className="text-2xl font-semibold text-gray-900">Generate Your Perfect Reply</h3>
                <p className="text-gray-600 mt-1">Paste your message and let AI craft the perfect response</p>
              </div>
              
              <div className="p-8">
                <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); generateReply(); }}>
                  {/* Message Input */}
                  <div>
                    <Label htmlFor="message" className="text-lg font-semibold text-gray-900 mb-3 block">
                      Incoming Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Hey, how are you?"
                      className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none text-gray-900 placeholder-gray-400 text-lg leading-relaxed"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      required
                    />
                  </div>

                  {/* Dropdowns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* From Whom */}
                    <div>
                      <Label htmlFor="relationship" className="text-lg font-semibold text-gray-900 mb-3 block">
                        From Whom
                      </Label>
                      <Select value={formData.relationship} onValueChange={(value) => handleInputChange("relationship", value)}>
                        <SelectTrigger className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white text-gray-900 text-lg h-14">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {relationshipOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="text-lg py-3">
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Mood */}
                    <div>
                      <Label htmlFor="mood" className="text-lg font-semibold text-gray-900 mb-3 block">
                        Mood
                      </Label>
                      <Select value={formData.mood} onValueChange={(value) => handleInputChange("mood", value)}>
                        <SelectTrigger className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white text-gray-900 text-lg h-14">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {moodOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="text-lg py-3">
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <div className="flex justify-center pt-6">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-48"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Generate Reply
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Top Banner Ad Space */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 text-center">
              <div className="h-24 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                <div>
                  <p className="text-sm font-medium">Advertisement</p>
                  <p className="text-xs mt-1">728x90 Banner</p>
                </div>
              </div>
            </div>

            {/* Error Section */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Generate Reply</h3>
                    <p className="text-red-700 leading-relaxed">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Result Box */}
            {generatedReply && (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 px-8 py-6 border-b border-gray-100">
                  <h3 className="text-2xl font-semibold text-gray-900">Your Perfect Reply</h3>
                  <p className="text-gray-600 mt-1">Copy and paste this response</p>
                </div>
                
                <div className="p-8">
                  {/* Reply Display */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 mb-8 border border-gray-100">
                    <p className="text-gray-900 text-xl leading-relaxed font-medium">
                      {generatedReply}
                    </p>
                  </div>

                  {/* Copy Button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={copyToClipboard}
                      className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-200"
                    >
                      <Copy className="w-5 h-5 mr-2" />
                      Copy to Clipboard
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Ad Space */}
          <div className="lg:col-span-2 hidden lg:block">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 h-96 flex items-center justify-center text-gray-400 text-sm mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-3"></div>
                <p>Advertisement Space</p>
                <p className="text-xs mt-1">300x250</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-200 p-6 h-64 flex items-center justify-center text-gray-400 text-sm">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-3"></div>
                <p>Advertisement Space</p>
                <p className="text-xs mt-1">300x200</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Ad Space */}
        <div className="lg:hidden bg-white rounded-2xl border border-gray-200 p-6 mt-8 text-center">
          <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
            <div>
              <p className="text-sm font-medium">Advertisement</p>
              <p className="text-xs mt-1">Mobile Banner 320x100</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-100">
            <p className="text-gray-600 mb-3 text-lg">
              Made with ❤️ for better communication
            </p>
            <p className="text-gray-500 text-sm leading-relaxed max-w-2xl mx-auto">
              Your messages are processed securely and not stored. AI responses are suggestions - always use your judgment. 
              Message Guru helps you communicate better, faster, and more effectively.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}