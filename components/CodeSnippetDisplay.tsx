
import React, { useState, useEffect } from 'react';
import { CodeSnippet } from '../types';
import { DocumentDuplicateIcon, CheckIcon } from './IconComponents';

// Basic syntax highlighting (can be expanded)
const highlightSyntax = (code: string, language: string): React.ReactNode => {
  if (language === 'python') {
    return code
      .replace(/\b(def|class|import|from|return|if|else|elif|for|while|try|except|finally|with|as|pass|break|continue|lambda|yield|global|nonlocal|assert|del|in|is|not|and|or)\b/g, '<span class="text-purple-400">$&</span>') // Keywords
      .replace(/#.*/g, '<span class="text-green-400">$&</span>') // Comments
      .replace(/("""|'''|"[^"]*"|'[^']*')/g, '<span class="text-yellow-400">$&</span>'); // Strings
  }
  if (language === 'javascript') {
    return code
      .replace(/\b(function|class|const|let|var|return|if|else|for|while|try|catch|finally|import|export|from|new|this|await|async|yield|super|extends|static|get|set)\b/g, '<span class="text-purple-400">$&</span>') // Keywords
      .replace(/\/\/.*/g, '<span class="text-green-400">$&</span>') // Single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '<span class="text-green-400">$&</span>') // Multi-line comments
      .replace(/(`[^`]*`|"[^"]*"|'[^']*')/g, '<span class="text-yellow-400">$&</span>'); // Strings and template literals
  }
   if (language === 'curl') {
    return code
      .replace(/\b(curl)\b/g, '<span class="text-blue-400">$&</span>') // command
      .replace(/(-X POST|-X GET|-H|--data)/g, '<span class="text-purple-400">$&</span>') // options
      .replace(/(https?:\/\/[^\s]+)/g, '<span class="text-green-400">$&</span>'); // URLs
   }
  return code;
};


interface CodeSnippetDisplayProps {
  snippets: CodeSnippet[];
  defaultLanguage?: 'javascript' | 'python' | 'curl';
}

const CodeSnippetDisplay: React.FC<CodeSnippetDisplayProps> = ({ snippets, defaultLanguage = 'python' }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'python' | 'curl'>(defaultLanguage);
  const [copied, setCopied] = useState(false);

  const selectedSnippet = snippets.find(s => s.language === selectedLanguage) || snippets[0];

  useEffect(() => {
    // If the current selected language is not in the snippets, select the first available one
    if (!snippets.find(s => s.language === selectedLanguage) && snippets.length > 0) {
      setSelectedLanguage(snippets[0].language);
    }
  }, [snippets, selectedLanguage]);

  if (!selectedSnippet) {
    return <p className="text-text-muted-light dark:text-text-muted-dark">No code snippets available.</p>;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-800 dark:bg-black rounded-lg shadow-md">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 dark:border-gray-900">
        <div className="flex space-x-1">
          {snippets.map(snippet => (
            <button
              key={snippet.language}
              onClick={() => setSelectedLanguage(snippet.language)}
              className={`px-3 py-1 text-sm rounded-md transition-colors
                ${selectedLanguage === snippet.language 
                  ? 'bg-primary-DEFAULT text-white' 
                  : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'}`}
            >
              {snippet.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center px-3 py-1 text-sm text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
        >
          {copied ? <CheckIcon size={16} className="mr-1 text-green-400" /> : <DocumentDuplicateIcon size={16} className="mr-1" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 text-sm text-gray-200 overflow-x-auto">
        <code dangerouslySetInnerHTML={{ __html: highlightSyntax(selectedSnippet.code, selectedSnippet.language) as string }} />
      </pre>
    </div>
  );
};

export default CodeSnippetDisplay;
