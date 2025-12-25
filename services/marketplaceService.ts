
import { Model, Review, ModelCategory, LicenseType, ModelArchitecture, User, ApiKey, UsageStat, CodeSnippet, VersionInfo, PerformanceBenchmark, PricingTier } from '../types';
import { DEFAULT_MODEL_IMAGE, DEFAULT_USER_AVATAR } from '../constants';

const generateId = () => Math.random().toString(36).substr(2, 9);

const sampleCodeSnippets: CodeSnippet[] = [
  { 
    language: 'python',
    label: 'Python',
    code: `import requests
import json

API_URL = "https://api.example.com/v1/models/model-123/predict"
API_KEY = "YOUR_API_KEY"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

payload = {
    "text": "Translate this text to French."
}

try:
    response = requests.post(API_URL, headers=headers, json=payload)
    response.raise_for_status()  # Raises an exception for bad status codes
    result = response.json()
    print("Model Prediction:", result.get('translation'))
except requests.exceptions.RequestException as e:
    print(f"Error: {e}")`
  },
  {
    language: 'javascript',
    label: 'JavaScript',
    code: `const API_URL = "https://api.example.com/v1/models/model-123/predict";
const API_KEY = "YOUR_API_KEY";

async function getPrediction(text) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${API_KEY}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: text })
    });

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    const result = await response.json();
    console.log("Model Prediction:", result.translation);
    return result;
  } catch (error) {
    console.error("Error fetching prediction:", error);
  }
}

getPrediction("Translate this text to French.");`
  },
  {
    language: 'curl',
    label: 'cURL',
    code: `curl -X POST \\
  https://api.example.com/v1/models/model-123/predict \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Translate this text to French."
  }'`
  }
];

const sampleVersions: VersionInfo[] = [
  { version: '1.2.0', date: '2024-07-15', changelog: 'Improved accuracy for French translations. Added support for Spanish.' },
  { version: '1.1.0', date: '2024-05-01', changelog: 'Enhanced speed and reduced latency.' },
  { version: '1.0.0', date: '2024-03-01', changelog: 'Initial release.' },
];

const sampleBenchmarks: PerformanceBenchmark[] = [
    { metric: 'Accuracy (BLEU)', value: '28.5' },
    { metric: 'Latency (p95)', value: '150ms' },
    { metric: 'Supported Languages', value: '10+' }
];

const samplePricingTiers: PricingTier[] = [
    { name: 'Free', price: '$0/month', features: ['1,000 requests/month', 'Basic support'] },
    { name: 'Pro', price: '$49/month', features: ['100,000 requests/month', 'Priority support', 'Access to new features'] },
    { name: 'Enterprise', price: 'Contact Us', features: ['Unlimited requests', 'Dedicated support', 'Custom SLAs'] }
];

