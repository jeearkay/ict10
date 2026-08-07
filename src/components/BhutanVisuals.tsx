import React from 'react';

export const ArcheryBowIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="4">
    {/* Bow curve */}
    <path d="M 20 10 C 70 30 70 70 20 90" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    {/* Bow string */}
    <line x1="20" y1="10" x2="20" y2="90" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
    {/* Arrow */}
    <line x1="10" y1="50" x2="85" y2="50" stroke="#EAB308" strokeWidth="5" strokeLinecap="round" />
    <path d="M 85 50 L 70 42 L 75 50 L 70 58 Z" fill="#EAB308" />
    <path d="M 10 50 L 20 45 M 10 50 L 20 55" stroke="#EAB308" strokeWidth="3" />
  </svg>
);

export const TaktsangMonasteryIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none">
    {/* Cliff */}
    <path d="M 10 110 L 40 50 L 60 70 L 90 20 L 110 110 Z" fill="#334155" opacity="0.8" />
    {/* Monastery Main Dzong Roof */}
    <path d="M 45 45 L 75 45 L 80 52 L 40 52 Z" fill="#EAB308" />
    <rect x="48" y="52" width="24" height="18" fill="#B91C1C" />
    {/* Gold pinnacle */}
    <path d="M 60 35 L 60 45 M 57 38 L 63 38" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
    {/* Mountain mist clouds */}
    <path d="M 15 90 C 25 80 45 80 55 90 C 65 100 85 100 95 90" stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
  </svg>
);

export const BhutanDragonIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    {/* Stylized Druk Dragon Silhouette */}
    <path
      d="M 20 70 C 10 50 30 30 50 40 C 65 20 85 30 80 50 C 95 55 90 75 70 70 C 60 85 35 90 20 70 Z"
      fill="#F59E0B"
      opacity="0.9"
    />
    <circle cx="75" cy="45" r="4" fill="#B91C1C" />
    <path d="M 80 50 Q 90 40 95 48" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
    {/* Jewels in claws */}
    <circle cx="30" cy="75" r="3" fill="#FFFFFF" stroke="#D97706" strokeWidth="2" />
    <circle cx="65" cy="75" r="3" fill="#FFFFFF" stroke="#D97706" strokeWidth="2" />
  </svg>
);

export const CloudTopologyIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor">
    <path
      d="M 25 60 C 15 60 10 50 20 40 C 20 25 35 20 50 25 C 60 15 80 20 80 35 C 90 40 90 55 80 60 Z"
      fill="#3B82F6"
      fillOpacity="0.15"
      stroke="#2563EB"
      strokeWidth="4"
    />
    <circle cx="35" cy="45" r="4" fill="#1D4ED8" />
    <circle cx="50" cy="40" r="4" fill="#1D4ED8" />
    <circle cx="65" cy="45" r="4" fill="#1D4ED8" />
    <line x1="35" y1="45" x2="50" y2="40" stroke="#2563EB" strokeWidth="2" />
    <line x1="50" y1="40" x2="65" y2="45" stroke="#2563EB" strokeWidth="2" />
  </svg>
);

export const PrayerFlagIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="10" x2="20" y2="90" stroke="#1A1A1A" strokeWidth="8" strokeLinecap="round" />
    <path d="M 24 15 L 78 32 L 24 48 Z" fill="#FFCC33" stroke="#1A1A1A" strokeWidth="4" strokeLinejoin="round" />
    <path d="M 24 50 L 72 64 L 24 78 Z" fill="#F59E0B" stroke="#1A1A1A" strokeWidth="4" strokeLinejoin="round" />
    <circle cx="20" cy="10" r="7" fill="#DC2626" stroke="#1A1A1A" strokeWidth="4" />
  </svg>
);

