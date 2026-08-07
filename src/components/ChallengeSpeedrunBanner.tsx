import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Swords, Clock, CheckCircle2, Flag, Zap, Trophy, X } from 'lucide-react';
import { QuestChallenge } from '../types';

interface ChallengeSpeedrunBannerProps {
  challenge: QuestChallenge;
  elapsedSeconds: number;
  onFinishSpeedrun: (completedScore?: number) => void;
  onCancelSpeedrun: () => void;
}

export const ChallengeSpeedrunBanner: React.FC<ChallengeSpeedrunBannerProps> = ({
  challenge,
  elapsedSeconds,
  onFinishSpeedrun,
  onCancelSpeedrun
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}s`;
  };

  const isChallenger = challenge.challengerUid === 'current-local-user' || challenge.challengerName === 'Guest Student';
  const opponentName = isChallenger ? challenge.opponentName : challenge.challengerName;
  const targetTime = isChallenger ? challenge.opponentTimeSeconds : challenge.challengerTimeSeconds;

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 bg-[#6D071A] text-white border-b-4 border-[#1A1A1A] shadow-[0_4px_12px_rgba(0,0,0,0.3)] px-4 py-3"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Challenge Info */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#FFCC33] text-[#1A1A1A] rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] animate-pulse">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-[#FFCC33] tracking-wider bg-black/30 px-2 py-0.5 rounded-md border border-white/20">
                ACTIVE QUEST CHALLENGE SPEEDRUN
              </span>
              <span className="text-xs text-white/80 font-medium hidden md:inline">
                vs <strong className="text-white">{opponentName}</strong>
              </span>
            </div>
            <h4 className="text-sm font-bold text-white font-serif line-clamp-1">
              {challenge.targetTitle}
            </h4>
          </div>
        </div>

        {/* Live Timer & Target */}
        <div className="flex items-center gap-4">
          {targetTime && (
            <div className="hidden sm:flex flex-col items-end text-xs text-amber-200">
              <span className="font-semibold text-[10px] uppercase tracking-wider">Time to beat</span>
              <span className="font-mono font-bold">{formatTime(targetTime)}</span>
            </div>
          )}

          <div className="flex items-center gap-2 bg-[#1A1A1A] text-[#FFCC33] px-3.5 py-1.5 rounded-xl border-2 border-white/20 font-mono text-base font-black shadow-[2px_2px_0px_0px_#000000]">
            <Clock className="w-4 h-4 text-white animate-spin" style={{ animationDuration: '3s' }} />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onFinishSpeedrun(100)}
              className="bg-[#00B0FF] hover:bg-cyan-400 text-[#1A1A1A] px-3 py-1.5 rounded-xl border-2 border-[#1A1A1A] font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#1A1A1A] flex items-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete Run
            </button>

            <button
              onClick={onCancelSpeedrun}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Cancel Challenge"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
