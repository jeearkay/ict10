import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Award, CheckCircle2 } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  color: string;
  shape: 'circle' | 'square' | 'diamond' | 'star' | 'ribbon';
  delay: number;
  duration: number;
}

interface ParticleConfettiProps {
  isActive: boolean;
  rewardXp?: number;
  levelTitle?: string;
  onClose?: () => void;
}

const COLORS = [
  '#FFCC33', // Bhutan Gold
  '#6D071A', // Maroon
  '#10B981', // Emerald
  '#3B82F6', // Sapphire
  '#EC4899', // Ruby
  '#8B5CF6', // Amethyst
  '#F59E0B', // Amber
  '#06B6D4', // Cyan
];

export const ParticleConfetti: React.FC<ParticleConfettiProps> = ({
  isActive,
  rewardXp = 50,
  levelTitle,
  onClose,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (isActive) {
      // 1. Generate particle array for motion.div animations
      const particleCount = 65;
      const newParticles: Particle[] = Array.from({ length: particleCount }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 200 + Math.random() * 400;
        const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
        const startY = window.innerHeight * 0.4 + (Math.random() - 0.5) * 100;

        return {
          id: i,
          x: startX,
          y: startY,
          targetX: startX + Math.cos(angle) * velocity,
          targetY: startY + Math.sin(angle) * velocity + 150, // add gravity effect
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 720,
          scale: 0.6 + Math.random() * 0.8,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          shape: (['circle', 'square', 'diamond', 'star', 'ribbon'] as const)[
            Math.floor(Math.random() * 5)
          ],
          delay: Math.random() * 0.2,
          duration: 1.8 + Math.random() * 1.2,
        };
      });

      setParticles(newParticles);

      // 2. Trigger multi-angle canvas confetti bursts
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        colors: COLORS,
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });

      // Automatically hide after duration
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, 4500);

      return () => clearTimeout(timer);
    } else {
      setParticles([]);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
      {/* Motion Particles Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              x: p.x,
              y: p.y,
              scale: 0,
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              x: p.targetX,
              y: p.targetY,
              scale: [0, p.scale, p.scale * 0.8, 0],
              rotate: p.rotation + p.rotationSpeed,
              opacity: [1, 1, 0.9, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            style={{
              position: 'absolute',
              width: p.shape === 'ribbon' ? '14px' : '10px',
              height: p.shape === 'ribbon' ? '6px' : '10px',
              backgroundColor: p.color,
              borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'diamond' ? '2px' : '3px',
              transform: p.shape === 'diamond' ? 'rotate(45deg)' : undefined,
              boxShadow: `0 0 8px ${p.color}aa`,
            }}
          />
        ))}
      </div>

      {/* Level Completion Popup Banner with framer-motion */}
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -20 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="pointer-events-auto bg-[#1A1A1A] border-4 border-[#FFCC33] rounded-3xl p-6 sm:p-8 max-w-md w-11/12 text-center shadow-[10px_10px_0px_0px_#6D071A] relative"
        >
          {/* Top Badge */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#FFCC33] border-2 border-[#1A1A1A] text-[#1A1A1A] px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#1A1A1A]">
            <Sparkles className="w-4 h-4 text-[#6D071A]" /> Quest Level Complete!
          </div>

          <div className="pt-3 space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-[#6D071A] to-[#FFCC33] p-1 shadow-lg border-2 border-[#FFCC33] flex items-center justify-center animate-bounce">
              <div className="w-full h-full rounded-full bg-[#1A1A1A] flex items-center justify-center text-3xl">
                🐉
              </div>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-serif">
                Tashi Delek!
              </h3>
              {levelTitle && (
                <p className="text-xs font-bold text-[#FFCC33] mt-1">
                  {levelTitle}
                </p>
              )}
            </div>

            {rewardXp > 0 ? (
              <div className="inline-flex items-center gap-2 bg-[#6D071A] border-2 border-[#FFCC33] px-5 py-2 rounded-2xl text-amber-100 font-extrabold text-sm shadow-[3px_3px_0px_0px_#FFCC33]">
                <Award className="w-5 h-5 text-[#FFCC33]" />
                <span>+{rewardXp} XP Awarded</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-emerald-900 border-2 border-emerald-400 px-5 py-2 rounded-2xl text-emerald-100 font-extrabold text-xs shadow-[3px_3px_0px_0px_#10B981]">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Quest Re-visited (0 XP on retry)</span>
              </div>
            )}

            <p className="text-xs text-amber-100/90 leading-relaxed font-medium">
              You have mastered these ICT concepts! Continue your journey up the sacred Paro Taktsang mountain trail.
            </p>

            <button
              onClick={onClose}
              className="w-full py-3 bg-[#FFCC33] hover:bg-yellow-400 border-2 border-[#1A1A1A] rounded-2xl text-[#1A1A1A] font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_#1A1A1A] transition-transform active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#6D071A]" />
              <span>Continue Quest</span>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
