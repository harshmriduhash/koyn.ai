
import { ModelCategory, LicenseType, ModelArchitecture } from './types';

export const APP_NAME = "AI Model Hub";

export const CATEGORY_OPTIONS = Object.values(ModelCategory);
export const LICENSE_OPTIONS = Object.values(LicenseType);
export const ARCHITECTURE_OPTIONS = Object.values(ModelArchitecture);

export const PRICING_FILTER_OPTIONS = [
  { value: 'all', label: 'All Pricing' },
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
  { value: 'open-source', label: 'Open Source' },
];

export const SORT_OPTIONS = [
  { value: 'rating', label: 'Rating' },
  { value: 'popularity', label: 'Popularity (Reviews)' },
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' },
  { value: 'newest', label: 'Newest' },
];

export const DEFAULT_USER_AVATAR = 'https://picsum.photos/seed/user/100/100';
export const DEFAULT_MODEL_IMAGE = 'https://picsum.photos/seed/model/400/300';

export const LANGUAGES_FOR_BOILERPLATE = [
  { value: 'javascript', label: 'JavaScript (Fetch)' },
  { value: 'python', label: 'Python (Requests)' },
  { value: 'curl', label: 'cURL' },
];
