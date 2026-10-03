import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';

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

import { apiRequest } from '../utils/api';

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

  toastMessage: {
    text: string;
    type: 'success' | 'error' | 'info';
  } | null;

  navigate: (screen: ScreenId, params?: any) => void;
  goBack: () => void;

  showToast: (
    text: string,
    type?: 'success' | 'error' | 'info'
  ) => void;

  login: (email: string, pass: string) => boolean;
  signup: (userData: Partial<User>) => void;
  logout: () => void;

  completeOnboarding: () => void;
  updateProfile: (data: Partial<User>) => void;

  addSkillOffer: (
    offer: Omit<SkillOffer, 'id' | 'userId'>
  ) => void;

  editSkillOffer: (
    id: string,
    offer: Partial<SkillOffer>
  ) => void;

  deleteSkillOffer: (id: string) => void;

  addSkillWant: (
    want: Omit<SkillWant, 'id' | 'userId'>
  ) => void;

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

  submitReview: (reviewData: {
    exchangeId: string;
    revieweeId: string;
    rating: number;
    comment: string;
  }) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  updateFilters: (newFilters: Partial<FilterState>) => void;
  resetFilters: () => void;

  toggleMobileFrame: () => void;
  resetToDemoState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(
  undefined
);

const LOCAL_STORAGE_KEY = 'skillswap_app_state_v1';

export const AppProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  /*
   * ---------------------------------------------------------
   * LOCAL STORAGE
   * ---------------------------------------------------------
   */

  const getSavedState = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);

      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error(
        'Failed to load state from localStorage:',
        error
      );
    }

    return null;
  };

  const saved = getSavedState();

  /*
   * ---------------------------------------------------------
   * STATE
   * ---------------------------------------------------------
   */

  const [users, setUsers] = useState<User[]>(
    saved?.users || initialUsers
  );

  const [currentUser, setCurrentUser] =
    useState<User | null>(
      saved?.currentUser || initialUsers[0]
    );

  const [skillOffers, setSkillOffers] =
    useState<SkillOffer[]>(
      saved?.skillOffers || initialSkillOffers
    );

  const [skillWants, setSkillWants] =
    useState<SkillWant[]>(
      saved?.skillWants || initialSkillWants
    );

  const [requests, setRequests] =
    useState<ExchangeRequest[]>(
      saved?.requests || initialRequests
    );

  const [exchanges, setExchanges] =
    useState<Exchange[]>(
      saved?.exchanges || initialExchanges
    );

  const [messages, setMessages] =
    useState<Message[]>(
      saved?.messages || initialMessages
    );

  const [notifications, setNotifications] =
    useState<NotificationItem[]>(
      saved?.notifications || initialNotifications
    );

  const [reviews, setReviews] =
    useState<Review[]>(
      saved?.reviews || initialReviews
    );

  const [sessions, setSessions] =
    useState<Session[]>(
      saved?.sessions || initialSessions
    );

  const [onboardingCompleted, setOnboardingCompleted] =
    useState<boolean>(
      saved?.onboardingCompleted ?? true
    );

  const [currentScreen, setCurrentScreen] =
    useState<ScreenId>('HOME');

  const [screenParams, setScreenParams] =
    useState<any>(null);

  const [historyStack, setHistoryStack] =
    useState<
      { screen: ScreenId; params?: any }[]
    >([{ screen: 'HOME' }]);

  const [filters, setFilters] =
    useState<FilterState>(DEFAULT_FILTERS);

  const [mobileFrameMode, setMobileFrameMode] =
    useState<boolean>(false);

  const [toastMessage, setToastMessage] =
    useState<{
      text: string;
      type: 'success' | 'error' | 'info';
    } | null>(null);

  /*
   * This prevents the first LocalStorage state from
   * immediately overwriting the Supabase state.
   */
  const serverStateLoaded = useRef(false);

  /*
   * Prevent multiple simultaneous saves.
   */
  const saveTimeout = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  /*
   * ---------------------------------------------------------
   * CREATE COMPLETE APP STATE
   * ---------------------------------------------------------
   */

  const buildAppState = () => {
    return {
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
    };
  };

  /*
   * ---------------------------------------------------------
   * REMOVE PASSWORDS BEFORE SENDING STATE TO BACKEND
   * ---------------------------------------------------------
   */

  const sanitizeStateForBackend = () => {
    const state = buildAppState();

    return {
      ...state,

      users: state.users.map((user) => ({
        ...user,
        password: '',
      })),

      currentUser: state.currentUser
        ? {
            ...state.currentUser,
            password: '',
          }
        : null,
    };
  };

  const loadRealUsers = async () => {
  const token = localStorage.getItem('skillswap_token');

  if (!token) return;

  try {
    const response = await apiRequest('/users/');

    const realUsers = (response.users || []).map((item: any) => ({
      id: item.id,
      email: item.email || '',
      name: item.full_name || item.profile?.full_name || 'Student',
      fullName: item.full_name || item.profile?.full_name || 'Student',
      ...item.profile,
    }));

    setUsers(realUsers);
  } catch (error) {
    console.error('Failed to load real users:', error);
  }
};

