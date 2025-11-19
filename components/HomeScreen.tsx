
import React from 'react';
import { WorkoutSession, User } from '../types';
import Card from './Card';
import { DumbbellIcon, UserIcon } from './Icons';

interface HomeScreenProps {
  onStartWorkout: () => void;
  onViewWorkout: (session: WorkoutSession) => void;
  onAuthClick: () => void;
  workouts: WorkoutSession[];
  user: User | null;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartWorkout, onViewWorkout, onAuthClick, workouts, user }) => {
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      
      <div className="flex justify-between items-center bg-dark-card p-4 rounded-lg border border-dark-border shadow-sm">
        <div>
            <h3 className="text-lg font-bold text-light-text">
                {user ? `Hello, ${user.name.split(' ')[0]}` : 'Guest User'}
            </h3>
            <p className="text-xs text-medium-text">
                {user ? 'Account Active' : 'Log in to sync data'}
            </p>
        </div>
        <button 
            onClick={onAuthClick}
            className="bg-brand-blue/20 hover:bg-brand-blue/40 p-2 rounded-full transition-colors"
        >
            {user && user.photoUrl ? (
                <img src={user.photoUrl} alt="Profile" className="w-8 h-8 rounded-full" />
            ) : (
                <UserIcon className="w-6 h-6 text-brand-blue" />
            )}
        </button>
      </div>

      <div>
        <button
          onClick={onStartWorkout}
          className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg text-xl transition-transform duration-200 ease-in-out transform hover:scale-105 shadow-lg"
        >
          Start New Workout
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 text-brand-green">Past Workouts</h2>
        {workouts.length === 0 ? (
          <Card>
            <p className="text-medium-text text-center">No workouts logged yet. Let's get started!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {workouts.map(session => (
              <Card 
                key={session.session_id} 
                className="cursor-pointer hover:border-brand-blue transition-colors duration-200 group"
                onClick={() => onViewWorkout(session)}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-dark-bg p-2 rounded-full group-hover:text-brand-blue text-brand-green transition-colors">
                     <DumbbellIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <p className="font-semibold text-light-text">{formatDate(session.start_time)}</p>
                        {session.ai_analysis && (
                            <span className="text-xs bg-brand-green/20 text-brand-green px-2 py-1 rounded">
                                {session.ai_analysis.calories_burned}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-medium-text mt-1">
                        {session.exercises.length} exercises 
                        {session.exercises.length > 0 && ` • ${session.exercises[0].exercise_name}`}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
