
import React, { useState, useCallback } from 'react';
import { WorkoutSession, User } from './types';
import useWorkoutHistory from './hooks/useWorkoutHistory';
import HomeScreen from './components/HomeScreen';
import WorkoutScreen from './components/WorkoutScreen';
import ReportScreen from './components/ReportScreen';
import ChatAssistant from './components/ChatAssistant';
import AuthScreen from './components/AuthScreen';
import { ChatBubbleIcon, LeilaAvatarIcon } from './components/Icons';

type View = 'home' | 'workout' | 'report' | 'auth';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const { workouts, addWorkout, updateWorkout } = useWorkoutHistory();
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [completedSession, setCompletedSession] = useState<WorkoutSession | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);

  const startWorkout = useCallback(() => {
    const newSession: WorkoutSession = {
      session_id: crypto.randomUUID(),
      start_time: new Date().toISOString(),
      end_time: '',
      exercises: [],
    };
    setActiveSession(newSession);
    setView('workout');
  }, []);

  const endWorkout = useCallback((session: WorkoutSession) => {
    const finalSession = {
      ...session,
      end_time: new Date().toISOString(),
    };
    addWorkout(finalSession);
    setActiveSession(null);
    setCompletedSession(finalSession);
    setView('report');
  }, [addWorkout]);

  const viewReport = useCallback((session: WorkoutSession) => {
    setCompletedSession(session);
    setView('report');
  }, []);

  const goHome = useCallback(() => {
    setCompletedSession(null);
    setView('home');
  }, []);
  
  const handleLogin = useCallback((loggedInUser: User) => {
      setUser(loggedInUser);
      setView('home');
  }, []);

  const handleUpdateSession = useCallback((updatedSession: WorkoutSession) => {
    updateWorkout(updatedSession);
    setCompletedSession(prev => {
        if (prev && prev.session_id === updatedSession.session_id) {
            return updatedSession;
        }
        return prev;
    });
  }, [updateWorkout]);

  const renderView = () => {
    switch (view) {
      case 'workout':
        return activeSession && <WorkoutScreen session={activeSession} onEndWorkout={endWorkout} />;
      case 'report':
        return completedSession && (
            <ReportScreen 
                session={completedSession} 
                onBack={goHome} 
                onUpdateSession={handleUpdateSession}
            />
        );
      case 'auth':
        return <AuthScreen onLogin={handleLogin} onBack={goHome} />;
      case 'home':
      default:
        return (
            <HomeScreen 
                onStartWorkout={startWorkout} 
                onViewWorkout={viewReport} 
                workouts={workouts} 
                onAuthClick={() => setView('auth')}
                user={user}
            />
        );
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-light-text flex flex-col items-center p-4 relative transition-colors duration-300">
      <div className="w-full max-w-2xl mx-auto">
        <header className="mb-10 flex flex-col items-center">
          <div 
            className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={goHome}
          >
            <LeilaAvatarIcon className="w-16 h-16 mr-4 drop-shadow-md" />
            <div className="text-left">
                <h1 className="text-5xl font-extrabold text-light-text tracking-tight font-sans">
                  Leil<span className="text-brand-blue">AI</span>
                </h1>
                <p className="text-medium-text text-sm tracking-wider uppercase font-semibold mt-1">
                  Track Smart. Stay Timeless.
                </p>
            </div>
          </div>
        </header>
        <main>
          {renderView()}
        </main>
      </div>

      {/* Floating Chat Button */}
      {view !== 'auth' && (
        <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 bg-brand-blue text-white p-4 rounded-full shadow-lg hover:bg-blue-600 hover:scale-105 transition-all duration-200 z-40 flex items-center justify-center"
            aria-label="Open LeilAI"
        >
            <ChatBubbleIcon className="w-7 h-7" />
        </button>
      )}

      {/* Chat Assistant Overlay */}
      <ChatAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default App;
