export type SkillCategory =
  | 'All'
  | 'Programming'
  | 'Design'
  | 'Communication'
  | 'Business'
  | 'Music'
  | 'Photography'
  | 'Video Editing'
  | 'Academics'
  | 'Sports'
  | 'Languages'
  | 'Other';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';
export type ExchangeStatus = 'active' | 'completed' | 'cancelled';

export type NotificationType =
  | 'request'
  | 'accepted'
  | 'rejected'
  | 'message'
  | 'reminder'
  | 'completed'
  | 'review';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  college: string;
  department: string;
  semester: string;
  bio: string;
  rating: number;
  reviewCount: number;
  completedExchanges: number;
  availability: string;
  interests: string[];
  createdAt: string;
}

export interface SkillOffer {
  id: string;
  userId: string;
  skillName: string;
  category: SkillCategory;
  level: SkillLevel;
  availability: string;
  experience: string;
  description: string;
}

export interface SkillWant {
  id: string;
  userId: string;
  skillName: string;
  category: SkillCategory;
  desiredLevel: SkillLevel;
}

export interface ExchangeRequest {
  id: string;
  senderId: string;
  receiverId: string;
  skillOfferedId: string;
  skillRequestedId: string;
  message: string;
  preferredSchedule: string;
  status: RequestStatus;
  createdAt: string;
}

export interface Exchange {
  id: string;
  requestId: string;
  student1Id: string; // Current user or sender
  student2Id: string; // Partner
  skill1Id: string; // Skill taught by student1
  skill2Id: string; // Skill taught by student2
  status: ExchangeStatus;
  progress: number; // 0 to 100
  completedSessions: number;
  totalSessions: number;
  startDate: string;
  completedAt?: string;
}

export interface Message {
  id: string;
  exchangeId: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
  isRead: boolean;
  timestamp: string;
}

export interface Review {
  id: string;
  exchangeId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  timestamp: string;
}

export interface Session {
  id: string;
  exchangeId: string;
  title: string;
  date: string;
  time: string;
  isCompleted: boolean;
  notes?: string;
}

export interface FilterState {
  searchQuery: string;
  category: SkillCategory;
  skillLevel: string;
  department: string;
  semester: string;
  availability: string;
  compatibilityOnly: boolean;
}

export interface MatchResult {
  score: number; // 0 to 100
  label: string;
  isTwoWay: boolean;
  matchingSkillOffered?: SkillOffer;
  matchingSkillWanted?: SkillWant;
}

export type ScreenId =
  | 'SPLASH'               // 01
  | 'ONBOARDING'           // 02
  | 'LOGIN'                // 03
  | 'SIGNUP'               // 04
  | 'PROFILE_SETUP'        // 05
  | 'HOME'                 // 06
  | 'EXPLORE'              // 07
  | 'FILTERS'              // 08
  | 'SKILL_DETAILS'        // 09
  | 'STUDENT_PROFILE'      // 10
  | 'REQUEST_EXCHANGE'     // 11
  | 'EXCHANGE_REQUESTS'    // 12
  | 'MATCHED_EXCHANGE'     // 13
  | 'CHAT'                 // 14
  | 'MY_EXCHANGES'         // 15
  | 'LEARNING_PROGRESS'    // 16
  | 'MY_SKILLS'            // 17
  | 'RATINGS_REVIEWS'      // 18
  | 'NOTIFICATIONS'        // 19
  | 'PROFILE'              // 20
  | 'SETTINGS';            // 21
