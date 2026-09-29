import {
  User,
  SkillOffer,
  SkillWant,
  ExchangeRequest,
  Exchange,
  Message,
  NotificationItem,
  Review,
  Session,
} from '../types';

export const initialUsers: User[] = [
  {
    id: 'user-1',
    name: 'Rahul Sharma',
    email: 'rahul.s@rvce.edu.in',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
    college: 'RV College of Engineering',
    department: 'Computer Science & Eng',
    semester: '5th Sem',
    bio: 'Passionate full-stack techie & Python developer. Excited to exchange coding skills for UI/UX mastery and public speaking!',
    rating: 4.9,
    reviewCount: 14,
    completedExchanges: 6,
    availability: 'Weekends & Evenings after 5 PM',
    interests: ['AI & ML', 'Open Source', 'UI Design', 'Public Speaking'],
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'user-2',
    name: 'Priya Patel',
    email: 'priya.p@rvce.edu.in',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    college: 'RV College of Engineering',
    department: 'Information Science',
    semester: '5th Sem',
    bio: 'Figma geek & Product Design enthusiast. I love crafting seamless mobile UI components and want to master backend Python scripts.',
    rating: 4.95,
    reviewCount: 22,
    completedExchanges: 9,
    availability: 'Mon/Wed/Fri after 4 PM',
    interests: ['Product Design', 'Micro-interactions', 'Python', 'User Research'],
    createdAt: '2026-02-01T14:30:00Z',
  },
  {
    id: 'user-3',
    name: 'Ananya Rao',
    email: 'ananya.r@bmsce.ac.in',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    college: 'BMS College of Engineering',
    department: 'Electronics & Comm',
    semester: '6th Sem',
    bio: 'Toastmasters president & communication coach. Looking to exchange public speaking sessions for data structures & C++ guidance.',
    rating: 4.88,
    reviewCount: 18,
    completedExchanges: 7,
    availability: 'Tuesday & Thursday Evenings',
    interests: ['Debating', 'C++', 'Public Speaking', 'Leadership'],
    createdAt: '2026-02-10T11:00:00Z',
  },
  {
    id: 'user-4',
    name: 'Vikram Singh',
    email: 'vikram.s@msrit.edu',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    college: 'MS Ramaiah Inst of Tech',
    department: 'Mechanical Eng',
    semester: '4th Sem',
    bio: 'Videographer & Premiere Pro editor. I create cinematic college reels and want to learn automated Excel scripting.',
    rating: 4.75,
    reviewCount: 11,
    completedExchanges: 4,
    availability: 'Saturday & Sunday Mornings',
    interests: ['Video Editing', 'Cinematography', 'Excel', 'Drone Footage'],
    createdAt: '2026-02-20T09:15:00Z',
  },
  {
    id: 'user-5',
    name: 'Sneha Kapoor',
    email: 'sneha.k@pes.edu',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    college: 'PES University',
    department: 'Business Admin',
    semester: '6th Sem',
    bio: 'Excel wizard and growth marketer. I teach advanced pivot tables and financial modeling in exchange for Video Editing tips.',
    rating: 4.92,
    reviewCount: 16,
    completedExchanges: 8,
    availability: 'Weekdays after 6 PM',
    interests: ['Excel', 'Marketing', 'Analytics', 'Public Speaking'],
    createdAt: '2026-03-01T16:00:00Z',
  },
  {
    id: 'user-6',
    name: 'Alex Chen',
    email: 'alex.c@rvce.edu.in',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    college: 'RV College of Engineering',
    department: 'Computer Science & Eng',
    semester: '7th Sem',
    bio: 'Mobile dev enthusiast building React Native apps. Acoustic guitar hobbyist looking to learn portrait photography.',
    rating: 4.85,
    reviewCount: 9,
    completedExchanges: 3,
    availability: 'Friday & Weekend Evenings',
    interests: ['Mobile Dev', 'Guitar', 'Photography', 'TypeScript'],
    createdAt: '2026-03-05T18:20:00Z',
  },
];