const mockModels: Model[] = [
  {
    id: 'gpt-summarizer-pro',
    name: 'GPT Summarizer Pro',
    creator: 'AI Innovations Inc.',
    creatorUrl: 'https://example.com/ai-innovations',
    description: 'Advanced GPT-based model for summarizing long texts and documents with high accuracy.',
    longDescription: 'GPT Summarizer Pro leverages state-of-the-art transformer architecture to provide concise and contextually relevant summaries. It supports multiple languages and can handle various document formats. Ideal for research, content creation, and information retrieval.',
    category: ModelCategory.NLP,
    architecture: ModelArchitecture.TRANSFORMER,
    license: LicenseType.COMMERCIAL,
    benchmarks: [{ metric: 'ROUGE-L', value: '45.2' }, { metric: 'Speed', value: '500 words/sec' }],
    costIndicator: '$0.005/1k tokens',
    tags: ['summarization', 'gpt', 'nlp', 'text-analysis', 'document-processing'],
    averageRating: 4.8,
    totalReviews: 125,
    imageUrl: `https://picsum.photos/seed/gpt-summarizer/400/300`,
    playgroundEnabled: true,
    codeSnippets: sampleCodeSnippets,
    versions: sampleVersions,
    pricingTiers: samplePricingTiers,
    fineTuneOptions: ['Dataset upload', 'LoRA adaptation'],
    githubUrl: 'https://github.com/example/gpt-summarizer-pro'
  },
  {
    id: 'vision-object-detector-x',
    name: 'Vision Object Detector X',
    creator: 'CV Solutions Ltd.',
    description: 'High-performance object detection model for real-time applications.',
    longDescription: 'Vision Object Detector X is built on a highly optimized CNN architecture, capable of identifying over 1000 common objects with impressive speed and accuracy. Suitable for robotics, surveillance, and autonomous systems.',
    category: ModelCategory.CV,
    architecture: ModelArchitecture.CNN,
    license: LicenseType.APACHE2,
    benchmarks: [{ metric: 'mAP @ .50 IOU', value: '78.5%' }, { metric: 'FPS (on GPU)', value: '60' }],
    costIndicator: 'Free (Open Source)',
    tags: ['object-detection', 'computer-vision', 'cnn', 'real-time', 'open-source'],
    averageRating: 4.5,
    totalReviews: 88,
    imageUrl: `https://picsum.photos/seed/vision-detector/400/300`,
    playgroundEnabled: true,
    codeSnippets: sampleCodeSnippets.map(s => ({...s, code: s.code.replace(/text/g, 'image_url').replace(/Translate this text to French/g, 'Detect objects in this image')})),
    githubUrl: 'https://github.com/example/vision-object-detector-x'
  },
  {
    id: 'audio-speech-to-text-hq',
    name: 'Audio Speech-to-Text HQ',
    creator: 'SoundAI Labs',
    description: 'Accurate speech recognition for various audio inputs and languages.',
    category: ModelCategory.AUDIO,
    architecture: ModelArchitecture.TRANSFORMER,
    license: LicenseType.PROPRIETARY,
    benchmarks: [{ metric: 'Word Error Rate (WER)', value: '5.2%' }, { metric: 'Real-time Factor', value: '0.3' }],
    costIndicator: '$0.01/min audio',
    tags: ['speech-recognition', 'asr', 'audio-processing', 'transcription'],
    averageRating: 4.7,
    totalReviews: 95,
    imageUrl: `https://picsum.photos/seed/audio-stt/400/300`,
    playgroundEnabled: false,
    pricingTiers: [
        { name: 'Pay-as-you-go', price: '$0.01/minute', features: ['Standard accuracy', 'Community support'] },
        { name: 'Professional', price: '$99/month', features: ['10,000 minutes included', 'Higher accuracy', 'Email support'] },
    ]
  },
  {
    id: 'rl-trader-bot',
    name: 'RL Trader Bot Alpha',
    creator: 'FinTech RL',
    description: 'Reinforcement learning agent for automated stock trading strategies.',
    category: ModelCategory.RL,
    architecture: ModelArchitecture.RNN, // Or custom RL architecture
    license: LicenseType.PROPRIETARY,
    benchmarks: [{ metric: 'Simulated Annual Return', value: '15.7%' }, { metric: 'Sharpe Ratio', value: '1.2' }],
    costIndicator: 'Subscription-based',
    tags: ['rl', 'trading', 'finance', 'automation', 'agent'],
    averageRating: 4.2,
    totalReviews: 45,
    imageUrl: `https://picsum.photos/seed/rl-trader/400/300`,
  },
   {
    id: 'llama3-chat-tuned',
    name: 'LLaMA 3 Chat (Fine-Tuned)',
    creator: 'Community Contributor',
    creatorUrl: 'https://github.com/community-contributor',
    description: 'A fine-tuned version of LLaMA 3 for conversational AI and chatbot applications.',
    longDescription: 'This model is a community fine-tuned version of LLaMA 3, optimized for engaging and coherent chat interactions. It exhibits strong performance in multi-turn dialogues and creative text generation. Ideal for chatbots, virtual assistants, and interactive storytelling.',
    category: ModelCategory.NLP,
    architecture: ModelArchitecture.LLAMA,
    license: LicenseType.OPENRAIL, 
    benchmarks: [{ metric: 'ChatEval Score', value: '8.5/10' }, { metric: 'Response Fluency', value: 'High' }],
    costIndicator: 'Open Source / Free to run',
    tags: ['llama3', 'chatbot', 'conversational-ai', 'fine-tuned', 'open-source'],
    averageRating: 4.9,
    totalReviews: 210,
    imageUrl: `https://picsum.photos/seed/llama3-chat/400/300`,
    playgroundEnabled: true,
    codeSnippets: sampleCodeSnippets,
    versions: [{ version: '1.0-tuned', date: '2024-06-20', changelog: 'Initial fine-tuned release based on LLaMA 3 8B.' }],
    githubUrl: 'https://github.com/example/llama3-chat-tuned'
  },
  {
    id: 'multimodal-composer',
    name: 'Multimodal Composer',
    creator: 'Synergy AI',
    description: 'Generates text descriptions for images and images from text prompts.',
    longDescription: 'The Multimodal Composer bridges the gap between visual and textual data. It can generate rich, detailed descriptions for input images, or create novel images based on textual prompts. Powered by a sophisticated fusion of vision transformers and language models.',
    category: ModelCategory.MULTIMODAL,
    architecture: ModelArchitecture.TRANSFORMER, // Typically a combination
    license: LicenseType.COMMERCIAL,
    benchmarks: [{ metric: 'CLIP Score (Text-to-Image)', value: '0.32' }, { metric: 'BLEU-4 (Image-to-Text)', value: '35.0' }],
    costIndicator: '$0.02/generation',
    tags: ['multimodal', 'text-to-image', 'image-to-text', 'generative-ai', 'cv', 'nlp'],
    averageRating: 4.6,
    totalReviews: 75,
    imageUrl: `https://picsum.photos/seed/multimodal-composer/400/300`,
    playgroundEnabled: true,
    pricingTiers: samplePricingTiers,
    codeSnippets: sampleCodeSnippets.map(s => ({...s, code: s.code.replace('Translate this text to French.', 'Generate an image of a red cat on a blue mat.')}))
  }
];

