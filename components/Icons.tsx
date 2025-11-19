
import React from 'react';

interface IconProps {
  className?: string;
}

export const LeilaAvatarIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className} fill="none">
    {/* Background Circle */}
    <circle cx="50" cy="50" r="50" fill="#EFF6FF" />
    
    <mask id="leila_mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
      <circle cx="50" cy="50" r="50" fill="#FFFFFF" />
    </mask>
    
    <g mask="url(#leila_mask)">
      {/* Hair Back (Bun/Updo) - Dark Slate */}
      <path d="M20 55C20 25 35 10 50 10C65 10 85 20 85 55V100H20V55Z" fill="#0F172A" />
      
      {/* Neck - Warm Tan Shadow */}
      <path d="M38 75V110H62V75" fill="#D4A373" />
      
      {/* Dress (Kebaya inspired Blue) */}
      <path d="M10 110V92C20 92 38 100 38 110" fill="#2563EB" />
      <path d="M90 110V92C80 92 62 100 62 110" fill="#2563EB" />
      
      {/* Face - Warm Tan */}
      <path d="M28 52C28 30 35 22 50 22C65 22 72 30 72 52C72 72 62 82 50 82C38 82 28 72 28 52Z" fill="#E9C4AA" />

      {/* Hair Front (Classic 50s Side Sweep Wave) */}
      <path d="M74 45C74 45 68 15 50 15C30 15 18 35 18 55C18 55 22 60 28 50C32 42 40 35 55 35C65 35 74 45 74 45Z" fill="#0F172A" />

      {/* Flower (Frangipani/Kamboja) - White with Yellow Center */}
      <g transform="translate(72, 48) rotate(-15)">
        <path d="M0 0 C-6 -6, -12 -4, -14 2 C-16 8, -10 12, 0 6 Z" fill="white" />
        <path d="M0 6 C6 12, 12 10, 14 4 C16 -2, 10 -6, 0 0 Z" fill="white" />
        <path d="M0 0 C4 -8, 8 -10, 6 -14 C0 -16, -4 -10, 0 0 Z" fill="white" />
        <path d="M0 6 C-4 14, -8 16, -6 20 C0 22, 4 16, 0 6 Z" fill="white" />
        <circle cx="0" cy="3" r="3.5" fill="#F59E0B" />
      </g>

      {/* Ear */}
      <path d="M70 58 Q 74 58 74 62 Q 74 66 70 66" fill="#E9C4AA" />

      {/* Brows */}
      <path d="M36 46Q42 43 48 46" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M54 46Q60 43 66 46" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" fill="none"/>

      {/* Eyes (Winged Cat Eye) */}
      <path d="M36 54 Q42 50 48 54 L 50 52" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M54 54 Q60 50 66 54 L 68 52" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none"/>
      
      {/* Lips (Red, 50s shape) */}
      <path d="M44 70 Q50 73 56 70 Q50 78 44 70Z" fill="#DC2626" />
      
      {/* Pearl Earring */}
      <circle cx="71" cy="65" r="2.5" fill="#F8FAFC" />
    </g>
  </svg>
);

export const MicrophoneIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
);

export const SpinnerIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="6"></line>
    <line x1="12" y1="18" x2="12" y2="22"></line>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
    <line x1="2" y1="12" x2="6" y2="12"></line>
    <line x1="18" y1="12" x2="22" y2="12"></line>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
  </svg>
);

export const DumbbellIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 6.5h11"></path>
    <path d="M6.5 17.5h11"></path>
    <path d="M6 20v-5H2v5a2 2 0 0 0 2 2h2a2 2 0 0 0 0-4zm12 0v-5h4v5a2 2 0 0 1-2 2h-2a2 2 0 0 1 0-4zM6 4v5H2V4a2 2 0 0 1 2-2h2a2 2 0 0 1 0 4zm12 0v5h4V4a2 2 0 0 0-2-2h-2a2 2 0 0 0 0 4z"></path>
  </svg>
);

export const ChatBubbleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

export const CameraIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2-2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

export const SendIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

export const XMarkIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const ClipboardIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export const GoogleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.5-2.93 3.7l3.4 2.63C20.45 18.39 22.56 15.92 22.56 12.25z"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export const KeyboardIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
    <line x1="6" y1="8" x2="6" y2="8"></line>
    <line x1="10" y1="8" x2="10" y2="8"></line>
    <line x1="14" y1="8" x2="14" y2="8"></line>
    <line x1="18" y1="8" x2="18" y2="8"></line>
    <line x1="6" y1="12" x2="6" y2="12"></line>
    <line x1="10" y1="12" x2="10" y2="12"></line>
    <line x1="14" y1="12" x2="14" y2="12"></line>
    <line x1="18" y1="12" x2="18" y2="12"></line>
    <line x1="6" y1="16" x2="18" y2="16"></line>
  </svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);
