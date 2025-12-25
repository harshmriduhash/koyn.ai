import React, { useState, FormEvent, useEffect } from 'react';
import { generateBoilerplateCode } from '../services/geminiService';
import CodeSnippetDisplay from '../components/CodeSnippetDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import { CodeBracketIcon, SparklesIcon, ArrowDownTrayIcon } from '../components/IconComponents';
import { CodeSnippet as CodeSnippetType } from '../types';
import { LANGUAGES_FOR_BOILERPLATE, APP_NAME } from '../constants';

const DeveloperToolsPage: React.FC = () => {
  const [modelName, setModelName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [language, setLanguage] = useState<'javascript' | 'python' | 'curl'>(LANGUAGES_FOR_BOILERPLATE[0].value as 'javascript' | 'python' | 'curl');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = `Developer Tools | ${APP_NAME}`;
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!modelName || !taskDescription) {
      setError("Please provide both model name and task description.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedCode('');
    try {
      const code = await generateBoilerplateCode(modelName, taskDescription, language);
      setGeneratedCode(code);
    } catch (err) {
      console.error("Error generating code:", err);
      setError(err instanceof Error ? err.message : "Failed to generate code. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const generatedSnippet: CodeSnippetType[] = generatedCode ? [{
    language: language,
    label: language.charAt(0).toUpperCase() + language.slice(1), // Capitalize first letter
    code: generatedCode
  }] : [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-text-light dark:text-text-dark mb-3">Developer Tools</h1>
        <p className="text-lg text-text-muted-light dark:text-text-muted-dark">Integrate AI models seamlessly into your applications.</p>
      </div>

      {/* AI Boilerplate Generator */}
      <section className="mb-16 p-8 bg-card-light dark:bg-card-dark rounded-xl shadow-xl">
        <div className="flex items-center mb-6">
          <SparklesIcon size={32} className="text-primary-DEFAULT mr-3" />
          <h2 className="text-3xl font-semibold text-text-light dark:text-text-dark">AI-Powered Boilerplate Generator</h2>
        </div>
        <p className="text-text-muted-light dark:text-text-muted-dark mb-6">
          Need to integrate a model quickly? Describe your task, specify the model, and choose your language. Our AI will generate starter code for you.
          Powered by Gemini.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="modelName" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Model Name</label>
            <input
              type="text"
              id="modelName"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="e.g., gpt-summarizer-pro, vision-object-detector-x"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-primary-DEFAULT focus:border-primary-DEFAULT"
              required
            />
          </div>
          <div>
            <label htmlFor="taskDescription" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Task Description</label>
            <input
              type="text"
              id="taskDescription"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="e.g., Summarize customer feedback, Detect faces in an image"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-primary-DEFAULT focus:border-primary-DEFAULT"
              required
            />
          </div>
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Language</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'javascript' | 'python' | 'curl')}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-primary-DEFAULT focus:border-primary-DEFAULT"
            >
              {LANGUAGES_FOR_BOILERPLATE.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto px-6 py-3 bg-primary-DEFAULT hover:bg-primary-dark text-white font-semibold rounded-md transition-colors disabled:opacity-70 flex items-center justify-center"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : <CodeBracketIcon size={20} className="mr-2" />}
            {isLoading ? 'Generating...' : 'Generate Code'}
          </button>
        </form>
        {error && <p className="mt-4 text-red-500 dark:text-red-400">{error}</p>}
        {generatedCode && !isLoading && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-3 text-text-light dark:text-text-dark">Generated Code:</h3>
            <CodeSnippetDisplay snippets={generatedSnippet} defaultLanguage={language} />
          </div>
        )}
      </section>

      {/* API & SDK Information */}
      <section className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="p-6 bg-card-light dark:bg-card-dark rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">REST & GraphQL APIs</h2>
          <p className="text-text-muted-light dark:text-text-muted-dark mb-4">
            Access all models and platform features through our robust APIs. Choose between REST for simplicity or GraphQL for flexible data fetching.
          </p>
          <a href="#" className="font-medium text-primary-DEFAULT hover:text-primary-dark dark:hover:text-primary-light">View API Documentation &rarr;</a>
        </div>
        <div className="p-6 bg-card-light dark:bg-card-dark rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">SDKs</h2>
          <p className="text-text-muted-light dark:text-text-muted-dark mb-4">
            Get started quickly with our official SDKs, available for popular languages.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700">
              <ArrowDownTrayIcon size={16} className="mr-2" /> Python SDK
            </a>
            <a href="#" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700">
              <ArrowDownTrayIcon size={16} className="mr-2" /> JavaScript SDK
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeveloperToolsPage;