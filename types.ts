
export interface Exercise {
  voice_transcript: string;
  exercise_name: string;
  // Strength Training
  sets?: number;
  reps?: number;
  weight?: number;
  unit?: 'lbs' | 'kg';
  // Cardio / Timed / Distance
  duration?: string; // e.g., "25 minutes", "30s"
  distance?: string; // e.g., "5 km", "2 miles"
}

export interface WorkoutSession {
  session_id: string;
  start_time: string;
  end_time: string;
  exercises: Exercise[];
  user_weight?: string; // e.g. "180 lbs"
  user_height?: string; // e.g. "6'0""
  ai_analysis?: {
    calories_burned: string;
    summary: string;
    recommendation: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
}