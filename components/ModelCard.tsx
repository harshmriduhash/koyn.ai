
import React from 'react';
import { Link } from 'react-router-dom';
import { Model } from '../types';
import { DEFAULT_MODEL_IMAGE } from '../constants';
import StarRating from './StarRating';
import { CodeBracketIcon, ArrowDownTrayIcon, LinkIcon } from './IconComponents';

interface ModelCardProps {
  model: Model;
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  return (
    <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col">
      <Link to={`/models/${model.id}`} className="block">
        <img 
          src={model.imageUrl || DEFAULT_MODEL_IMAGE} 
          alt={model.name} 
          className="w-full h-48 object-cover" 
        />
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <Link to={`/models/${model.id}`} className="block">
          <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2 truncate hover:text-primary-DEFAULT dark:hover:text-primary-light">{model.name}</h3>
        </Link>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-1">
          By: <a 
                href={model.creatorUrl || '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary-DEFAULT hover:underline"
                onClick={(e) => { if(model.creatorUrl) e.stopPropagation();}} // prevent navigation to model detail if clicking creator
              >
                {model.creator}
              </a>
        </p>
        <p className="text-xs text-text-muted-light dark:text-text-muted-dark mb-3 h-10 overflow-hidden text-ellipsis">
          {model.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <StarRating rating={model.averageRating} size={18} />
          <span className="text-xs text-text-muted-light dark:text-text-muted-dark">{model.totalReviews} reviews</span>
        </div>

        <div className="mb-4">
          <span className="inline-block bg-primary-DEFAULT/10 text-primary-dark dark:bg-primary-light/10 dark:text-primary-light text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {model.category}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-text-muted-light dark:text-text-muted-dark mb-4">
          <span>{model.license}</span>
          <span className="font-semibold text-secondary-DEFAULT dark:text-secondary-light">{model.costIndicator}</span>
        </div>
        
        {model.tags && model.tags.length > 0 && (
          <div className="mb-4 space-x-1">
            {model.tags.slice(0, 3).map(tag => (
              <span key={tag} className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between space-x-2">
            <Link
              to={`/models/${model.id}`}
              className="flex-1 text-center px-4 py-2 text-sm font-medium text-white bg-primary-DEFAULT hover:bg-primary-dark rounded-md transition-colors"
            >
              View Details
            </Link>
            {model.playgroundEnabled && (
              <Link
                to={`/models/${model.id}?tab=playground`}
                className="p-2 text-text-muted-light dark:text-text-muted-dark hover:text-primary-DEFAULT dark:hover:text-primary-light rounded-md"
                title="Interactive Playground"
              >
                <CodeBracketIcon size={20} />
              </Link>
            )}
            {model.githubUrl && (
              <a
                href={model.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-text-muted-light dark:text-text-muted-dark hover:text-primary-DEFAULT dark:hover:text-primary-light rounded-md"
                title="View on GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;
