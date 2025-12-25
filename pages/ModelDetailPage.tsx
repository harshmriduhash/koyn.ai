import React, { useState, useEffect, FormEvent } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Model, Review, User, CodeSnippet as CodeSnippetType, VersionInfo, PricingTier } from '../types';
import { marketplaceService } from '../services/marketplaceService';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRatingComponent from '../components/StarRating'; // Renamed to avoid conflict with Icon's StarIcon
import CodeSnippetDisplay from '../components/CodeSnippetDisplay';
import { useAuth } from '../hooks/useAuth';
import { DEFAULT_MODEL_IMAGE, DEFAULT_USER_AVATAR, APP_NAME } from '../constants';
import { CodeBracketIcon, ChatBubbleLeftEllipsisIcon, ArrowDownTrayIcon, LinkIcon, SparklesIcon, UserCircleIcon, CheckIcon, StarIcon } from '../components/IconComponents';

// Mock Interactive Playground
const InteractivePlayground: React.FC<{ model: Model }> = ({ model }) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputText) return;
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOutputText(`Mocked output for "${inputText}" using ${model.name}. This is a simulated response.`);
    setIsLoading(false);
  };

  return (
    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-card-light dark:bg-card-dark">
      <h4 className="text-lg font-semibold mb-4 text-text-light dark:text-text-dark">Try it Out!</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="playground-input" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Input:</label>
          <textarea
            id="playground-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={4}
            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-primary-DEFAULT focus:border-primary-DEFAULT"
            placeholder={model.category === 'Computer Vision' ? "Enter image URL..." : model.category === 'Audio Processing' ? "Enter audio file URL..." : "Enter your text here..."}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !inputText}
          className="px-4 py-2 bg-secondary-DEFAULT hover:bg-secondary-dark text-white font-medium rounded-md transition-colors disabled:opacity-50 flex items-center"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : <SparklesIcon size={18} className="mr-2"/>}
          {isLoading ? 'Processing...' : 'Run Model'}
        </button>
      </form>
      {outputText && (
        <div className="mt-6">
          <h5 className="text-md font-semibold mb-2 text-text-light dark:text-text-dark">Output:</h5>
          <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-text-light dark:text-text-dark whitespace-pre-wrap">{outputText}</pre>
        </div>
      )}
    </div>
  );
};


