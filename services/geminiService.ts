import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Exercise, WorkoutSession } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const exerciseSchema = {
  type: Type.OBJECT,
  properties: {
    exercise_name: {
      type: Type.STRING,
      description: "The name of the exercise, e.g., 'Bench Press', 'Cycling', 'Running', 'Plank'."
    },
    sets: {
      type: Type.INTEGER,
      description: "The number of sets performed. Omit this field for cardio or timed exercises (e.g. running, cycling)."
    },
    reps: {
      type: Type.INTEGER,
      description: "The number of repetitions per set. Omit this field for cardio or timed exercises."
    },
    weight: {
      type: Type.NUMBER,
      description: "The weight used. Omit for non-weighted exercises."
    },
    unit: {
      type: Type.STRING,
      description: "The unit of weight, either 'lbs' or 'kg'. Omit if no weight used."
    },
    duration: {
      type: Type.STRING,
      description: "The duration of the exercise (e.g., '25 minutes', '30s', '1 hour'). Essential for cardio or timed static holds."
    },
    distance: {
      type: Type.STRING,
      description: "The distance covered (e.g., '5 km', '2 miles'). Essential for distance-based cardio."
    }
  },
  required: ['exercise_name'],
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    calories_burned: { 
      type: Type.STRING,
      description: "Estimated calories burned (e.g., '320 kcal')." 
    },
    summary: { 
      type: Type.STRING, 
      description: "A concise summary of the workout intensity, volume, and focus areas."
    },
    recommendation: { 
      type: Type.STRING,
      description: "Specific advice for the next workout session based on this performance." 
    },
  },
  required: ['calories_burned', 'summary', 'recommendation'],
};

export async function parseExerciseText(transcript: string, context?: string): Promise<Omit<Exercise, 'voice_transcript'>> {
  try {
    // Include context in the prompt if available (e.g., identified equipment)
    const prompt = context 
      ? `Context: The user is currently using the following equipment/exercise: "${context}". Use this context to infer the exercise name if not explicitly stated.
         Command: "${transcript}"`
      : `Parse the following workout command into a structured JSON object.
         - For strength training (e.g. Bench Press, Squats), extract sets, reps, and weight.
         - For cardio or timed activities (e.g. Cycling, Running, Plank), extract duration and/or distance. Do not invent sets/reps for these.
         Command: "${transcript}"`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: exerciseSchema,
        systemInstruction: "You are an expert fitness log parser. Analyze transcribed voice commands and extract exercise details. Respond ONLY with a valid JSON object. Be precise: use 'duration'/'distance' for cardio, and 'sets'/'reps'/'weight' for strength.",
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);

    // Basic validation: Ensure at least the name is present
    if (typeof parsedData.exercise_name === 'string') {
      return parsedData as Omit<Exercise, 'voice_transcript'>;
    } else {
      throw new Error("Parsed data does not match the expected Exercise format.");
    }
  } catch (error) {
    console.error("Error parsing exercise text with Gemini API:", error);
    throw new Error("Could not understand the workout command. Please try again.");
  }
}

export async function identifyEquipment(base64Image: string, mimeType: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType } },
          { text: "Identify this gym equipment. Return ONLY the common name of the machine or exercise station. Do not add punctuation." }
        ]
      }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error identifying equipment:", error);
    throw new Error("Could not identify the equipment.");
  }
}

export async function generateWorkoutAnalysis(session: WorkoutSession): Promise<NonNullable<WorkoutSession['ai_analysis']>> {
  const durationMs = new Date(session.end_time).getTime() - new Date(session.start_time).getTime();
  const durationMinutes = Math.round(durationMs / 60000);

  // Format exercises for the prompt so the AI understands mixed types
  const exerciseListStr = session.exercises.map(e => {
    let details = [];
    if (e.sets && e.reps) details.push(`${e.sets}x${e.reps}`);
    if (e.weight) details.push(`@ ${e.weight}${e.unit || 'lbs'}`);
    if (e.duration) details.push(`for ${e.duration}`);
    if (e.distance) details.push(`covering ${e.distance}`);
    return `${e.exercise_name} (${details.join(', ')})`;
  }).join('; ');

  const prompt = `
    Analyze this workout session to provide a post-workout report.
    
    User Profile:
    - Weight: ${session.user_weight || 'Not specified'}
    - Height: ${session.user_height || 'Not specified'}
    
    Workout Details:
    - Total Session Duration: ${durationMinutes} minutes
    - Exercises: ${exerciseListStr}.
    
    Task:
    1. Estimate calories burned based on the intensity, exercise types (mix of cardio/strength), and user stats.
    2. Write a motivating summary of the session. Mention specific achievements (e.g. "Good distance on the bike" or "Heavy lifting on bench").
    3. Suggest a specific focus for the next workout.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are an elite sports physiologist and personal trainer. Provide accurate estimations and helpful, concise advice.",
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating workout analysis:", error);
    return {
      calories_burned: "N/A",
      summary: "Could not generate analysis at this time.",
      recommendation: "Keep up the good work!"
    };
  }
}

export function createChatSession(): Chat {
  return ai.chats.create({
    model: "gemini-3-pro-preview",
    config: {
      systemInstruction: "You are an enthusiastic and expert gym trainer. You help users identify exercises, plan workouts, and give form advice. Keep your answers concise, motivating, and text-based (no markdown tables).",
    }
  });
}
