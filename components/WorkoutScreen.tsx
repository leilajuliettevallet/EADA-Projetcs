import React, { useState, useEffect, useRef } from 'react';
import { WorkoutSession, Exercise } from '../types';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { parseExerciseText, identifyEquipment } from '../services/geminiService';
import Card from './Card';
import { MicrophoneIcon, SpinnerIcon, CameraIcon, XMarkIcon, KeyboardIcon, SendIcon } from './Icons';

interface WorkoutScreenProps {
  session: WorkoutSession;
  onEndWorkout: (session: WorkoutSession) => void;
}

type Status = 'idle' | 'listening' | 'processing' | 'analyzing_image' | 'error' | 'success';
type InputMode = 'voice' | 'text';

const WorkoutScreen: React.FC<WorkoutScreenProps> = ({ session, onEndWorkout }) => {
  const [currentSession, setCurrentSession] = useState<WorkoutSession>(session);
  const [status, setStatus] = useState<Status>('idle');
  const [inputMode, setInputMode] = useState<InputMode>('voice');
  const [errorMessage, setErrorMessage] = useState('');
  const [identifiedEquipment, setIdentifiedEquipment] = useState<string | null>(null);
  const [manualText, setManualText] = useState('');
  
  const { isListening, transcript, startListening, stopListening, error, isSupported } = useSpeechRecognition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // End Workout Modal State
  const [showEndModal, setShowEndModal] = useState(false);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  useEffect(() => {
    if(isListening) {
        setStatus('listening');
    } else if (status === 'listening') {
        setStatus('idle');
    }
  }, [isListening, status]);

  // Consolidated Processing Function
  const processCommand = async (text: string) => {
    setStatus('processing');
    try {
      const parsedData = await parseExerciseText(text, identifiedEquipment || undefined);
      const newExercise: Exercise = {
        ...parsedData,
        voice_transcript: text,
      };
      setCurrentSession(prev => ({ ...prev, exercises: [...prev.exercises, newExercise] }));
      setStatus('success');
      setIdentifiedEquipment(null);
      setManualText(''); // Clear text input if used
      setTimeout(() => setStatus('idle'), 1500);
    } catch (e: any) {
      setErrorMessage(e.message || 'Failed to parse exercise.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  // Watch for Voice Transcripts
  useEffect(() => {
    if (transcript) {
      processCommand(transcript);
    }
  }, [transcript, identifiedEquipment]);

  useEffect(() => {
    if (error) {
        setErrorMessage(error);
        setStatus('error');
    }
  }, [error]);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleManualSubmit = () => {
    if (manualText.trim()) {
        processCommand(manualText);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus('analyzing_image');
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const equipmentName = await identifyEquipment(base64, file.type);
      setIdentifiedEquipment(equipmentName);
      setStatus('idle');
    } catch (e) {
      setErrorMessage('Failed to identify image.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFinishWorkout = () => {
    const finalSession = {
        ...currentSession,
        user_weight: weight ? `${weight} lbs` : undefined,
        user_height: height ? height : undefined,
    };
    onEndWorkout(finalSession);
  };

  const getStatusText = () => {
    switch(status) {
        case 'listening': return "Listening...";
        case 'processing': return "Processing your entry...";
        case 'analyzing_image': return "Identifying equipment...";
        case 'error': return `Error: ${errorMessage}`;
        case 'success': return "Exercise logged!";
        default: 
          if (inputMode === 'text') return "Type your exercise details.";
          return identifiedEquipment 
            ? `Identified: ${identifiedEquipment}. Tap mic to log details.` 
            : "Tap mic to log, or camera to identify.";
    }
  };

  const getExerciseDetails = (ex: Exercise) => {
    const parts = [];
    // Strength
    if (ex.sets && ex.reps) {
        let str = `${ex.sets} sets x ${ex.reps} reps`;
        if (ex.weight) str += ` @ ${ex.weight} ${ex.unit || 'lbs'}`;
        parts.push(str);
    }
    // Cardio / Time / Distance
    if (ex.duration) parts.push(`⏱️ ${ex.duration}`);
    if (ex.distance) parts.push(`📏 ${ex.distance}`);
    
    return parts.length > 0 ? parts.join(' • ') : 'Details logged';
  };

  const MicButton = () => (
    <button
      onClick={isListening ? stopListening : startListening}
      disabled={status === 'processing' || status === 'analyzing_image' || !isSupported}
      className={`relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 ease-in-out shadow-lg z-10
        ${status === 'listening' ? 'bg-red-500 animate-pulse' : 'bg-brand-blue'}
        ${(status === 'processing' || status === 'analyzing_image') ? 'bg-gray-500 cursor-not-allowed' : 'hover:bg-blue-600'}
        ${!isSupported ? 'bg-gray-700 cursor-not-allowed' : ''}
      `}
    >
      {status === 'processing' 
        ? <SpinnerIcon className="w-12 h-12 text-white animate-spin" /> 
        : <MicrophoneIcon className="w-12 h-12 text-white" />
      }
    </button>
  );

  return (
    <>
    <div className="flex flex-col items-center space-y-8">
      <div className="flex flex-col items-center space-y-4 relative w-full">
        
        {/* Toggle Controls */}
        <div className="flex space-x-4 absolute right-0 sm:right-auto sm:static sm:mb-4 z-20">
            <button 
                onClick={() => setInputMode(prev => prev === 'voice' ? 'text' : 'voice')}
                className={`p-3 rounded-full border border-dark-border transition-colors shadow-md ${inputMode === 'text' ? 'bg-brand-blue text-white' : 'bg-dark-card text-medium-text hover:bg-dark-border'}`}
                title={inputMode === 'voice' ? "Switch to Text" : "Switch to Voice"}
            >
                {inputMode === 'voice' ? <KeyboardIcon className="w-6 h-6" /> : <MicrophoneIcon className="w-6 h-6" />}
            </button>

            <button 
                onClick={handleCameraClick}
                disabled={status !== 'idle' && status !== 'success' && status !== 'error'}
                className="bg-dark-card border border-dark-border p-3 rounded-full text-brand-green hover:bg-dark-border transition-colors shadow-md"
                title="Identify Equipment"
            >
                {status === 'analyzing_image' ? (
                <SpinnerIcon className="w-6 h-6 animate-spin" />
                ) : (
                <CameraIcon className="w-6 h-6" />
                )}
            </button>
        </div>
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            capture="environment"
            onChange={handleFileChange}
        />

        {/* Input Area */}
        <div className="h-32 flex items-center justify-center w-full max-w-md mt-16 sm:mt-0">
            {inputMode === 'voice' ? (
                <MicButton />
            ) : (
                <div className="w-full flex flex-col gap-2 animate-fade-in">
                    <textarea
                        value={manualText}
                        onChange={(e) => setManualText(e.target.value)}
                        placeholder="e.g., '25 mins of cycling' or '3 sets of bench press'"
                        className="w-full bg-dark-card border border-dark-border rounded-lg p-3 text-light-text focus:border-brand-blue focus:outline-none h-24 resize-none"
                        disabled={status === 'processing'}
                    />
                    <button
                        onClick={handleManualSubmit}
                        disabled={!manualText.trim() || status === 'processing'}
                        className="bg-brand-blue text-white rounded-lg py-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                    >
                        {status === 'processing' ? 'Processing...' : 'Log Exercise'}
                    </button>
                </div>
            )}
        </div>

        <p className={`text-center h-6 transition-colors duration-300 ${status === 'error' ? 'text-red-400' : 'text-medium-text'}`}>
            {isSupported || inputMode === 'text' ? getStatusText() : "Speech recognition not supported. Use text mode."}
        </p>
      </div>
      
      <div className="w-full space-y-4">
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-brand-green">Current Workout</h2>
            {identifiedEquipment && (
              <span className="text-xs bg-brand-blue text-white px-2 py-1 rounded-full">
                Context: {identifiedEquipment}
              </span>
            )}
         </div>
         
         {currentSession.exercises.length === 0 ? (
             <Card>
                 <p className="text-medium-text text-center">No exercises logged yet.</p>
             </Card>
         ) : (
            <Card className="max-h-64 overflow-y-auto">
                 <ul className="divide-y divide-dark-border">
                    {currentSession.exercises.map((ex, index) => (
                        <li key={index} className="py-3">
                            <p className="font-semibold text-light-text">{ex.exercise_name}</p>
                            <p className="text-sm text-medium-text">{getExerciseDetails(ex)}</p>
                        </li>
                    ))}
                 </ul>
            </Card>
         )}
      </div>

      <button
        onClick={() => setShowEndModal(true)}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-200 ease-in-out disabled:bg-gray-500 disabled:cursor-not-allowed"
        disabled={currentSession.exercises.length === 0}
      >
        End Workout
      </button>
    </div>

    {/* End Workout Modal */}
    {showEndModal && (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-dark-card border border-dark-border rounded-xl w-full max-w-sm p-6 relative animate-fade-in">
          <button 
            onClick={() => setShowEndModal(false)}
            className="absolute top-4 right-4 text-medium-text hover:text-white"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          
          <h3 className="text-xl font-bold text-brand-blue mb-4">One Last Thing...</h3>
          <p className="text-medium-text text-sm mb-6">
            To get accurate calorie estimates and personalized recommendations, please confirm your stats.
          </p>
          
          <div className="space-y-4 mb-6">
            <div>
                <label className="block text-sm text-medium-text mb-1">Body Weight (lbs)</label>
                <input 
                    type="number" 
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 180"
                    className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-light-text focus:border-brand-green focus:outline-none"
                />
            </div>
            <div>
                <label className="block text-sm text-medium-text mb-1">Height (e.g. 6'1")</label>
                <input 
                    type="text" 
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 6'1"
                    className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-light-text focus:border-brand-green focus:outline-none"
                />
            </div>
          </div>
          
          <button
            onClick={handleFinishWorkout}
            className="w-full bg-brand-green text-dark-bg font-bold py-3 rounded-lg hover:bg-green-400 transition-colors"
          >
            Generate Report & Finish
          </button>
        </div>
      </div>
    )}
    </>
  );
};

export default WorkoutScreen;