export const initialSkillOffers: SkillOffer[] = [
  // Rahul
  {
    id: 'offer-1',
    userId: 'user-1',
    skillName: 'Python & Data Structures',
    category: 'Programming',
    level: 'Advanced',
    availability: 'Weekends & Evenings',
    experience: '3+ years experience, built 8+ ML & web automation projects',
    description: 'Master Python fundamentals, OOP, Pandas, algorithms, and practical automation scripts.',
  },
  {
    id: 'offer-2',
    userId: 'user-1',
    skillName: 'C++ & Problem Solving',
    category: 'Programming',
    level: 'Advanced',
    availability: 'Flexible weekends',
    experience: '500+ LeetCode problems solved, competitive programmer',
    description: 'Clear concepts on STL containers, pointers, memory management, and interview DSA.',
  },

  // Priya
  {
    id: 'offer-3',
    userId: 'user-2',
    skillName: 'UI/UX Design & Figma',
    category: 'Design',
    level: 'Expert',
    availability: 'Mon/Wed/Fri after 4 PM',
    experience: 'Figma Community creator, designed 12+ mobile apps',
    description: 'Learn wireframing, auto-layout, design systems, interactive prototypes, and modern visual design principles.',
  },
  {
    id: 'offer-4',
    userId: 'user-2',
    skillName: 'Graphic Design Basics',
    category: 'Design',
    level: 'Intermediate',
    availability: 'Flexible evenings',
    experience: 'Created posters and visual branding for 4 college fest events',
    description: 'Typography, color theory, branding hierarchy, and poster creation techniques.',
  },

  // Ananya
  {
    id: 'offer-5',
    userId: 'user-3',
    skillName: 'Public Speaking & Presentation',
    category: 'Communication',
    level: 'Advanced',
    availability: 'Tuesday & Thursday Evenings',
    experience: 'President of College Toastmasters, winner of 5 inter-college debate contests',
    description: 'Overcome stage fear, master voice modulation, body language, and structured presentation skills.',
  },
  {
    id: 'offer-6',
    userId: 'user-3',
    skillName: 'Digital Marketing & Socials',
    category: 'Business',
    level: 'Intermediate',
    availability: 'Weekends',
    experience: 'Managed social channels with 15k+ followers for student organization',
    description: 'Social media growth tactics, SEO basics, content strategy, and brand engagement.',
  },

  // Vikram
  {
    id: 'offer-7',
    userId: 'user-4',
    skillName: 'Video Editing & Premiere Pro',
    category: 'Video Editing',
    level: 'Advanced',
    availability: 'Saturday & Sunday Mornings',
    experience: '2 years freelancing, edited 50+ YouTube & Instagram Reels videos',
    description: 'Cutting, color grading, sound design, transitions, keyframing, and video exporting best practices.',
  },

  // Sneha
  {
    id: 'offer-8',
    userId: 'user-5',
    skillName: 'Advanced Excel & Dashboards',
    category: 'Business',
    level: 'Expert',
    availability: 'Weekdays after 6 PM',
    experience: 'Corporate finance intern, created 20+ automated financial dashboards',
    description: 'VLOOKUP, XLOOKUP, INDEX-MATCH, Pivot Tables, Power Query, and interactive dashboard creation.',
  },

  // Alex
  {
    id: 'offer-9',
    userId: 'user-6',
    skillName: 'JavaScript & React Native',
    category: 'Programming',
    level: 'Expert',
    availability: 'Friday & Weekend Evenings',
    experience: 'Built 3 published Play Store apps, React core maintainer',
    description: 'Build native iOS/Android mobile applications using React Native, Redux, and custom hooks.',
  },
];

export const initialSkillWants: SkillWant[] = [
  // Rahul wants
  {
    id: 'want-1',
    userId: 'user-1',
    skillName: 'UI/UX Design & Figma',
    category: 'Design',
    desiredLevel: 'Beginner',
  },
  {
    id: 'want-2',
    userId: 'user-1',
    skillName: 'Public Speaking & Presentation',
    category: 'Communication',
    desiredLevel: 'Intermediate',
  },

  // Priya wants
  {
    id: 'want-3',
    userId: 'user-2',
    skillName: 'Python & Data Structures',
    category: 'Programming',
    desiredLevel: 'Beginner',
  },

  // Ananya wants
  {
    id: 'want-4',
    userId: 'user-3',
    skillName: 'C++ & Problem Solving',
    category: 'Programming',
    desiredLevel: 'Beginner',
  },

  // Vikram wants
  {
    id: 'want-5',
    userId: 'user-4',
    skillName: 'Advanced Excel & Dashboards',
    category: 'Business',
    desiredLevel: 'Intermediate',
  },

  // Sneha wants
  {
    id: 'want-6',
    userId: 'user-5',
    skillName: 'Video Editing & Premiere Pro',
    category: 'Video Editing',
    desiredLevel: 'Beginner',
  },

  // Alex wants
  {
    id: 'want-7',
    userId: 'user-6',
    skillName: 'Photography',
    category: 'Photography',
    desiredLevel: 'Beginner',
  },
];

export const initialRequests: ExchangeRequest[] = [
  {
    id: 'req-1',
    senderId: 'user-2', // Priya
    receiverId: 'user-1', // Rahul
    skillOfferedId: 'offer-3', // UI/UX Design
    skillRequestedId: 'offer-1', // Python
    message: 'Hey Rahul! I saw your Python course offering. I can teach you Figma & UI/UX prototyping in return! Let us swap skills.',
    preferredSchedule: 'Saturdays 4:00 PM',
    status: 'pending',
    createdAt: '2026-09-28T14:20:00Z',
  },
  {
    id: 'req-2',
    senderId: 'user-1', // Rahul
    receiverId: 'user-3', // Ananya
    skillOfferedId: 'offer-2', // C++
    skillRequestedId: 'offer-5', // Public Speaking
    message: 'Hi Ananya, I would love to learn presentation skills from you! I can guide you through C++ pointers and STL.',
    preferredSchedule: 'Tuesdays 6:00 PM',
    status: 'accepted',
    createdAt: '2026-09-25T10:15:00Z',
  },
  {
    id: 'req-3',
    senderId: 'user-4', // Vikram
    receiverId: 'user-5', // Sneha
    skillOfferedId: 'offer-7', // Video Editing
    skillRequestedId: 'offer-8', // Excel
    message: 'Hello Sneha! Need help with Excel formulas. Happy to teach you video editing techniques!',
    preferredSchedule: 'Sunday Morning 10:00 AM',
    status: 'pending',
    createdAt: '2026-09-27T09:00:00Z',
  },
];

