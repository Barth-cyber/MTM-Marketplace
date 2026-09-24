import React, { useState } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  placeholder?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  className = "",
  placeholder = "Listening for voice search..."
}) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your search query.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscript(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Failed to start voice recognition:", err);
      setIsListening(false);
    }
  };

  return (
    <button
      type="button"
      onClick={startListening}
      className={`relative group p-2 rounded-lg transition items-center justify-center cursor-pointer ${
        isListening
          ? 'bg-red-500 text-white animate-pulse shadow-md ring-2 ring-red-400'
          : 'bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#1E40AF] border border-slate-200'
      } ${className}`}
      title={isListening ? "Listening... Speak your query" : "Voice Input (Speech-to-Text)"}
    >
      {isListening ? (
        <div className="flex items-center gap-1 text-[10px] font-bold px-1">
          <Volume2 className="w-3.5 h-3.5 animate-bounce" />
          <span className="hidden sm:inline">{placeholder}</span>
        </div>
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  );
};
