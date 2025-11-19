
import React, { useState } from 'react';
import Card from './Card';
import { GoogleIcon, UserIcon, ChevronLeftIcon, SpinnerIcon } from './Icons';
import { User } from '../types';

interface AuthScreenProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      const mockUser: User = {
        id: 'user_123',
        name: 'Fitness Enthusiast',
        email: 'user@example.com',
        photoUrl: 'https://ui-avatars.com/api/?name=Fitness+Enthusiast&background=00A9FF&color=fff'
      };
      setIsLoading(false);
      onLogin(mockUser);
    }, 1500);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const mockUser: User = {
        id: 'user_456',
        name: 'New Member',
        email: 'member@example.com',
      };
      setIsLoading(false);
      onLogin(mockUser);
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto w-full">
        <button 
            onClick={onBack}
            className="flex items-center text-medium-text hover:text-light-text mb-6 transition-colors"
        >
            <ChevronLeftIcon className="w-5 h-5 mr-1" /> Back to Home
        </button>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-brand-blue mb-2">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-medium-text">
          {mode === 'login' 
            ? 'Log in to sync your workout history.' 
            : 'Join GymVoice to track your progress.'}
        </p>
      </div>

      <Card className="space-y-6">
        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full bg-white text-gray-800 font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-3 hover:bg-gray-100 transition-colors"
        >
          {isLoading ? <SpinnerIcon className="w-5 h-5 animate-spin text-gray-600" /> : <GoogleIcon className="w-5 h-5" />}
          <span>{mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}</span>
        </button>

        <div className="flex items-center justify-between">
            <span className="w-1/5 border-b border-dark-border lg:w-1/4"></span>
            <span className="text-xs text-center text-medium-text uppercase">or with email</span>
            <span className="w-1/5 border-b border-dark-border lg:w-1/4"></span>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-medium-text mb-1">Email Address</label>
            <input 
                type="email" 
                required
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-light-text focus:outline-none focus:border-brand-blue"
                placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-medium-text mb-1">Password</label>
            <input 
                type="password" 
                required
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-light-text focus:outline-none focus:border-brand-blue"
                placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex justify-center"
          >
             {isLoading ? <SpinnerIcon className="w-5 h-5 animate-spin" /> : (mode === 'login' ? 'Log In' : 'Create Account')}
          </button>
        </form>
      </Card>

      <div className="mt-6 text-center">
        <p className="text-medium-text">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-brand-green hover:underline font-semibold"
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
