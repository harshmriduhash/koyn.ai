import React, { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Model, ModelCategory, LicenseType, ModelArchitecture, PerformanceBenchmark, PricingTier, CodeSnippet, VersionInfo } from '../types';
import { marketplaceService } from '../services/marketplaceService';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowUpOnSquareIcon, SparklesIcon } from '../components/IconComponents';
import { CATEGORY_OPTIONS, LICENSE_OPTIONS, ARCHITECTURE_OPTIONS, APP_NAME } from '../constants';

const ModelUploadForm: React.FC<{ user: NonNullable<ReturnType<typeof useAuth>['currentUser']> }> = ({ user }) => {
    const [modelName, setModelName] = useState('');
    const [description, setDescription] = useState('');
    const [longDescription, setLongDescription] = useState('');
    const [category, setCategory] = useState<ModelCategory>(ModelCategory.NLP);
    const [license, setLicense] = useState<LicenseType>(LicenseType.MIT);
    const [architecture, setArchitecture] = useState<ModelArchitecture | undefined>(undefined);
    const [costIndicator, setCostIndicator] = useState('');
    const [tags, setTags] = useState(''); // Comma-separated
    const [githubUrl, setGithubUrl] = useState('');
    const [modelFileUrl, setModelFileUrl] = useState(''); // For mock upload

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        const modelData: Partial<Model> = {
            name: modelName,
            description,
            longDescription,
            category,
            license,
            architecture,
            costIndicator,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            githubUrl: githubUrl || undefined,
            modelFileUrl: modelFileUrl || undefined,
            // For a real app, you'd handle actual file uploads for model files, images, etc.
            // Also benchmarks, pricing tiers, code snippets, versions would be more complex forms.
        };
        
        try {
            const newModel = await marketplaceService.uploadModel(modelData, user);
            setSubmitStatus({ type: 'success', message: `Model "${newModel.name}" submitted successfully! It will be reviewed shortly.` });
            // Reset form (optional)
            setModelName(''); setDescription(''); setLongDescription(''); setCategory(ModelCategory.NLP); /* ... reset other fields */
        } catch (error) {
            console.error("Model submission failed:", error);
            setSubmitStatus({ type: 'error', message: "Failed to submit model. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-card-light dark:bg-card-dark rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-1">Submit New Model</h3>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4">Share your AI model with the community. Fill in the details below.</p>

            <div>
                <label htmlFor="modelName" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Model Name*</label>
                <input type="text" id="modelName" value={modelName} onChange={e => setModelName(e.target.value)} required 
                       className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-primary-DEFAULT focus:border-primary-DEFAULT"/>
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Short Description* (Max 150 chars)</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required maxLength={150} rows={2}
                          className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-primary-DEFAULT focus:border-primary-DEFAULT"/>
            </div>
             <div>
                <label htmlFor="longDescription" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Detailed Description</label>
                <textarea id="longDescription" value={longDescription} onChange={e => setLongDescription(e.target.value)} rows={4}
                          className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-primary-DEFAULT focus:border-primary-DEFAULT"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Category*</label>
                    <select id="category" value={category} onChange={e => setCategory(e.target.value as ModelCategory)} required
                            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-primary-DEFAULT focus:border-primary-DEFAULT">
                        {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="license" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">License*</label>
                    <select id="license" value={license} onChange={e => setLicense(e.target.value as LicenseType)} required
                            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-primary-DEFAULT focus:border-primary-DEFAULT">
                        {LICENSE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
            </div>
             <div>
                <label htmlFor="architecture" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Architecture (Optional)</label>
                <select id="architecture" value={architecture || ''} onChange={e => setArchitecture(e.target.value as ModelArchitecture || undefined)}
                        className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-primary-DEFAULT focus:border-primary-DEFAULT">
                    <option value="">Select Architecture (Optional)</option>
                    {ARCHITECTURE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="costIndicator" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Cost Indicator* (e.g., Free, $0.001/token)</label>
                <input type="text" id="costIndicator" value={costIndicator} onChange={e => setCostIndicator(e.target.value)} required
                       className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-primary-DEFAULT focus:border-primary-DEFAULT"/>
            </div>
            <div>
                <label htmlFor="tags" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Tags (comma-separated)</label>
                <input type="text" id="tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g., summarization, text-generation, efficient"
                       className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-primary-DEFAULT focus:border-primary-DEFAULT"/>
            </div>
             <div>
                <label htmlFor="githubUrl" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">GitHub URL (Optional)</label>
                <input type="url" id="githubUrl" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="https://github.com/your-repo/your-model"
                       className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-primary-DEFAULT focus:border-primary-DEFAULT"/>
            </div>
            <div>
                <label htmlFor="modelFileUrl" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Model File URL (e.g., Hugging Face Hub, S3 link - for demo)</label>
                 <input type="url" id="modelFileUrl" value={modelFileUrl} onChange={e => setModelFileUrl(e.target.value)} placeholder="Link to your model weights/files"
                       className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-primary-DEFAULT focus:border-primary-DEFAULT"/>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">In a real application, this would be a file upload mechanism or GitHub integration.</p>
            </div>

            {/* Placeholder for more complex fields like Benchmarks, Pricing Tiers, Snippets, Versions */}
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Note: Fields for benchmarks, pricing tiers, code snippets, and versioning would involve more complex UI elements in a full implementation.</p>

            <button type="submit" disabled={isSubmitting}
                    className="w-full flex items-center justify-center px-4 py-3 bg-primary-DEFAULT text-white font-semibold rounded-md hover:bg-primary-dark transition-colors disabled:opacity-70">
                {isSubmitting ? <LoadingSpinner size="sm" /> : <ArrowUpOnSquareIcon size={20} className="mr-2" />}
                {isSubmitting ? 'Submitting Model...' : 'Submit Model for Review'}
            </button>

            {submitStatus && (
                <p className={`mt-4 text-sm p-3 rounded-md ${submitStatus.type === 'success' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'}`}>
                    {submitStatus.message}
                </p>
            )}
        </form>
    );
};


const CreatorPortalPage: React.FC = () => {
  const { currentUser, isLoading: authLoading } = useAuth();

  useEffect(() => {
    document.title = `Creator Portal | ${APP_NAME}`;
  }, []);

  if (authLoading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]"><LoadingSpinner size="lg" text="Loading Creator Portal..." /></div>;
  }

  if (!currentUser || currentUser.accountType !== 'creator') {
    // Redirect to login or home if not a creator
    return <Navigate to={currentUser ? "/dashboard" : "/login"} replace />;
  }
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-text-light dark:text-text-dark mb-3">Creator Portal</h1>
        <p className="text-lg text-text-muted-light dark:text-text-muted-dark">Manage your models, track performance, and connect with users.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <section>
            <div className="flex items-center mb-6">
              <ArrowUpOnSquareIcon size={28} className="text-primary-DEFAULT mr-3" />
              <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark">Upload New Model</h2>
            </div>
            <ModelUploadForm user={currentUser} />
          </section>
        </div>

        <div className="lg:col-span-1 space-y-8">
            <section className="p-6 bg-card-light dark:bg-card-dark rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-text-light dark:text-text-dark mb-3">My Published Models</h2>
                {/* Placeholder for listing creator's models */}
                <p className="text-text-muted-light dark:text-text-muted-dark">You have 0 models published yet. Use the form to submit your first model!</p>
                {/* If models exist: <ModelList models={creatorModels} /> */}
            </section>
             <section className="p-6 bg-card-light dark:bg-card-dark rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-text-light dark:text-text-dark mb-3">Earnings Overview</h2>
                {/* Placeholder for earnings */}
                <p className="text-2xl font-bold text-secondary-DEFAULT">$0.00</p>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">This month's earnings. Detailed breakdown coming soon.</p>
            </section>
            <section className="p-6 bg-card-light dark:bg-card-dark rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-text-light dark:text-text-dark mb-3">Model Performance</h2>
                {/* Placeholder for stats */}
                <p className="text-text-muted-light dark:text-text-muted-dark">Overall usage statistics for your models will appear here.</p>
            </section>
             <section className="p-6 bg-card-light dark:bg-card-dark rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-text-light dark:text-text-dark mb-3">Recent Customer Feedback</h2>
                {/* Placeholder for feedback */}
                <p className="text-text-muted-light dark:text-text-muted-dark">No feedback received yet.</p>
            </section>
        </div>
      </div>
    </div>
  );
};

export default CreatorPortalPage;