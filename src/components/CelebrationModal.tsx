import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Sparkles, X, Star } from 'lucide-react';
import { soundFx } from '../lib/audio';

const BHUTANESE_BUDDHIST_QUOTES = [
  "May the light of wisdom dispel all ignorance!",
  "Step by step, like climbing to Paro Taktsang, patience and dedication lead to the summit of knowledge.",
  "Like the clear waters of the Pho Chhu, may your mind remain tranquil, focused, and pure.",
  "Wisdom is the ultimate jewel that no thief can steal, enriching your journey for Gross National Happiness.",
  "As seeds planted in fertile soil sprout into grand cypress trees, every task learned strengthens your intellect.",
  "Mindfulness in thought and diligence in practice unlock the gates to true mastery.",
  "May your dedication bring happiness to yourself and benefit all sentient beings.",
  "A calm mind is like a serene Himalayan lake, mirroring truth and understanding clearly.",
  "Great achievements are built with steady perseverance, like the ancient stone walls of Punakha Dzong.",
  "Ignorance is the root of darkness; knowledge is the golden lamp that illuminates the world.",
  "With right effort and continuous practice, even the most complex challenge transforms into wisdom.",
  "May your quest for learning shine bright like the golden roof of Tashichho Dzong.",
  "Every line of code and concept mastered is a step along the Noble Path of enlightenment.",
  "In the spirit of Gross National Happiness, let your wisdom bring harmony and progress to the Kingdom.",
  "Like prayer flags fluttering in the mountain breeze, spread your knowledge far and wide for the good of all."
];

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  badgeName?: string;
  badgeIcon?: string;
  xpAwarded?: number;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badgeName,
  badgeIcon,
  xpAwarded
}) => {
  const [randomQuote, setRandomQuote] = useState<string>(BHUTANESE_BUDDHIST_QUOTES[0]);

  useEffect(() => {
    if (isOpen) {
      soundFx.playSuccess();
      const randomIndex = Math.floor(Math.random() * BHUTANESE_BUDDHIST_QUOTES.length);
      setRandomQuote(BHUTANESE_BUDDHIST_QUOTES[randomIndex]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-[#6D071A] text-white rounded-3xl border-4 border-[#FFCC33] p-6 shadow-[12px_12px_0px_0px_#1A1A1A] overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Achievement unlocked"
        >
          {/* Subtle Paro Taktsang Background Accent */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#FFCC33]/20 rounded-full blur-xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-[#1A1A1A] text-amber-200 hover:text-white border border-[#FFCC33] cursor-pointer transition-transform active:scale-90"
            aria-label="Close celebration modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header Icon */}
          <div className="text-center space-y-3 mt-2">
            <motion.div
              initial={{ rotate: -10, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="w-20 h-20 mx-auto rounded-full bg-[#FFCC33] border-4 border-[#1A1A1A] flex items-center justify-center text-4xl shadow-[4px_4px_0px_0px_#1A1A1A] relative"
            >
              {badgeIcon || '🏆'}
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border border-[#1A1A1A]">
                <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
              </div>
            </motion.div>

            <div>
              <div className="inline-flex items-center gap-1 bg-[#1A1A1A] text-[#FFCC33] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#FFCC33] mb-2">
                <Star className="w-3.5 h-3.5 fill-[#FFCC33]" />
                <span>Kadrinchey! Achievement Unlocked</span>
              </div>
              <h3 className="text-2xl font-black font-serif text-amber-100">{title}</h3>
              <p className="text-xs text-amber-200/90 font-medium mt-1 leading-relaxed">{subtitle}</p>
            </div>
          </div>

          {/* Badge & XP Info Box */}
          <div className="my-5 bg-[#1A1A1A]/90 p-4 rounded-2xl border-2 border-[#FFCC33] text-center space-y-2">
            {badgeName && (
              <div className="flex items-center justify-center gap-2 text-yellow-300 font-extrabold text-sm">
                <Award className="w-5 h-5 text-[#FFCC33]" />
                <span>Badge Unlocked: {badgeName}</span>
              </div>
            )}

            {xpAwarded && xpAwarded > 0 && (
              <div className="inline-block bg-[#6D071A] border-2 border-[#FFCC33] px-4 py-1.5 rounded-xl font-black text-xs text-amber-100 shadow-[2px_2px_0px_0px_#FFCC33]">
                +{xpAwarded} XP Earned!
              </div>
            )}
          </div>

          {/* Motivational Quote in English (Buddhist & Bhutanese Context) */}
          <div className="text-center text-xs font-serif text-amber-200/90 italic bg-black/20 p-3 rounded-xl border border-amber-500/30 leading-relaxed">
            "{randomQuote}"
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-5 py-3 bg-[#FFCC33] hover:bg-[#ffe066] text-[#1A1A1A] font-black text-xs uppercase tracking-wider border-2 border-[#1A1A1A] rounded-2xl shadow-[4px_4px_0px_0px_#1A1A1A] cursor-pointer transition-all active:translate-y-0.5"
          >
            Continue Learning Quest 🚀
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
