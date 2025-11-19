import React, { useMemo, useEffect, useState } from 'react';
import { WorkoutSession, Exercise } from '../types';
import Card from './Card';
import { generateWorkoutAnalysis } from '../services/geminiService';
import { ClipboardIcon, SpinnerIcon } from './Icons';

interface ReportScreenProps {
  session: WorkoutSession;
  onBack: () => void;
  onUpdateSession: (session: WorkoutSession) => void;
}

const ReportScreen: React.FC<ReportScreenProps> = ({ session, onBack, onUpdateSession }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const { totalVolume, exerciseCount, cardioCount } = useMemo(() => {
    const LBS_PER_KG = 2.20462;
    let totalVol = 0;
    let cCount = 0;
    
    session.exercises.forEach(ex => {
      // Volume
      if (ex.sets && ex.reps && ex.weight) {
        const volume = ex.sets * ex.reps * ex.weight;
        if (ex.unit === 'kg') {
          totalVol += volume * LBS_PER_KG;
        } else {
          totalVol += volume;
        }
      }
      // Cardio count
      if (ex.duration || ex.distance) {
        cCount++;
      }
    });

    return {
      totalVolume: Math.round(totalVol),
      exerciseCount: session.exercises.length,
      cardioCount: cCount
    };
  }, [session.exercises]);
  
  const formattedDate = new Date(session.start_time).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const sessionDuration = useMemo(() => {
    const start = new Date(session.start_time);
    const end = session.end_time ? new Date(session.end_time) : new Date();
    
    const durationMs = end.getTime() - start.getTime();
    const totalMinutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const durationStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

    return {
        start: start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        end: end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        duration: durationStr
    };
  }, [session.start_time, session.end_time]);

  useEffect(() => {
    // Generate analysis if it doesn't exist
    if (!session.ai_analysis && !isAnalyzing) {
      const fetchAnalysis = async () => {
        setIsAnalyzing(true);
        const analysis = await generateWorkoutAnalysis(session);
        const updatedSession = { ...session, ai_analysis: analysis };
        onUpdateSession(updatedSession);
        setIsAnalyzing(false);
      };
      fetchAnalysis();
    }
  }, [session, isAnalyzing, onUpdateSession]);

  const getExerciseText = (e: Exercise) => {
    const parts = [];
    if (e.sets && e.reps) parts.push(`${e.sets}x${e.reps}`);
    if (e.weight) parts.push(`@ ${e.weight}${e.unit || 'lbs'}`);
    if (e.duration) parts.push(`Time: ${e.duration}`);
    if (e.distance) parts.push(`Dist: ${e.distance}`);
    return parts.join(' • ');
  };

  const handleCopy = () => {
    const text = `
GymVoice Workout Report - ${formattedDate}
Time: ${sessionDuration.start} - ${sessionDuration.end} (${sessionDuration.duration})
Stats: ${session.ai_analysis?.calories_burned || 'N/A'} | Vol: ${totalVolume} lbs

Summary:
${session.ai_analysis?.summary || 'N/A'}

Exercises:
${session.exercises.map(e => `- ${e.exercise_name}: ${getExerciseText(e)}`).join('\n')}

Recommendation:
${session.ai_analysis?.recommendation || 'N/A'}
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex justify-between items-center">
         <h2 className="text-3xl font-bold text-brand-green">Workout Summary</h2>
         {session.ai_analysis && (
            <button 
                onClick={handleCopy} 
                className="bg-dark-card border border-brand-blue text-brand-blue px-3 py-2 rounded-lg flex items-center text-sm hover:bg-brand-blue hover:text-white transition-colors"
            >
                <ClipboardIcon className="w-4 h-4 mr-2" />
                {showCopied ? "Copied!" : "Copy Report"}
            </button>
         )}
      </div>

      {/* AI Analysis Section */}
      <Card className={`border-brand-green transition-all duration-500 ${isAnalyzing ? 'animate-pulse' : ''}`}>
        <h3 className="text-xl font-bold mb-4 text-brand-green flex items-center">
           Smart Analysis
           {isAnalyzing && <SpinnerIcon className="ml-2 w-5 h-5 animate-spin text-medium-text" />}
        </h3>
        
        {isAnalyzing ? (
            <p className="text-medium-text italic">Crunching the numbers and generating insights...</p>
        ) : session.ai_analysis ? (
            <div className="space-y-4">
                <div className="flex items-center justify-between bg-dark-bg p-4 rounded-lg border border-dark-border">
                    <span className="text-medium-text">Est. Calories Burned</span>
                    <span className="text-2xl font-bold text-white">{session.ai_analysis.calories_burned}</span>
                </div>
                <div>
                    <h4 className="font-semibold text-brand-blue mb-1">Session Summary</h4>
                    <p className="text-light-text leading-relaxed">{session.ai_analysis.summary}</p>
                </div>
                <div className="border-t border-dark-border pt-4">
                    <h4 className="font-semibold text-brand-blue mb-1">Next Session Recommendation</h4>
                    <p className="text-light-text leading-relaxed italic">"{session.ai_analysis.recommendation}"</p>
                </div>
            </div>
        ) : (
            <p className="text-red-400">Analysis failed to load.</p>
        )}
      </Card>

      {/* Basic Stats */}
      <Card>
        <h3 className="text-xl font-bold mb-4 text-brand-blue">Session Details</h3>
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
                <p className="text-xs text-medium-text uppercase tracking-wider mb-1">Date</p>
                <p className="font-semibold text-light-text">{formattedDate}</p>
            </div>
            <div>
                <p className="text-xs text-medium-text uppercase tracking-wider mb-1">Total Duration</p>
                <p className="font-semibold text-light-text">{sessionDuration.duration}</p>
            </div>
            
            <div className="col-span-2 bg-dark-bg/50 p-4 rounded-lg border border-dark-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex flex-col items-center sm:items-start">
                    <span className="text-xs text-medium-text uppercase tracking-wider mb-1">Start Time</span>
                    <span className="font-mono text-lg text-light-text">{sessionDuration.start}</span>
                </div>
                <div className="text-medium-text opacity-50 hidden sm:block">→</div>
                <div className="flex flex-col items-center sm:items-end">
                    <span className="text-xs text-medium-text uppercase tracking-wider mb-1">End Time</span>
                    <span className="font-mono text-lg text-light-text">{sessionDuration.end}</span>
                </div>
            </div>

            <div className="col-span-2 grid grid-cols-2 gap-4 pt-2">
                <div className="bg-dark-bg p-3 rounded border border-dark-border text-center">
                    <p className="text-2xl font-bold text-white">{exerciseCount}</p>
                    <p className="text-xs text-medium-text uppercase">Exercises</p>
                </div>
                <div className="bg-dark-bg p-3 rounded border border-dark-border text-center">
                    <p className="text-2xl font-bold text-white">{totalVolume.toLocaleString()}</p>
                    <p className="text-xs text-medium-text uppercase">Volume (lbs)</p>
                </div>
                {cardioCount > 0 && (
                   <div className="col-span-2 bg-dark-bg p-3 rounded border border-dark-border text-center">
                        <p className="text-2xl font-bold text-white">{cardioCount}</p>
                        <p className="text-xs text-medium-text uppercase">Cardio / Timed Activities</p>
                   </div>
                )}
            </div>
        </div>
      </Card>

      {/* Exercise List */}
      <Card>
        <h3 className="text-xl font-bold mb-4 text-brand-green">Exercise Log</h3>
        <div className="space-y-4">
            {session.exercises.map((ex, i) => (
                <div key={i} className="flex justify-between items-start border-b border-dark-border pb-4 last:border-0 last:pb-0">
                    <div>
                        <p className="font-semibold text-light-text text-lg">{ex.exercise_name}</p>
                        <p className="text-brand-blue mt-1">{getExerciseText(ex)}</p>
                    </div>
                    <span className="text-xs text-medium-text bg-dark-bg px-2 py-1 rounded">
                        #{i + 1}
                    </span>
                </div>
            ))}
        </div>
      </Card>

      <button
        onClick={onBack}
        className="w-full border border-medium-text text-medium-text hover:text-white hover:border-white font-bold py-3 rounded-lg transition duration-200"
      >
        Back to Home
      </button>
    </div>
  );
};

export default ReportScreen;
