import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface AIButtonProps {
  onClick: () => Promise<void>;
  label?: string;
  tooltip?: string;
  className?: string;
  variant?: 'icon' | 'text';
}

export const AIButton: React.FC<AIButtonProps> = ({ 
  onClick, 
  label = "Enhance", 
  tooltip = "Enhance with AI",
  className = "",
  variant = 'text'
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      await onClick();
    } catch (error) {
      console.error(error);
      alert("Failed to generate AI content. Please check your connection or API key.");
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'icon') {
     return (
      <button
        onClick={handleClick}
        title={tooltip}
        className={`p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors ${className}`}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium 
        text-white bg-gradient-to-r from-indigo-500 to-purple-600 
        hover:from-indigo-600 hover:to-purple-700
        rounded-md shadow-sm transition-all
        disabled:opacity-70 disabled:cursor-not-allowed
        ${className}
      `}
      title={tooltip}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Sparkles className="w-3.5 h-3.5" />
      )}
      {isLoading ? 'Thinking...' : label}
    </button>
  );
};