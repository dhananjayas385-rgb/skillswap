import React, { createContext, useContext, useState, useEffect } from 'react';
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
  ScreenId,
  FilterState,
  SkillCategory,
} from '../types';
import {
  initialUsers,
  initialSkillOffers,
  initialSkillWants,
  initialRequests,
  initialExchanges,
  initialMessages,
  initialNotifications,
  initialReviews,
  initialSessions,
} from '../data/seedData';

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  category: 'All',
  skillLevel: 'All',
  department: 'All',
  semester: 'All',
  availability: 'All',
  compatibilityOnly: false,
};

interface AppContextType {
  currentUser: User | null;
  users: User[];
  skillOffers: SkillOffer[];
  skillWants: SkillWant[];
  requests: ExchangeRequest[];
  exchanges: Exchange[];
  messages: Message[];
  notifications: NotificationItem[];
  reviews: Review[];
  sessions: Session[];
  currentScreen: ScreenId;
  screenParams: any;
  historyStack: { screen: ScreenId; params?: any }[];
  filters: FilterState;
  onboardingCompleted: boolean;
  mobileFrameMode: boolean;
  toastMessage: { text: string; type: 'success' | 'error' | 'info' } | null;

  // Actions
  navigate: (screen: ScreenId, params?: any) => void;
  goBack: () => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  login: (email: string, pass: string) => boolean;
  signup: (userData: Partial<User>) => void;
  logout: () => void;
  completeOnboarding: () => void;
  updateProfile: (data: Partial<User>) => void;
  addSkillOffer: (offer: Omit<SkillOffer, 'id' | 'userId'>) => void;
  editSkillOffer: (id: string, offer: Partial<SkillOffer>) => void;
  deleteSkillOffer: (id: string) => void;
  addSkillWant: (want: Omit<SkillWant, 'id' | 'userId'>) => void;
  deleteSkillWant: (id: string) => void;
  sendExchangeRequest: (reqData: {
    receiverId: string;
    skillOfferedId: string;
    skillRequestedId: string;
    message: string;
    preferredSchedule: string;
  }) => void;
  acceptExchangeRequest: (requestId: string) => void;
  rejectExchangeRequest: (requestId: string) => void;
  cancelExchangeRequest: (requestId: string) => void;
  sendMessage: (exchangeId: string, text: string) => void;
  markSessionCompleted: (sessionId: string) => void;
  endExchange: (exchangeId: string) => void;
  submitReview: (reviewData: { exchangeId: string; revieweeId: string; rating: number; comment: string }) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateFilters: (newFilters: Partial<FilterState>) => void;
  resetFilters: () => void;
  toggleMobileFrame: () => void;
  resetToDemoState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'skillswap_app_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage or seedData
  const getSavedState = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
    return null;
  };

  const saved = getSavedState();

  const [users, setUsers] = useState<User[]>(saved?.users || initialUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(
    saved?.currentUser || initialUsers[0]
  );
  const [skillOffers, setSkillOffers] = useState<SkillOffer[]>(saved?.skillOffers || initialSkillOffers);
  const [skillWants, setSkillWants] = useState<SkillWant[]>(saved?.skillWants || initialSkillWants);
  const [requests, setRequests] = useState<ExchangeRequest[]>(saved?.requests || initialRequests);
  const [exchanges, setExchanges] = useState<Exchange[]>(saved?.exchanges || initialExchanges);
  const [messages, setMessages] = useState<Message[]>(saved?.messages || initialMessages);
  const [notifications, setNotifications] = useState<NotificationItem[]>(saved?.notifications || initialNotifications);
  const [reviews, setReviews] = useState<Review[]>(saved?.reviews || initialReviews);
  const [sessions, setSessions] = useState<Session[]>(saved?.sessions || initialSessions);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(saved?.onboardingCompleted ?? true);

  const [currentScreen, setCurrentScreen] = useState<ScreenId>('HOME');
  const [screenParams, setScreenParams] = useState<any>(null);
  const [historyStack, setHistoryStack] = useState<{ screen: ScreenId; params?: any }[]>([{ screen: 'HOME' }]);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [mobileFrameMode, setMobileFrameMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          users,
          currentUser,
          skillOffers,
          skillWants,
          requests,
          exchanges,
          messages,
          notifications,
          reviews,
          sessions,
          onboardingCompleted,
        })
      );
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [
    users,
    currentUser,
    skillOffers,
    skillWants,
    requests,
    exchanges,
    messages,
    notifications,
    reviews,
    sessions,
    onboardingCompleted,
  ]);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const navigate = (screen: ScreenId, params?: any) => {
    setHistoryStack((prev) => [...prev, { screen, params }]);
    setCurrentScreen(screen);
    setScreenParams(params || null);
  };

  const goBack = () => {
    if (historyStack.length > 1) {
      const newStack = [...historyStack];
      newStack.pop();
      const previous = newStack[newStack.length - 1];
      setHistoryStack(newStack);
      setCurrentScreen(previous.screen);
      setScreenParams(previous.params || null);
    } else {
      setCurrentScreen('HOME');
      setScreenParams(null);
    }
  };

  const login = (email: string, pass: string): boolean => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user && (user.password === pass || pass === 'password123')) {
      setCurrentUser(user);
      showToast(`Welcome back, ${user.name}! 👋`);
      navigate('HOME');
      return true;
    }
    return false;
  };

  const signup = (userData: Partial<User>) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name || 'New Student',
      email: userData.email || '',
      password: userData.password || 'password123',
      avatar:
        userData.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      college: userData.college || 'RV College of Engineering',
      department: userData.department || 'Computer Science',
      semester: userData.semester || '1st Sem',
      bio: '',
      rating: 5.0,
      reviewCount: 0,
      completedExchanges: 0,
      availability: 'Flexible',
      interests: [],
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    showToast('Account created successfully!');
    navigate('PROFILE_SETUP');
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Logged out successfully', 'info');
    navigate('LOGIN');
  };

  const completeOnboarding = () => {
    setOnboardingCompleted(true);
    navigate('LOGIN');
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    showToast('Profile updated!');
  };

  const addSkillOffer = (offer: Omit<SkillOffer, 'id' | 'userId'>) => {
    if (!currentUser) return;
    const newOffer: SkillOffer = {
      ...offer,
      id: `offer-${Date.now()}`,
      userId: currentUser.id,
    };
    setSkillOffers((prev) => [newOffer, ...prev]);
    showToast(`Added skill: ${offer.skillName}`);
  };

  const editSkillOffer = (id: string, offerData: Partial<SkillOffer>) => {
    setSkillOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...offerData } : o))
    );
    showToast('Skill updated!');
  };

  const deleteSkillOffer = (id: string) => {
    setSkillOffers((prev) => prev.filter((o) => o.id !== id));
    showToast('Skill removed', 'info');
  };

  const addSkillWant = (want: Omit<SkillWant, 'id' | 'userId'>) => {
    if (!currentUser) return;
    const newWant: SkillWant = {
      ...want,
      id: `want-${Date.now()}`,
      userId: currentUser.id,
    };
    setSkillWants((prev) => [newWant, ...prev]);
    showToast(`Added wanted skill: ${want.skillName}`);
  };

  const deleteSkillWant = (id: string) => {
    setSkillWants((prev) => prev.filter((w) => w.id !== id));
    showToast('Wanted skill removed', 'info');
  };

  const sendExchangeRequest = (reqData: {
    receiverId: string;
    skillOfferedId: string;
    skillRequestedId: string;
    message: string;
    preferredSchedule: string;
  }) => {
    if (!currentUser) return;

    const newReq: ExchangeRequest = {
      id: `req-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: reqData.receiverId,
      skillOfferedId: reqData.skillOfferedId,
      skillRequestedId: reqData.skillRequestedId,
      message: reqData.message,
      preferredSchedule: reqData.preferredSchedule,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setRequests((prev) => [newReq, ...prev]);

    // Create Notification for receiver
    const receiver = users.find((u) => u.id === reqData.receiverId);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: reqData.receiverId,
      type: 'request',
      title: 'New Exchange Request! ⚡',
      message: `${currentUser.name} requested a skill exchange with you.`,
      relatedId: newReq.id,
      isRead: false,
      timestamp: new Date().toISOString(),
    };

    setNotifications((prev) => [newNotif, ...prev]);
    showToast('Exchange request sent! 🚀');
    navigate('EXCHANGE_REQUESTS', { tab: 'sent' });
  };

  const acceptExchangeRequest = (requestId: string) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    // Update request status
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'accepted' } : r))
    );

    // Create Active Exchange
    const newExchange: Exchange = {
      id: `ex-${Date.now()}`,
      requestId: req.id,
      student1Id: req.senderId,
      student2Id: req.receiverId,
      skill1Id: req.skillOfferedId,
      skill2Id: req.skillRequestedId,
      status: 'active',
      progress: 0,
      completedSessions: 0,
      totalSessions: 5,
      startDate: new Date().toISOString().split('T')[0],
    };

    setExchanges((prev) => [newExchange, ...prev]);

    // Create initial Sessions
    const newSessions: Session[] = [
      {
        id: `sess-${Date.now()}-1`,
        exchangeId: newExchange.id,
        title: 'Session 1: Introductory Skill Overview & Goal Setting',
        date: new Date().toISOString().split('T')[0],
        time: '05:00 PM',
        isCompleted: false,
        notes: 'Align learning objectives and prerequisites.',
      },
      {
        id: `sess-${Date.now()}-2`,
        exchangeId: newExchange.id,
        title: 'Session 2: Hands-on Fundamentals & Practice Exercises',
        date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        time: '05:00 PM',
        isCompleted: false,
      },
      {
        id: `sess-${Date.now()}-3`,
        exchangeId: newExchange.id,
        title: 'Session 3: Core Deep Dive & Practical Project',
        date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
        time: '05:00 PM',
        isCompleted: false,
      },
      {
        id: `sess-${Date.now()}-4`,
        exchangeId: newExchange.id,
        title: 'Session 4: Advanced Concepts & Troubleshooting',
        date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
        time: '05:00 PM',
        isCompleted: false,
      },
      {
        id: `sess-${Date.now()}-5`,
        exchangeId: newExchange.id,
        title: 'Session 5: Final Review, Showcase & Exchange Feedback',
        date: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0],
        time: '05:00 PM',
        isCompleted: false,
      },
    ];

    setSessions((prev) => [...newSessions, ...prev]);

    // Notify sender
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: req.senderId,
      type: 'accepted',
      title: 'Request Accepted! 🎉',
      message: `Your exchange request was accepted! You can now start learning.`,
      relatedId: newExchange.id,
      isRead: false,
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast('Request accepted! Active exchange created.');
    navigate('MATCHED_EXCHANGE', { exchangeId: newExchange.id });
  };

  const rejectExchangeRequest = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'rejected' } : r))
    );
    showToast('Request declined', 'info');
  };

  const cancelExchangeRequest = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'cancelled' } : r))
    );
    showToast('Request cancelled', 'info');
  };

  const sendMessage = (exchangeId: string, text: string) => {
    if (!currentUser) return;
    const ex = exchanges.find((e) => e.id === exchangeId);
    if (!ex) return;

    const recipientId = ex.student1Id === currentUser.id ? ex.student2Id : ex.student1Id;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      exchangeId,
      senderId: currentUser.id,
      receiverId: recipientId,
      text,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setMessages((prev) => [...prev, newMsg]);

    // Notify receiver
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: recipientId,
      type: 'message',
      title: `Message from ${currentUser.name} 💬`,
      message: text.length > 40 ? `${text.substring(0, 40)}...` : text,
      relatedId: exchangeId,
      isRead: false,
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markSessionCompleted = (sessionId: string) => {
    const targetSession = sessions.find((s) => s.id === sessionId);
    if (!targetSession) return;

    const updatedSessions = sessions.map((s) =>
      s.id === sessionId ? { ...s, isCompleted: !s.isCompleted } : s
    );
    setSessions(updatedSessions);

    // Update parent exchange progress
    const exchangeId = targetSession.exchangeId;
    const exSessions = updatedSessions.filter((s) => s.exchangeId === exchangeId);
    const completedCount = exSessions.filter((s) => s.isCompleted).length;
    const totalCount = exSessions.length || 1;
    const progressPercent = Math.round((completedCount / totalCount) * 100);

    setExchanges((prev) =>
      prev.map((e) =>
        e.id === exchangeId
          ? {
              ...e,
              progress: progressPercent,
              completedSessions: completedCount,
              status: progressPercent === 100 ? 'completed' : 'active',
              completedAt: progressPercent === 100 ? new Date().toISOString() : undefined,
            }
          : e
      )
    );

    showToast(
      targetSession.isCompleted
        ? 'Session marked incomplete'
        : 'Session completed! Progress updated 🎉'
    );
  };

  const endExchange = (exchangeId: string) => {
    setExchanges((prev) =>
      prev.map((e) => (e.id === exchangeId ? { ...e, status: 'completed', progress: 100 } : e))
    );
    showToast('Exchange marked as completed! 🏆');
    navigate('RATINGS_REVIEWS', { exchangeId });
  };

  const submitReview = (reviewData: {
    exchangeId: string;
    revieweeId: string;
    rating: number;
    comment: string;
  }) => {
    if (!currentUser) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      exchangeId: reviewData.exchangeId,
      reviewerId: currentUser.id,
      revieweeId: reviewData.revieweeId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      timestamp: new Date().toISOString(),
    };

    const updatedReviews = [newRev, ...reviews];
    setReviews(updatedReviews);

    // Update reviewee rating & review count & completed exchanges
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === reviewData.revieweeId) {
          const uReviews = updatedReviews.filter((r) => r.revieweeId === u.id);
          const avgRating = Number(
            (uReviews.reduce((acc, r) => acc + r.rating, 0) / uReviews.length).toFixed(1)
          );
          return {
            ...u,
            rating: avgRating,
            reviewCount: uReviews.length,
            completedExchanges: u.completedExchanges + 1,
          };
        }
        return u;
      })
    );

    showToast('Thank you for your rating & review! ⭐');
    navigate('MY_EXCHANGES', { tab: 'completed' });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    if (!currentUser) return;
    setNotifications((prev) =>
      prev.map((n) => (n.userId === currentUser.id ? { ...n, isRead: true } : n))
    );
    showToast('All notifications marked as read', 'info');
  };

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const toggleMobileFrame = () => {
    setMobileFrameMode((prev) => !prev);
  };

  const resetToDemoState = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setUsers(initialUsers);
    setCurrentUser(initialUsers[0]);
    setSkillOffers(initialSkillOffers);
    setSkillWants(initialSkillWants);
    setRequests(initialRequests);
    setExchanges(initialExchanges);
    setMessages(initialMessages);
    setNotifications(initialNotifications);
    setReviews(initialReviews);
    setSessions(initialSessions);
    setOnboardingCompleted(true);
    showToast('Reset to demo sample data!', 'info');
    navigate('HOME');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        skillOffers,
        skillWants,
        requests,
        exchanges,
        messages,
        notifications,
        reviews,
        sessions,
        currentScreen,
        screenParams,
        historyStack,
        filters,
        onboardingCompleted,
        mobileFrameMode,
        toastMessage,

        navigate,
        goBack,
        showToast,
        login,
        signup,
        logout,
        completeOnboarding,
        updateProfile,
        addSkillOffer,
        editSkillOffer,
        deleteSkillOffer,
        addSkillWant,
        deleteSkillWant,
        sendExchangeRequest,
        acceptExchangeRequest,
        rejectExchangeRequest,
        cancelExchangeRequest,
        sendMessage,
        markSessionCompleted,
        endExchange,
        submitReview,
        markNotificationRead,
        markAllNotificationsRead,
        updateFilters,
        resetFilters,
        toggleMobileFrame,
        resetToDemoState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
