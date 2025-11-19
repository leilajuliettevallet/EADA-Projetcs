
import { useState, useEffect, useCallback } from 'react';
import { WorkoutSession } from '../types';

const STORAGE_KEY = 'gymvoice_workouts';

const useWorkoutHistory = () => {
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    try {
      const storedWorkouts = localStorage.getItem(STORAGE_KEY);
      if (storedWorkouts) {
        setWorkouts(JSON.parse(storedWorkouts));
      }
    } catch (error) {
      console.error("Failed to load workouts from localStorage", error);
    }
  }, []);

  const addWorkout = useCallback((newWorkout: WorkoutSession) => {
    setWorkouts(prevWorkouts => {
      const updatedWorkouts = [newWorkout, ...prevWorkouts];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWorkouts));
      } catch (error) {
        console.error("Failed to save workouts to localStorage", error);
      }
      return updatedWorkouts;
    });
  }, []);

  const updateWorkout = useCallback((updatedSession: WorkoutSession) => {
    setWorkouts(prevWorkouts => {
      const newWorkouts = prevWorkouts.map(w => w.session_id === updatedSession.session_id ? updatedSession : w);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newWorkouts));
      } catch (error) {
        console.error("Failed to update workout", error);
      }
      return newWorkouts;
    });
  }, []);
  
  return { workouts, addWorkout, updateWorkout };
};

export default useWorkoutHistory;