useEffect(() => {
  if (currentUser) {
    loadRealUsers();
  }
}, [currentUser]);

  /*
   * ---------------------------------------------------------
   * LOCAL STORAGE SYNC
   * ---------------------------------------------------------
   */

  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(buildAppState())
      );
    } catch (error) {
      console.error(
        'Failed to save state to localStorage:',
        error
      );
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

  /*
   * ---------------------------------------------------------
   * LOAD STATE FROM SUPABASE
   * ---------------------------------------------------------
   */

  const loadBackendState = async () => {
    const token =
      localStorage.getItem('skillswap_token');

    if (!token) {
      serverStateLoaded.current = true;
      return;
    }

    try {
      const data = await apiRequest('/app-state/');

      if (data?.state) {
        const state = data.state;

        if (Array.isArray(state.users)) {
          setUsers(state.users);
        }

        if (state.currentUser) {
          setCurrentUser(state.currentUser);
        }

        if (Array.isArray(state.skillOffers)) {
          setSkillOffers(state.skillOffers);
        }

        if (Array.isArray(state.skillWants)) {
          setSkillWants(state.skillWants);
        }

        if (Array.isArray(state.requests)) {
          setRequests(state.requests);
        }

        if (Array.isArray(state.exchanges)) {
          setExchanges(state.exchanges);
        }

        if (Array.isArray(state.messages)) {
          setMessages(state.messages);
        }

        if (Array.isArray(state.notifications)) {
          setNotifications(state.notifications);
        }

        if (Array.isArray(state.reviews)) {
          setReviews(state.reviews);
        }

        if (Array.isArray(state.sessions)) {
          setSessions(state.sessions);
        }

        if (
          typeof state.onboardingCompleted ===
          'boolean'
        ) {
          setOnboardingCompleted(
            state.onboardingCompleted
          );
        }

        console.log(
          'SkillSwap data loaded from Supabase'
        );
      } else {
        /*
         * No backend state exists yet.
         * Save the existing local state for this user.
         */
        serverStateLoaded.current = true;

        await apiRequest('/app-state/', {
          method: 'PUT',
          body: JSON.stringify({
            state: sanitizeStateForBackend(),
          }),
        });

        console.log(
          'Initial SkillSwap state uploaded to Supabase'
        );

        return;
      }

      serverStateLoaded.current = true;
    } catch (error) {
      console.error(
        'Could not load SkillSwap state from backend:',
        error
      );

      /*
       * LocalStorage remains the fallback.
       */
      serverStateLoaded.current = true;
    }
  };

  /*
   * Load backend state once when AppContext starts.
   */

  useEffect(() => {
    void loadBackendState();
  }, []);

  /*
   * ---------------------------------------------------------
   * SAVE STATE TO SUPABASE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const token =
      localStorage.getItem('skillswap_token');

    if (!token) return;

    if (!serverStateLoaded.current) return;

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(() => {
      void (async () => {
        try {
          await apiRequest('/app-state/', {
            method: 'PUT',
            body: JSON.stringify({
              state: sanitizeStateForBackend(),
            }),
          });

          console.log(
            'SkillSwap state synchronized with Supabase'
          );
        } catch (error) {
          console.error(
            'Failed to synchronize state with backend:',
            error
          );
        }
      })();
    }, 700);

    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
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

  /*
   * ---------------------------------------------------------
   * TOAST
   * ---------------------------------------------------------
   */

  const showToast = (
    text: string,
    type: 'success' | 'error' | 'info' = 'success'
  ) => {
    setToastMessage({
      text,
      type,
    });

    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  /*
   * ---------------------------------------------------------
   * NAVIGATION
   * ---------------------------------------------------------
   */

  const navigate = (
    screen: ScreenId,
    params?: any
  ) => {
    setHistoryStack((prev) => [
      ...prev,
      {
        screen,
        params,
      },
    ]);

    setCurrentScreen(screen);
    setScreenParams(params || null);
  };

  const goBack = () => {
    if (historyStack.length > 1) {
      const newStack = [...historyStack];

      newStack.pop();

      const previous =
        newStack[newStack.length - 1];

      setHistoryStack(newStack);

      setCurrentScreen(previous.screen);

      setScreenParams(
        previous.params || null
      );
    } else {
      setCurrentScreen('HOME');
      setScreenParams(null);
    }
  };

  /*
   * ---------------------------------------------------------
   * LOGIN
   * ---------------------------------------------------------
   */

  const login = (
    email: string,
    pass: string
  ): boolean => {
    void (async () => {
      try {
        const data = await apiRequest(
          '/auth/login',
          {
            method: 'POST',
            body: JSON.stringify({
              email,
              password: pass,
            }),
          }
        );

        /*
         * Save JWT.
         */
        localStorage.setItem(
          'skillswap_token',
          data.access_token
        );

        /*
         * Find existing profile information
         * if it already exists in our local/backend state.
         */
        const existingUser = users.find(
          (user) =>
            String(user.email || '').trim().toLowerCase() ===
            String(data.user.email || '').trim().toLowerCase()
        );

        const loggedInUser: User = {
          id: data.user.id,

          name:
            data.user.full_name ||
            existingUser?.name ||
            'Student',

          email: data.user.email,

          password: '',

          avatar:
            existingUser?.avatar || '',

          college:
            existingUser?.college || '',

          department:
            existingUser?.department || '',

          semester:
            existingUser?.semester || '',

          bio:
            existingUser?.bio || '',

          rating:
            existingUser?.rating ?? 5,

          reviewCount:
            existingUser?.reviewCount ?? 0,

          completedExchanges:
            existingUser?.completedExchanges ?? 0,

          availability:
            existingUser?.availability ||
            'Flexible',

          interests:
            existingUser?.interests || [],

          createdAt:
            existingUser?.createdAt ||
            new Date().toISOString(),
        };

        /*
         * Make sure the user exists in local app state.
         */
        setUsers((prev) => {
          const exists = prev.some(
            (user) => user.id === loggedInUser.id
          );

          if (exists) {
            return prev.map((user) =>
              user.id === loggedInUser.id
                ? {
                    ...user,
                    ...loggedInUser,
                  }
                : user
            );
          }

          return [
            loggedInUser,
            ...prev,
          ];
        });

        setCurrentUser(loggedInUser);

        /*
         * Load the user's saved cloud state.
         */
        serverStateLoaded.current = false;

        try {
          const stateData =
            await apiRequest('/app-state/');

          if (stateData?.state) {
            const state =
              stateData.state;

            if (Array.isArray(state.users)) {
              setUsers(state.users);
            }

            if (state.currentUser) {
              setCurrentUser(
                state.currentUser
              );
            }

            if (
              Array.isArray(
                state.skillOffers
              )
            ) {
              setSkillOffers(
                state.skillOffers
              );
            }

            if (
              Array.isArray(
                state.skillWants
              )
            ) {
              setSkillWants(
                state.skillWants
              );
            }

            if (
              Array.isArray(
                state.requests
              )
            ) {
              setRequests(
                state.requests
              );
            }

            if (
              Array.isArray(
                state.exchanges
              )
            ) {
              setExchanges(
                state.exchanges
              );
            }

            if (
              Array.isArray(
                state.messages
              )
            ) {
              setMessages(
                state.messages
              );
            }

            if (
              Array.isArray(
                state.notifications
              )
            ) {
              setNotifications(
                state.notifications
              );
            }

            if (
              Array.isArray(
                state.reviews
              )
            ) {
              setReviews(
                state.reviews
              );
            }

            if (
              Array.isArray(
                state.sessions
              )
            ) {
              setSessions(
                state.sessions
              );
            }

            if (
              typeof state.onboardingCompleted ===
              'boolean'
            ) {
              setOnboardingCompleted(
                state.onboardingCompleted
              );
            }
          }
        } catch (stateError) {
          console.error(
            'Could not load cloud state after login:',
            stateError
          );
        }

        serverStateLoaded.current = true;

        showToast(
          `Welcome back, ${
            loggedInUser.name
          }! 👋`
        );

        navigate('HOME');
      } catch (error) {
        console.error(
          'Login failed:',
          error
        );

        showToast(
          error instanceof Error
            ? error.message
            : 'Invalid email or password',
          'error'
        );
      }
    })();

    /*
     * Keep the original synchronous API
     * expected by your Login screen.
     */
    return true;
  };

  /*
   * ---------------------------------------------------------
   * SIGNUP
   * ---------------------------------------------------------
   */

  const signup = (
    userData: Partial<User>
  ) => {
    void (async () => {
      try {
        /*
         * Register user in backend.
         */
        await apiRequest(
          '/auth/register',
          {
            method: 'POST',
            body: JSON.stringify({
              email:
                userData.email || '',
              password:
                userData.password ||
                'password123',
              full_name:
                userData.name ||
                'New Student',
            }),
          }
        );

        /*
         * Immediately login after registration.
         * Backend registration currently returns
         * the created user but not a JWT.
         */
        const loginData =
          await apiRequest(
            '/auth/login',
            {
              method: 'POST',
              body: JSON.stringify({
                email:
                  userData.email || '',
                password:
                  userData.password ||
                  'password123',
              }),
            }
          );

        localStorage.setItem(
          'skillswap_token',
          loginData.access_token
        );

        const newUser: User = {
          id: loginData.user.id,

          name:
            loginData.user.full_name ||
            userData.name ||
            'New Student',

          email:
            loginData.user.email ||
            userData.email ||
            '',

          password: '',

          avatar:
            userData.avatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',

          college:
            userData.college ||
            'RV College of Engineering',

          department:
            userData.department ||
            'Computer Science',

          semester:
            userData.semester ||
            '1st Sem',

          bio: userData.bio || '',

          rating: 5,

          reviewCount: 0,

          completedExchanges: 0,

          availability:
            userData.availability ||
            'Flexible',

          interests:
            userData.interests || [],

          createdAt:
            new Date().toISOString(),
        };

        setUsers((prev) => [
          newUser,
          ...prev,
        ]);

        setCurrentUser(newUser);

        setOnboardingCompleted(true);

        serverStateLoaded.current = true;

        showToast(
          'Account created successfully!'
        );

        navigate(
          'PROFILE_SETUP'
        );
      } catch (error) {
        console.error(
          'Signup failed:',
          error
        );

        showToast(
          error instanceof Error
            ? error.message
            : 'Could not create account',
          'error'
        );
      }
    })();
  };

  /*
   * ---------------------------------------------------------
   * LOGOUT
   * ---------------------------------------------------------
   */

  const logout = () => {
    localStorage.removeItem(
      'skillswap_token'
    );

    serverStateLoaded.current =
      false;

    setCurrentUser(null);

    showToast(
      'Logged out successfully',
      'info'
    );

    navigate('LOGIN');
  };

  /*
   * ---------------------------------------------------------
   * ONBOARDING
   * ---------------------------------------------------------
   */

  const completeOnboarding = () => {
    setOnboardingCompleted(true);

    navigate('LOGIN');
  };

  /*
   * ---------------------------------------------------------
   * PROFILE
   * ---------------------------------------------------------
   */

  const updateProfile = (
    data: Partial<User>
  ) => {
    if (!currentUser) return;

    const updated: User = {
      ...currentUser,
      ...data,
      password: '',
    };

    setCurrentUser(updated);

    setUsers((prev) =>
      prev.map((user) =>
        user.id === currentUser.id
          ? updated
          : user
      )
    );

    showToast(
      'Profile updated!'
    );
  };

  /*
   * ---------------------------------------------------------
   * SKILL OFFERS
   * ---------------------------------------------------------
   */

  const addSkillOffer = (
    offer: Omit<
      SkillOffer,
      'id' | 'userId'
    >
  ) => {
    if (!currentUser) return;

    const newOffer: SkillOffer = {
      ...offer,

      id: `offer-${Date.now()}`,

      userId:
        currentUser.id,
    };

    setSkillOffers((prev) => [
      newOffer,
      ...prev,
    ]);

    showToast(
      `Added skill: ${offer.skillName}`
    );
  };

  const editSkillOffer = (
    id: string,
    offerData: Partial<SkillOffer>
  ) => {
    setSkillOffers((prev) =>
      prev.map((offer) =>
        offer.id === id
          ? {
              ...offer,
              ...offerData,
            }
          : offer
      )
    );

    showToast(
      'Skill updated!'
    );
  };

  const deleteSkillOffer = (
    id: string
  ) => {
    setSkillOffers((prev) =>
      prev.filter(
        (offer) => offer.id !== id
      )
    );

    showToast(
      'Skill removed',
      'info'
    );
  };

  /*
   * ---------------------------------------------------------
   * SKILL WANTS
   * ---------------------------------------------------------
   */

  const addSkillWant = (
    want: Omit<
      SkillWant,
      'id' | 'userId'
    >
  ) => {
    if (!currentUser) return;

    const newWant: SkillWant = {
      ...want,

      id: `want-${Date.now()}`,

      userId:
        currentUser.id,
    };

    setSkillWants((prev) => [
      newWant,
      ...prev,
    ]);

    showToast(
      `Added wanted skill: ${want.skillName}`
    );
  };

  const deleteSkillWant = (
    id: string
  ) => {
    setSkillWants((prev) =>
      prev.filter(
        (want) => want.id !== id
      )
    );

    showToast(
      'Wanted skill removed',
      'info'
    );
  };

  /*
   * ---------------------------------------------------------
   * EXCHANGE REQUEST
   * ---------------------------------------------------------
   */

  const sendExchangeRequest = (
    reqData: {
      receiverId: string;
      skillOfferedId: string;
      skillRequestedId: string;
      message: string;
      preferredSchedule: string;
    }
  ) => {
    if (!currentUser) return;

    const now =
      new Date().toISOString();

    const newReq: ExchangeRequest = {
      id: `req-${Date.now()}`,

      senderId:
        currentUser.id,

      receiverId:
        reqData.receiverId,

      skillOfferedId:
        reqData.skillOfferedId,

      skillRequestedId:
        reqData.skillRequestedId,

      message:
        reqData.message,

      preferredSchedule:
        reqData.preferredSchedule,

      status: 'pending',

      createdAt: now,
    };

    setRequests((prev) => [
      newReq,
      ...prev,
    ]);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,

      userId:
        reqData.receiverId,

      type: 'request',

      title:
        'New Exchange Request! ⚡',

      message:
        `${currentUser.name} requested a skill exchange with you.`,

      relatedId:
        newReq.id,

      isRead: false,

      timestamp: now,
    };

    setNotifications((prev) => [
      newNotif,
      ...prev,
    ]);

    showToast(
      'Exchange request sent! 🚀'
    );

    navigate(
      'EXCHANGE_REQUESTS',
      {
        tab: 'sent',
      }
    );
  };

  /*
   * ---------------------------------------------------------
   * ACCEPT REQUEST
   * ---------------------------------------------------------
   */

  const acceptExchangeRequest = (
    requestId: string
  ) => {
    const req =
      requests.find(
        (r) =>
          r.id === requestId
      );

    if (!req) return;

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'accepted',
            }
          : r
      )
    );

    const exchangeId =
      `ex-${Date.now()}`;

    const newExchange: Exchange = {
      id: exchangeId,

      requestId:
        req.id,

      student1Id:
        req.senderId,

      student2Id:
        req.receiverId,

      skill1Id:
        req.skillOfferedId,

      skill2Id:
        req.skillRequestedId,

      status: 'active',

      progress: 0,

      completedSessions: 0,

      totalSessions: 5,

      startDate:
        new Date()
          .toISOString()
          .split('T')[0],
    };

    setExchanges((prev) => [
      newExchange,
      ...prev,
    ]);

    const baseDate =
      new Date();

    const createSession =
      (
        number: number,
        daysFromNow: number,
        title: string
      ): Session => ({
        id:
          `sess-${Date.now()}-${number}`,

        exchangeId,

        title,

        date:
          new Date(
            baseDate.getTime() +
              86400000 *
                daysFromNow
          )
            .toISOString()
            .split('T')[0],

        time: '05:00 PM',

        isCompleted: false,
      });

    const newSessions: Session[] = [
      createSession(
        1,
        0,
        'Session 1: Introductory Skill Overview & Goal Setting'
      ),

      createSession(
        2,
        2,
        'Session 2: Hands-on Fundamentals & Practice Exercises'
      ),

      createSession(
        3,
        5,
        'Session 3: Core Deep Dive & Practical Project'
      ),

      createSession(
        4,
        7,
        'Session 4: Advanced Concepts & Troubleshooting'
      ),

      createSession(
        5,
        10,
        'Session 5: Final Review, Showcase & Exchange Feedback'
      ),
    ];

    setSessions((prev) => [
      ...newSessions,
      ...prev,
    ]);

    const newNotif: NotificationItem = {
      id:
        `notif-${Date.now()}`,

      userId:
        req.senderId,

      type: 'accepted',

      title:
        'Request Accepted! 🎉',

      message:
        'Your exchange request was accepted! You can now start learning.',

      relatedId:
        exchangeId,

      isRead: false,

      timestamp:
        new Date().toISOString(),
    };

    setNotifications((prev) => [
      newNotif,
      ...prev,
    ]);

    showToast(
      'Request accepted! Active exchange created.'
    );

    navigate(
      'MATCHED_EXCHANGE',
      {
        exchangeId,
      }
    );
  };

  /*
   * ---------------------------------------------------------
   * REJECT REQUEST
   * ---------------------------------------------------------
   */

  const rejectExchangeRequest = (
    requestId: string
  ) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: 'rejected',
            }
          : request
      )
    );

    showToast(
      'Request declined',
      'info'
    );
  };

  /*
   * ---------------------------------------------------------
   * CANCEL REQUEST
   * ---------------------------------------------------------
   */

  const cancelExchangeRequest = (
    requestId: string
  ) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: 'cancelled',
            }
          : request
      )
    );

    showToast(
      'Request cancelled',
      'info'
    );
  };

  /*
   * ---------------------------------------------------------
   * MESSAGES
   * ---------------------------------------------------------
   */

  const sendMessage = (
    exchangeId: string,
    text: string
  ) => {
    if (!currentUser) return;

    const exchange =
      exchanges.find(
        (item) =>
          item.id === exchangeId
      );

    if (!exchange) return;

    const recipientId =
      exchange.student1Id ===
      currentUser.id
        ? exchange.student2Id
        : exchange.student1Id;

    const now =
      new Date().toISOString();

    const newMsg: Message = {
      id:
        `msg-${Date.now()}`,

      exchangeId,

      senderId:
        currentUser.id,

      receiverId:
        recipientId,

      text,

      timestamp: now,

      isRead: false,
    };

    setMessages((prev) => [
      ...prev,
      newMsg,
    ]);

    const newNotif: NotificationItem = {
      id:
        `notif-${Date.now()}`,

      userId:
        recipientId,

      type: 'message',

      title:
        `Message from ${currentUser.name} 💬`,

      message:
        text.length > 40
          ? `${text.substring(
              0,
              40
            )}...`
          : text,

      relatedId:
        exchangeId,

      isRead: false,

      timestamp: now,
    };

    setNotifications((prev) => [
      newNotif,
      ...prev,
    ]);
  };

  /*
   * ---------------------------------------------------------
   * SESSION
   * ---------------------------------------------------------
   */

  const markSessionCompleted = (
    sessionId: string
  ) => {
    const targetSession =
      sessions.find(
        (session) =>
          session.id === sessionId
      );

    if (!targetSession) return;

    const updatedSessions =
      sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              isCompleted:
                !session.isCompleted,
            }
          : session
      );

    setSessions(
      updatedSessions
    );

    const exchangeId =
      targetSession.exchangeId;

    const exchangeSessions =
      updatedSessions.filter(
        (session) =>
          session.exchangeId ===
          exchangeId
      );

    const completedCount =
      exchangeSessions.filter(
        (session) =>
          session.isCompleted
      ).length;

    const totalCount =
      exchangeSessions.length || 1;

    const progress =
      Math.round(
        (completedCount /
          totalCount) *
          100
      );

    setExchanges((prev) =>
      prev.map((exchange) =>
        exchange.id === exchangeId
          ? {
              ...exchange,

              progress,

              completedSessions:
                completedCount,

              status:
                progress === 100
                  ? 'completed'
                  : 'active',

              completedAt:
                progress === 100
                  ? new Date().toISOString()
                  : undefined,
            }
          : exchange
      )
    );

    showToast(
      targetSession.isCompleted
        ? 'Session marked incomplete'
        : 'Session completed! Progress updated 🎉'
    );
  };

  /*
   * ---------------------------------------------------------
   * END EXCHANGE
   * ---------------------------------------------------------
   */

  const endExchange = (
    exchangeId: string
  ) => {
    setExchanges((prev) =>
      prev.map((exchange) =>
        exchange.id === exchangeId
          ? {
              ...exchange,
              status: 'completed',
              progress: 100,
            }
          : exchange
      )
    );

    showToast(
      'Exchange marked as completed! 🏆'
    );

    navigate(
      'RATINGS_REVIEWS',
      {
        exchangeId,
      }
    );
  };

  /*
   * ---------------------------------------------------------
   * REVIEWS
   * ---------------------------------------------------------
   */

  const submitReview = (
    reviewData: {
      exchangeId: string;
      revieweeId: string;
      rating: number;
      comment: string;
    }
  ) => {
    if (!currentUser) return;

    const newReview: Review = {
      id:
        `rev-${Date.now()}`,

      exchangeId:
        reviewData.exchangeId,

      reviewerId:
        currentUser.id,

      revieweeId:
        reviewData.revieweeId,

      rating:
        reviewData.rating,

      comment:
        reviewData.comment,

      timestamp:
        new Date().toISOString(),
    };

    const updatedReviews = [
      newReview,
      ...reviews,
    ];

    setReviews(
      updatedReviews
    );

    setUsers((prev) =>
      prev.map((user) => {
        if (
          user.id !==
          reviewData.revieweeId
        ) {
          return user;
        }

        const userReviews =
          updatedReviews.filter(
            (review) =>
              review.revieweeId ===
              user.id
          );

        const averageRating =
  userReviews.length > 0
    ? Number(
        (
          userReviews.reduce(
            (total, review) => total + Number(review?.rating ?? 0),
            0
          ) / userReviews.length
        ).toFixed(1)
      )
    : 5;

        return {
          ...user,

          rating: averageRating,

          reviewCount:
            userReviews.length,

          completedExchanges:
            user.completedExchanges +
            1,
        };
      })
    );

    showToast(
      'Thank you for your rating & review! ⭐'
    );

    navigate(
      'MY_EXCHANGES',
      {
        tab: 'completed',
      }
    );
  };

  /*
   * ---------------------------------------------------------
   * NOTIFICATIONS
   * ---------------------------------------------------------
   */

  const markNotificationRead = (
    id: string
  ) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              isRead: true,
            }
          : notification
      )
    );
  };

  const markAllNotificationsRead =
    () => {
      if (!currentUser) return;

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.userId ===
          currentUser.id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );

      showToast(
        'All notifications marked as read',
        'info'
      );
    };

  /*
   * ---------------------------------------------------------
   * FILTERS
   * ---------------------------------------------------------
   */

  const updateFilters = (
    newFilters: Partial<FilterState>
  ) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const resetFilters = () => {
    setFilters(
      DEFAULT_FILTERS
    );
  };

  /*
   * ---------------------------------------------------------
   * MOBILE FRAME
   * ---------------------------------------------------------
   */

  const toggleMobileFrame = () => {
    setMobileFrameMode(
      (previous) => !previous
    );
  };

  /*
   * ---------------------------------------------------------
   * RESET DEMO STATE
   * ---------------------------------------------------------
   */

  const resetToDemoState = () => {
    localStorage.removeItem(
      LOCAL_STORAGE_KEY
    );

    setUsers(initialUsers);

    setCurrentUser(
      initialUsers[0]
    );

    setSkillOffers(
      initialSkillOffers
    );

    setSkillWants(
      initialSkillWants
    );

    setRequests(
      initialRequests
    );

    setExchanges(
      initialExchanges
    );

    setMessages(
      initialMessages
    );

    setNotifications(
      initialNotifications
    );

    setReviews(
      initialReviews
    );

    setSessions(
      initialSessions
    );

    setOnboardingCompleted(
      true
    );

    showToast(
      'Reset to demo sample data!',
      'info'
    );

    navigate('HOME');
  };

  /*
   * ---------------------------------------------------------
   * PROVIDER
   * ---------------------------------------------------------
   */

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

/*
 * ---------------------------------------------------------
 * useApp HOOK
 * ---------------------------------------------------------
 */

export const useApp = () => {
  const context =
    useContext(AppContext);

  if (!context) {
    throw new Error(
      'useApp must be used within an AppProvider'
    );
  }

  return context;
};