const mockReviews: Review[] = [
  { id: 'rev1', modelId: 'gpt-summarizer-pro', userId: 'user1', username: 'Alice Wonderland', avatarUrl: `https://picsum.photos/seed/alice/40/40`, rating: 5, comment: 'Amazingly accurate summaries! Saves me so much time.', date: '2024-07-20' },
  { id: 'rev2', modelId: 'gpt-summarizer-pro', userId: 'user2', username: 'Bob The Builder', avatarUrl: `https://picsum.photos/seed/bob/40/40`, rating: 4, comment: 'Very good, occasionally misses some nuances in highly technical texts.', date: '2024-07-18' },
  { id: 'rev3', modelId: 'vision-object-detector-x', userId: 'user3', username: 'Charlie Brown', avatarUrl: `https://picsum.photos/seed/charlie/40/40`, rating: 5, comment: 'Incredibly fast and easy to integrate. The open-source license is a huge plus!', date: '2024-07-19' },
  { id: 'rev4', modelId: 'llama3-chat-tuned', userId: 'user1', username: 'Alice Wonderland', avatarUrl: `https://picsum.photos/seed/alice/40/40`, rating: 5, comment: 'This LLaMA 3 fine-tune is fantastic for chatbots. Very coherent.', date: '2024-07-22' },
  { id: 'rev5', modelId: 'llama3-chat-tuned', userId: 'user4', username: 'Diana Prince', avatarUrl: `https://picsum.photos/seed/diana/40/40`, rating: 4, comment: 'Great conversational flow, though sometimes it can be a bit verbose.', date: '2024-07-21' },
];

const mockApiKeys: ApiKey[] = [
    { id: generateId(), key: `sk-${generateId()}${generateId()}`, createdAt: '2024-06-01', lastUsed: '2024-07-20', scopes: ['read:models', 'predict:gpt-summarizer-pro'] },
    { id: generateId(), key: `sk-${generateId()}${generateId()}`, createdAt: '2024-07-15', scopes: ['read:models'] },
];

