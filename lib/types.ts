export interface Place {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  province: string | null;
  district: string | null;
  latitude: number;
  longitude: number;
  category: string;
  historical_period: string | null;
  image_url: string | null;
  featured: boolean;
}

export interface Person {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  role: string | null;
  community: string | null;
  province: string | null;
  image_url: string | null;
  birth_year: number | null;
  death_year: number | null;
  featured: boolean;
}

export interface Story {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string | null;
  content_type: string;
  category: string;
  language: string;
  community: string | null;
  historical_period: string | null;
  place_id: string | null;
  person_id: string | null;
  place?: Place | null;
  person?: Person | null;
  image_url: string | null;
  audio_url: string | null;
  video_url: string | null;
  verification_status: string;
  visibility: string;
  interviewee: string | null;
  interviewer: string | null;
  interview_date: string | null;
  topics: string[] | null;
  sources: string | null;
  featured: boolean;
  view_count: number;
  created_at: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  image_url: string | null;
  featured: boolean;
  collection_items?: CollectionItem[];
}

export interface CollectionItem {
  id: string;
  collection_id: string;
  story_id: string | null;
  place_id: string | null;
  person_id: string | null;
  item_type: string;
  sort_order: number;
}

export interface Creator {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  category: string;
  skills: string[] | null;
  community: string | null;
  province: string | null;
  image_url: string | null;
  portfolio_images: string[] | null;
  story_id: string | null;
  story?: Story | null;
  featured: boolean;
}

export interface EducationalResource {
  id: string;
  title: string;
  slug: string;
  description: string;
  subject: string;
  grade: string;
  topic: string | null;
  curriculum_objective: string | null;
  learning_outcomes: string | null;
  difficulty: string;
  language: string;
  estimated_duration: string | null;
  resource_type: string;
  content: string | null;
  story_id: string | null;
  story?: Story | null;
  image_url: string | null;
  featured: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  subject: string;
  grade: string;
  resource_id: string | null;
  story_id: string | null;
  passing_score: number;
  quiz_questions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string | null;
  sort_order: number;
}

export interface Submission {
  id: string;
  title: string;
  content_type: string;
  description: string | null;
  contributor_name: string;
  contributor_email: string | null;
  community: string | null;
  language: string | null;
  province: string | null;
  place_name: string | null;
  place_id: string | null;
  status: string;
  image_url: string | null;
  consent_given: boolean;
  admin_notes: string | null;
  created_at: string;
  verification_records?: VerificationRecord[];
}

export interface VerificationRecord {
  id: string;
  submission_id: string;
  story_id: string | null;
  stage: string;
  reviewer_name: string | null;
  notes: string | null;
  status: string;
  created_at: string;
}

export const VERIFICATION_STAGES = [
  'draft',
  'submitted',
  'ai_processed',
  'research_review',
  'community_review',
  'elder_review',
  'verified',
  'published',
  'restricted',
  'rejected',
] as const;

export const VERIFICATION_LABELS: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  ai_processed: 'AI Processed',
  research_review: 'Research Review',
  community_review: 'Community Review',
  elder_review: 'Elder Review',
  verified: 'Verified',
  published: 'Published',
  restricted: 'Restricted',
  rejected: 'Rejected',
};

export const VERIFICATION_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  submitted: 'bg-blue-100 text-blue-700',
  ai_processed: 'bg-cyan-100 text-cyan-700',
  research_review: 'bg-amber-100 text-amber-700',
  community_review: 'bg-orange-100 text-orange-700',
  elder_review: 'bg-purple-100 text-purple-700',
  verified: 'bg-green-100 text-green-700',
  published: 'bg-emerald-100 text-emerald-700',
  restricted: 'bg-red-100 text-red-700',
  rejected: 'bg-red-100 text-red-700',
};

export const CONTENT_TYPES: Record<string, string> = {
  story: 'Story',
  oral_history: 'Oral History',
  artwork: 'Artwork',
  music: 'Music',
  craft: 'Craft',
  photo: 'Photo',
  event: 'Event',
  tradition: 'Tradition',
};

export const CATEGORIES: Record<string, string> = {
  heritage: 'Heritage',
  education: 'Education',
  community: 'Community',
  creators: 'Creators',
};

// --- Marketplace (Lost Legacy Digital) ---

export type ProductType = 'digital' | 'physical' | 'service' | 'experience';

export interface MarketplaceCreator {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  bio: string;
  location: string;
  province: string;
  languages: string[];
  image_url: string | null;
  verification_status: 'unverified' | 'verified';
  earned: number;
  productsSold: number;
  customers: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  type: ProductType;
  category: string;
  price: number;
  currency: string;
  image_url: string;
  description: string;
  culturalContext: string;
  language: string;
  region: string;
  creatorId: string;
  creator?: MarketplaceCreator;
  verification_status: 'unverified' | 'verified';
  rating: number | null;
  reviewCount: number;
  isDemo: true;
}

export const MARKETPLACE_CATEGORIES = [
  'History',
  'Oral History',
  'Food',
  'Music',
  'Art',
  'Craft',
  'Poetry',
  'Literature',
  'Traditional Knowledge',
  'Language',
  'Education',
  'Fashion',
  'Photography',
  'Film',
  'Tourism',
  'Experiences',
] as const;

export const REGIONS = [
  'Harare',
  'Bulawayo',
  'Mashonaland Central',
  'Mashonaland East',
  'Mashonaland West',
  'Manicaland',
  'Masvingo',
  'Matabeleland North',
  'Matabeleland South',
  'Midlands',
] as const;

export const LANGUAGES = [
  'Shona',
  'Ndebele',
  'English',
  'Tonga',
  'Chewa',
  'Kalanga',
  'Venda',
] as const;

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  digital: 'Digital',
  physical: 'Physical',
  service: 'Service',
  experience: 'Experience',
};