export const initialExchanges: Exchange[] = [
  {
    id: 'ex-1',
    requestId: 'req-2',
    student1Id: 'user-1', // Rahul
    student2Id: 'user-3', // Ananya
    skill1Id: 'offer-2', // C++
    skill2Id: 'offer-5', // Public Speaking
    status: 'active',
    progress: 60,
    completedSessions: 3,
    totalSessions: 5,
    startDate: '2026-09-26',
  },
];

export const initialMessages: Message[] = [
  {
    id: 'msg-1',
    exchangeId: 'ex-1',
    senderId: 'user-3', // Ananya
    receiverId: 'user-1', // Rahul
    text: 'Hey Rahul! Thanks for accepting the exchange. Are we still set for C++ & Public speaking today at 6 PM?',
    timestamp: '2026-09-29T10:15:00Z',
    isRead: true,
  },
  {
    id: 'msg-2',
    exchangeId: 'ex-1',
    senderId: 'user-1', // Rahul
    receiverId: 'user-3', // Ananya
    text: 'Yes absolutely! I have prepared a quick intro on pointers and vectors for our session.',
    timestamp: '2026-09-29T10:18:00Z',
    isRead: true,
  },
  {
    id: 'msg-3',
    exchangeId: 'ex-1',
    senderId: 'user-3', // Ananya
    receiverId: 'user-1', // Rahul
    text: 'Awesome! And I will share my 3-step formula for structuring elevator pitches. See you soon!',
    timestamp: '2026-09-29T10:22:00Z',
    isRead: false,
  },
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'request',
    title: 'New Exchange Request! ⚡',
    message: 'Priya Patel wants to exchange UI/UX Design for your Python & Data Structures skill.',
    relatedId: 'req-1',
    isRead: false,
    timestamp: '2026-09-28T14:20:00Z',
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    type: 'accepted',
    title: 'Request Accepted 🎉',
    message: 'Ananya Rao accepted your skill exchange request for Public Speaking.',
    relatedId: 'ex-1',
    isRead: true,
    timestamp: '2026-09-26T11:00:00Z',
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    type: 'message',
    title: 'New Message from Ananya 💬',
    message: 'Awesome! And I will share my 3-step formula for structuring elevator pitches...',
    relatedId: 'ex-1',
    isRead: false,
    timestamp: '2026-09-29T10:22:00Z',
  },
];

export const initialReviews: Review[] = [
  {
    id: 'rev-1',
    exchangeId: 'past-ex-1',
    reviewerId: 'user-6',
    revieweeId: 'user-1',
    rating: 5,
    comment: 'Rahul explained Python data structures with super clear real-world examples! Very patient mentor.',
    timestamp: '2026-09-10T15:30:00Z',
  },
  {
    id: 'rev-2',
    exchangeId: 'past-ex-2',
    reviewerId: 'user-1',
    revieweeId: 'user-2',
    rating: 5,
    comment: 'Priya is a Figma maestro! Taught me auto-layout and components in just 2 sessions.',
    timestamp: '2026-09-15T18:00:00Z',
  },
];

export const initialSessions: Session[] = [
  {
    id: 'sess-1',
    exchangeId: 'ex-1',
    title: 'Session 1: C++ Pointers vs References',
    date: '2026-09-26',
    time: '06:00 PM',
    isCompleted: true,
    notes: 'Covered memory layout, stack vs heap, basic pointer syntax.',
  },
  {
    id: 'sess-2',
    exchangeId: 'ex-1',
    title: 'Session 2: Voice Modulation & Stage Confidence',
    date: '2026-09-27',
    time: '05:30 PM',
    isCompleted: true,
    notes: 'Practiced vocal warmups and 2-minute impromptu speeches.',
  },
  {
    id: 'sess-3',
    exchangeId: 'ex-1',
    title: 'Session 3: C++ STL Vector & Map Operations',
    date: '2026-09-29',
    time: '06:00 PM',
    isCompleted: true,
    notes: 'Learned std::vector, std::unordered_map, and complexity analysis.',
  },
  {
    id: 'sess-4',
    exchangeId: 'ex-1',
    title: 'Session 4: Structuring a Presentation Deck',
    date: '2026-10-02',
    time: '06:00 PM',
    isCompleted: false,
    notes: 'Upcoming session on slide hierarchy and narrative hooks.',
  },
  {
    id: 'sess-5',
    exchangeId: 'ex-1',
    title: 'Session 5: Final Practice & Mock Presentation',
    date: '2026-10-05',
    time: '06:00 PM',
    isCompleted: false,
    notes: 'Final review session and reciprocal feedback.',
  },
];