const ModelDetailPage: React.FC = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [model, setModel] = useState<Model | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (model) {
      document.title = `${model.name} | ${APP_NAME}`;
    } else {
      document.title = `Model Details | ${APP_NAME}`;
    }
    // Cleanup on unmount (optional, depends on overall title strategy)
    // return () => { document.title = APP_NAME; };
  }, [model]);

  useEffect(() => {
    setActiveTab(queryParams.get('tab') || 'overview');
  }, [location.search]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`${location.pathname}?tab=${tab}`, { replace: true });
  };

  useEffect(() => {
    if (!modelId) return;
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const modelData = await marketplaceService.getModelById(modelId);
        if (!modelData) {
          setError('Model not found.');
          setModel(null);
        } else {
          setModel(modelData);
          const reviewsData = await marketplaceService.getReviewsByModelId(modelId);
          setReviews(reviewsData);
        }
      } catch (err) {
        setError('Failed to fetch model details.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [modelId]);

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser || currentUser.accountType === 'guest' || !newReviewText || newReviewRating === 0 || !model) return;
    
    setIsSubmittingReview(true);
    try {
      const submittedReview = await marketplaceService.submitReview({
        modelId: model.id,
        userId: currentUser.id,
        rating: newReviewRating,
        comment: newReviewText,
      }, currentUser);
      setReviews(prevReviews => [submittedReview, ...prevReviews]);
      // Update model's rating (simplified - full update should be backend driven)
      if (model) {
        const updatedTotalReviews = model.totalReviews + 1;
        const updatedAverageRating = ((model.averageRating * model.totalReviews) + submittedReview.rating) / updatedTotalReviews;
        setModel(prevModel => prevModel ? {...prevModel, totalReviews: updatedTotalReviews, averageRating: updatedAverageRating} : null);
      }
      setNewReviewText('');
      setNewReviewRating(0);
    } catch (err) {
      console.error("Failed to submit review", err);
      // Show error to user
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]"><LoadingSpinner size="lg" text="Loading model details..." /></div>;
  }

  if (error || !model) {
    return <div className="text-center text-red-500 py-10">{error || 'Model data is unavailable.'}</div>;
  }
  
  const tabItems = [
    { id: 'overview', label: 'Overview' },
    ...(model.playgroundEnabled ? [{ id: 'playground', label: 'Playground' }] : []),
    ...(model.codeSnippets && model.codeSnippets.length > 0 ? [{ id: 'usage', label: 'Usage Guide' }] : []),
    ...(model.versions && model.versions.length > 0 ? [{ id: 'versions', label: 'Version History' }] : []),
    ...(model.pricingTiers && model.pricingTiers.length > 0 ? [{ id: 'pricing', label: 'Pricing' }] : []),
    { id: 'reviews', label: `Reviews (${model.totalReviews})` },
    // { id: 'discussion', label: 'Discussion' }, // Mocked for now
  ];


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8 p-6 bg-card-light dark:bg-card-dark rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row gap-6">
          <img src={model.imageUrl || DEFAULT_MODEL_IMAGE} alt={model.name} className="w-full md:w-1/3 h-auto object-cover rounded-md" />
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-2">{model.name}</h1>
            <p className="text-md text-text-muted-light dark:text-text-muted-dark mb-1">
              By: <a href={model.creatorUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-primary-DEFAULT hover:underline">{model.creator}</a>
            </p>
            <div className="flex items-center space-x-4 mb-3">
              <StarRatingComponent rating={model.averageRating} size={24} showText />
              <span className="text-sm text-text-muted-light dark:text-text-muted-dark">({model.totalReviews} reviews)</span>
            </div>
            <p className="text-sm text-text-light dark:text-text-dark mb-4">{model.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-primary-DEFAULT/10 text-primary-dark dark:bg-primary-light/10 dark:text-primary-light text-xs font-semibold rounded-full">{model.category}</span>
              <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full">{model.license}</span>
              {model.architecture && <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full">{model.architecture}</span>}
            </div>
             <div className="flex items-center space-x-3">
                {model.githubUrl && (
                  <a href={model.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-text-light dark:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-700">
                    <LinkIcon size={16} className="mr-2" /> GitHub
                  </a>
                )}
                {/* Mock download */}
                {model.modelFileUrl && (
                    <a href={model.modelFileUrl || '#'} download className="inline-flex items-center px-4 py-2 bg-secondary-DEFAULT hover:bg-secondary-dark text-white rounded-md text-sm font-medium">
                        <ArrowDownTrayIcon size={16} className="mr-2" /> Download Model
                    </a>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-primary-DEFAULT text-primary-DEFAULT'
                  : 'border-transparent text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:border-gray-300 dark:hover:border-gray-600'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-card-light dark:bg-card-dark rounded-lg shadow p-6 min-h-[300px]">
        {activeTab === 'overview' && (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-text-light dark:text-text-dark">Model Overview</h3>
            <p className="text-text-light dark:text-text-dark whitespace-pre-line">{model.longDescription || model.description}</p>
            <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2 text-text-light dark:text-text-dark">Tags</h4>
                <div className="flex flex-wrap gap-2">
                {model.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full">{tag}</span>
                ))}
                </div>
            </div>
             {model.benchmarks && model.benchmarks.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2 text-text-light dark:text-text-dark">Performance Benchmarks</h4>
                <ul className="list-disc list-inside space-y-1 text-text-light dark:text-text-dark">
                  {model.benchmarks.map(bm => <li key={bm.metric}>{bm.metric}: <strong>{bm.value}</strong></li>)}
                </ul>
              </div>
            )}
            {model.fineTuneOptions && model.fineTuneOptions.length > 0 && (
                <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-2 text-text-light dark:text-text-dark">Fine-tuning Options</h4>
                    <ul className="list-disc list-inside space-y-1 text-text-light dark:text-text-dark">
                        {model.fineTuneOptions.map(opt => <li key={opt}>{opt}</li>)}
                    </ul>
                </div>
            )}
          </div>
        )}

        {activeTab === 'playground' && model.playgroundEnabled && (
          <InteractivePlayground model={model} />
        )}

        {activeTab === 'usage' && model.codeSnippets && model.codeSnippets.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-text-light dark:text-text-dark">Usage Guide</h3>
            <CodeSnippetDisplay snippets={model.codeSnippets} />
          </div>
        )}
        
        {activeTab === 'versions' && model.versions && model.versions.length > 0 && (
            <div>
                <h3 className="text-xl font-semibold mb-4 text-text-light dark:text-text-dark">Version History</h3>
                <div className="space-y-4">
                    {model.versions.map(version => (
                        <div key={version.version} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                            <h4 className="font-semibold text-text-light dark:text-text-dark">Version {version.version} <span className="text-sm text-text-muted-light dark:text-text-muted-dark">({version.date})</span></h4>
                            <p className="text-sm text-text-light dark:text-text-dark mt-1 whitespace-pre-line">{version.changelog}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'pricing' && model.pricingTiers && model.pricingTiers.length > 0 && (
            <div>
                <h3 className="text-xl font-semibold mb-4 text-text-light dark:text-text-dark">Pricing Plans</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {model.pricingTiers.map(tier => (
                        <div key={tier.name} className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col">
                            <h4 className="text-lg font-semibold text-primary-DEFAULT dark:text-primary-light">{tier.name}</h4>
                            <p className="text-2xl font-bold my-2 text-text-light dark:text-text-dark">{tier.price}</p>
                            <ul className="space-y-2 text-sm text-text-muted-light dark:text-text-muted-dark mb-6 flex-grow">
                                {tier.features.map(feature => <li key={feature} className="flex items-center"><CheckIcon className="text-green-500 mr-2 flex-shrink-0" size={16}/>{feature}</li>)}
                            </ul>
                            <button className="w-full mt-auto px-4 py-2 bg-primary-DEFAULT text-white rounded-md hover:bg-primary-dark transition-colors">
                                {tier.price.toLowerCase() === 'contact us' ? 'Contact Sales' : 'Get Started'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <h3 className="text-xl font-semibold mb-6 text-text-light dark:text-text-dark">User Reviews</h3>
            {/* Submit Review Form */}
            {currentUser && currentUser.accountType !== 'guest' && (
              <form onSubmit={handleReviewSubmit} className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="text-lg font-semibold mb-2 text-text-light dark:text-text-dark">Leave a Review</h4>
                <div className="mb-3">
                  <label htmlFor="rating" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Rating:</label>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button type="button" key={star} onClick={() => setNewReviewRating(star)} className="focus:outline-none">
                        <StarIcon size={28} filled={star <= newReviewRating} className={`cursor-pointer ${star <= newReviewRating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="comment" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Comment:</label>
                  <textarea
                    id="comment"
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-primary-DEFAULT focus:border-primary-DEFAULT"
                    required
                  />
                </div>
                <button type="submit" disabled={isSubmittingReview || newReviewRating === 0} className="px-4 py-2 bg-primary-DEFAULT text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50">
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
             {currentUser && currentUser.accountType === 'guest' && (
              <p className="mb-6 text-sm p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-md text-yellow-700 dark:text-yellow-300">
                Please <button onClick={() => navigate('/login')} className="font-semibold underline hover:text-yellow-600 dark:hover:text-yellow-200">log in</button> to leave a review.
              </p>
            )}

            {/* Display Reviews */}
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map(review => (
                  <div key={review.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                    <div className="flex items-start space-x-3">
                       <img src={review.avatarUrl || DEFAULT_USER_AVATAR} alt={review.username} className="w-10 h-10 rounded-full" />
                       <div>
                          <div className="flex items-center space-x-2">
                            <h5 className="font-semibold text-text-light dark:text-text-dark">{review.username}</h5>
                            <span className="text-xs text-text-muted-light dark:text-text-muted-dark">{new Date(review.date).toLocaleDateString()}</span>
                          </div>
                          <StarRatingComponent rating={review.rating} size={16} />
                          <p className="mt-2 text-sm text-text-light dark:text-text-dark">{review.comment}</p>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-muted-light dark:text-text-muted-dark">No reviews yet for this model.</p>
            )}
          </div>
        )}
        
        {/* {activeTab === 'discussion' && (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-text-light dark:text-text-dark">Community Discussion</h3>
            <p className="text-text-muted-light dark:text-text-muted-dark">Feature coming soon. Discuss tips, ask questions, and share your experiences with this model.</p>
          </div>
        )} */}

      </div>
    </div>
  );
};

export default ModelDetailPage;