const mockUsageStats: UsageStat[] = [
    { date: '2024-07-01', requests: 1200, cost: 6.00 },
    { date: '2024-07-02', requests: 1500, cost: 7.50 },
    { date: '2024-07-03', requests: 1350, cost: 6.75 },
    // ... more data
];


export const marketplaceService = {
  getModels: async (): Promise<Model[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockModels), 500));
  },
  getModelById: async (id: string): Promise<Model | undefined> => {
    return new Promise(resolve => setTimeout(() => resolve(mockModels.find(m => m.id === id)), 300));
  },
  getReviewsByModelId: async (modelId: string): Promise<Review[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockReviews.filter(r => r.modelId === modelId)), 200));
  },
  submitReview: async (review: Omit<Review, 'id' | 'username' | 'avatarUrl' | 'date'>, user: User): Promise<Review> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const newReview: Review = {
          ...review,
          id: generateId(),
          username: user.username,
          avatarUrl: user.avatarUrl || DEFAULT_USER_AVATAR,
          date: new Date().toISOString().split('T')[0],
        };
        mockReviews.push(newReview);
        // Update model's review count and average rating (simplified)
        const model = mockModels.find(m => m.id === review.modelId);
        if (model) {
            const existingReviews = mockReviews.filter(r => r.modelId === model.id);
            model.totalReviews = existingReviews.length;
            model.averageRating = existingReviews.reduce((acc, curr) => acc + curr.rating, 0) / model.totalReviews;
        }
        resolve(newReview);
      }, 400);
    });
  },
  getApiKeys: async (userId: string): Promise<ApiKey[]> => {
      // In a real app, filter by userId
      return new Promise(resolve => setTimeout(() => resolve(mockApiKeys), 300));
  },
  createApiKey: async (userId: string, scopes: string[]): Promise<ApiKey> => {
      return new Promise(resolve => {
          setTimeout(() => {
              const newKey: ApiKey = {
                  id: generateId(),
                  key: `sk-${generateId()}${generateId()}`,
                  createdAt: new Date().toISOString().split('T')[0],
                  scopes,
              };
              mockApiKeys.push(newKey);
              resolve(newKey);
          }, 400);
      });
  },
  deleteApiKey: async (userId: string, keyId: string): Promise<boolean> => {
      return new Promise(resolve => {
          setTimeout(() => {
              const index = mockApiKeys.findIndex(k => k.id === keyId);
              if (index > -1) {
                  mockApiKeys.splice(index, 1);
                  resolve(true);
              } else {
                  resolve(false);
              }
          }, 300);
      });
  },
  getUsageStats: async (userId: string, period: '7d' | '30d' | '90d'): Promise<UsageStat[]> => {
      // Simulate fetching based on period - for now, return all
      return new Promise(resolve => setTimeout(() => resolve(mockUsageStats.slice(- (parseInt(period) || 30) )), 500));
  },
  uploadModel: async (modelData: Partial<Model>, user: User): Promise<Model> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const newModel: Model = {
          id: modelData.name?.toLowerCase().replace(/\s+/g, '-') || generateId(),
          name: modelData.name || 'Untitled Model',
          creator: user.username,
          description: modelData.description || 'No description provided.',
          category: modelData.category || ModelCategory.NLP,
          license: modelData.license || LicenseType.PROPRIETARY,
          benchmarks: modelData.benchmarks || [],
          costIndicator: modelData.costIndicator || 'Not specified',
          tags: modelData.tags || [],
          averageRating: 0,
          totalReviews: 0,
          imageUrl: modelData.imageUrl || DEFAULT_MODEL_IMAGE,
          ...modelData, // Overwrite with provided fields
        };
        mockModels.unshift(newModel); // Add to the beginning of the list
        resolve(newModel);
      }, 800);
    });
  }
};
