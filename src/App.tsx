import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopHeader } from './components/navigation/TopHeader';
import { BottomNav } from './components/navigation/BottomNav';
import { Toast } from './components/common/Toast';

import { Screen01_Splash } from './screens/Screen01_Splash';
import { Screen02_Onboarding } from './screens/Screen02_Onboarding';
import { Screen03_Login } from './screens/Screen03_Login';
import { Screen04_Signup } from './screens/Screen04_Signup';
import { Screen05_ProfileSetup } from './screens/Screen05_ProfileSetup';
import { Screen06_HomeDashboard } from './screens/Screen06_HomeDashboard';
import { Screen07_Explore } from './screens/Screen07_Explore';
import { Screen08_Filters } from './screens/Screen08_Filters';
import { Screen09_SkillDetails } from './screens/Screen09_SkillDetails';
import { Screen10_StudentProfile } from './screens/Screen10_StudentProfile';
import { Screen11_RequestExchange } from './screens/Screen11_RequestExchange';
import { Screen12_ExchangeRequests } from './screens/Screen12_ExchangeRequests';
import { Screen13_MatchedExchange } from './screens/Screen13_MatchedExchange';
import { Screen14_Chat } from './screens/Screen14_Chat';
import { Screen15_MyExchanges } from './screens/Screen15_MyExchanges';
import { Screen16_LearningProgress } from './screens/Screen16_LearningProgress';
import { Screen17_MySkills } from './screens/Screen17_MySkills';
import { Screen18_RatingsReviews } from './screens/Screen18_RatingsReviews';
import { Screen19_Notifications } from './screens/Screen19_Notifications';
import { Screen20_Profile } from './screens/Screen20_Profile';
import { Screen21_Settings } from './screens/Screen21_Settings';

const AppContent: React.FC = () => {
  const { currentScreen, mobileFrameMode } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'SPLASH':
        return <Screen01_Splash />;
      case 'ONBOARDING':
        return <Screen02_Onboarding />;
      case 'LOGIN':
        return <Screen03_Login />;
      case 'SIGNUP':
        return <Screen04_Signup />;
      case 'PROFILE_SETUP':
        return <Screen05_ProfileSetup />;
      case 'HOME':
        return <Screen06_HomeDashboard />;
      case 'EXPLORE':
        return <Screen07_Explore />;
      case 'FILTERS':
        return <Screen08_Filters />;
      case 'SKILL_DETAILS':
        return <Screen09_SkillDetails />;
      case 'STUDENT_PROFILE':
        return <Screen10_StudentProfile />;
      case 'REQUEST_EXCHANGE':
        return <Screen11_RequestExchange />;
      case 'EXCHANGE_REQUESTS':
        return <Screen12_ExchangeRequests />;
      case 'MATCHED_EXCHANGE':
        return <Screen13_MatchedExchange />;
      case 'CHAT':
        return <Screen14_Chat />;
      case 'MY_EXCHANGES':
        return <Screen15_MyExchanges />;
      case 'LEARNING_PROGRESS':
        return <Screen16_LearningProgress />;
      case 'MY_SKILLS':
        return <Screen17_MySkills />;
      case 'RATINGS_REVIEWS':
        return <Screen18_RatingsReviews />;
      case 'NOTIFICATIONS':
        return <Screen19_Notifications />;
      case 'PROFILE':
        return <Screen20_Profile />;
      case 'SETTINGS':
        return <Screen21_Settings />;
      default:
        return <Screen06_HomeDashboard />;
    }
  };

  return (
    <div className={`mobile-app-shell ${mobileFrameMode ? 'device-frame' : ''}`}>
      <TopHeader />
      <main className="flex-1 overflow-y-auto relative">{renderScreen()}</main>
      <BottomNav />
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
