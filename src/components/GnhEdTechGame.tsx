import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Sparkles, CheckCircle2, XCircle, RotateCcw, ChevronRight, 
  BookOpen, Volume2, Globe, Flag, ShieldCheck, Heart, Leaf, Building2,
  Bus, Hospital, GraduationCap, LandPlot, Sprout, Trees, Landmark, Mountain,
  Award, ArrowRight, Lightbulb, Zap, Check, Lock, Star
} from 'lucide-react';
import { soundFx } from '../lib/audio';
import { speakText, stopSpeech } from '../lib/speech';
import { UserStats } from '../types';
import { CodeFormattedText } from './CodeFormattedText';

interface GnhEdTechGameProps {
  userStats: UserStats;
  onAwardXp: (amount: number, reason?: string) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export interface SectorQuestion {
  id: string;
  sector: string;
  sectorIcon: string;
  locationName: string;
  title: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  gnhPillar: 'Good Governance' | 'Socio-Economic Development' | 'Cultural Preservation' | 'Environmental Conservation';
}

const SECTOR_QUESTIONS: SectorQuestion[] = [
  {
    id: 'place_gasa',
    sector: 'Local Places & Valleys',
    sectorIcon: '📌',
    locationName: 'Gasa & Remote Dzongkhags',
    title: 'Bridging Mountain Valleys with Cloud ICT',
    question: 'How does cloud technology help a student living in remote Laya (Gasa Dzongkhag) study the same ICT lessons as a student in Thimphu?',
    options: [
      'They have to travel 3 days on foot to Thimphu to collect paper books.',
      'Cloud storage and Google Classroom let teachers share digital notes and videos over internet across all 20 Dzongkhags.',
      'A drone delivers paper worksheets to every home daily.',
      'Remote students are not allowed to learn computer science.'
    ],
    correctAnswer: 1,
    explanation: 'Cloud-based education platforms allow equal access to learning materials for all students across Bhutan, regardless of how remote their valley is!',
    gnhPillar: 'Socio-Economic Development'
  },
  {
    id: 'religion_kanjur',
    sector: 'Religion & Spirituality',
    sectorIcon: '☸️',
    locationName: 'National Library & Monasteries',
    title: 'Digitizing Sacred Texts & Prayer Wheels',
    question: 'How is digital technology used in Bhutan to preserve ancient Buddhist scriptures like the Kanjur and Tenjur?',
    options: [
      'By converting physical paper pages into digital photos and searchable PDF databases stored safely in cloud backups.',
      'By throwing away physical scriptures and replacing them with video games.',
      'By printing scriptures only on plastic plastic cards.',
      'Scriptures are deleted from computer hard drives to save space.'
    ],
    correctAnswer: 0,
    explanation: 'Digital archiving protects centuries-old wooden-block prints and sacred manuscripts from physical decay, fires, and floods, preserving spiritual heritage forever.',
    gnhPillar: 'Cultural Preservation'
  },
  {
    id: 'industry_bakery',
    sector: 'Industries & Commerce',
    sectorIcon: '🥐',
    locationName: 'Charro Bakery, Paro Town',
    title: 'Small Business Online Ordering (SaaS)',
    question: 'Charro Bakery in Paro Town wants to take online cake orders from customers across town. They do not have an IT team. What cloud model should they use?',
    options: [
      'IaaS: Buy expensive server hardware and build a custom server room.',
      'SaaS (Software as a Service): Use a ready-made online order website or app like Google Forms without writing backend server code.',
      'PaaS: Write complex C++ operating system kernels from scratch.',
      'Shut down the bakery because small businesses cannot use computers.'
    ],
    correctAnswer: 1,
    explanation: 'SaaS applications (like Google Forms or web order tools) allow small shops to accept online orders instantly without buying server equipment!',
    gnhPillar: 'Socio-Economic Development'
  },
  {
    id: 'transport_pass',
    sector: 'Transport & Roads',
    sectorIcon: '🚌',
    locationName: 'Dochula Pass & Bus Terminals',
    title: 'Smart Bus Ticketing & Road Alerts',
    question: 'How does digital transportation technology make traveling across Bhutan mountain passes safer and more convenient?',
    options: [
      'By requiring passengers to stand in line overnight at bus stops in snowstorms.',
      'Online ticketing systems allow passengers to book bus seats on smartphones, while GPS route apps warn drivers about road conditions.',
      'By removing all road signs and relying purely on luck.',
      'Buses can only operate if they carry physical desktop computers inside.'
    ],
    correctAnswer: 1,
    explanation: 'Digital ticketing saves time and travel expenses, while real-time GPS road alerts keep drivers safe when crossing high passes like Dochula and Chelela.',
    gnhPillar: 'Good Governance'
  },
  {
    id: 'local_ndi',
    sector: 'Local Technology & Identity',
    sectorIcon: '🆔',
    locationName: 'GovTech Agency, Thimphu',
    title: 'Bhutan NDI & Dzongkha Computing',
    question: 'Bhutan launched "Bhutan NDI" as the world’s first national Self-Sovereign Digital Identity. What is a key benefit of Bhutan NDI for citizens?',
    options: [
      'It forces everyone to share their passwords on public Facebook groups.',
      'It lets citizens securely prove who they are for bank and government services on their phone while protecting personal data privacy.',
      'It deletes citizen citizenship cards automatically every month.',
      'It can only be used by foreign tourists.'
    ],
    correctAnswer: 1,
    explanation: 'Bhutan NDI uses secure digital cryptography so citizens can log in to bank apps, school portals, and health services safely without risking identity theft.',
    gnhPillar: 'Good Governance'
  },
  {
    id: 'hospital_jdwnrh',
    sector: 'Hospital & Healthcare',
    sectorIcon: '🏥',
    locationName: 'JDWNRH Hospital, Thimphu',
    title: 'Hybrid Cloud Patient Records & Telemedicine',
    question: 'JDWNRH needs to keep patient medical records private on a secure server, but needs a public website for doctor visiting hours. Which cloud model fits best?',
    options: [
      'Public Cloud only: Store all confidential patient surgeries on public Facebook posts.',
      'Hybrid Cloud: Keep secret patient health records on a Private Cloud and public visiting hours on a Public Cloud.',
      'Private Cloud only with no internet access at all.',
      'Write patient medical reports on paper sticky notes and stick them on hospital trees.'
    ],
    correctAnswer: 1,
    explanation: 'Hybrid Cloud combines the supreme privacy of a Private Cloud for patient data with the easy accessibility of a Public Cloud for public visiting hours!',
    gnhPillar: 'Socio-Economic Development'
  },
  {
    id: 'education_paperless',
    sector: 'Education & Schools',
    sectorIcon: '🎓',
    locationName: 'Karma Academy & Bhutan Classrooms',
    title: 'Paperless Classroom & Digital Submissions',
    question: 'How does implementing a "Paperless Classroom" with Google Workspace directly support GNH Environmental Conservation in Bhutanese schools?',
    options: [
      'By requiring students to print 100 pages of paper every day.',
      'By submitting homework and quizzes digitally, reducing paper waste, saving trees, and cutting school printing expenses.',
      'By throwing away all school desks and sitting on the floor.',
      'By turning off electricity in all schools.'
    ],
    correctAnswer: 1,
    explanation: 'Paperless digital submissions reduce wood consumption for paper manufacturing, keeping Bhutan’s forests pristine while organizing student grades cleanly!',
    gnhPillar: 'Environmental Conservation'
  },
  {
    id: 'bank_mbob',
    sector: 'Banks & Digital Finance',
    sectorIcon: '🏦',
    locationName: 'Bank of Bhutan & Farmer Markets',
    title: 'QR Payments & Cyber Security',
    question: 'When buying fresh vegetables at Centenary Farmers Market using mBoB QR code, what should a student do if they receive a fake SMS claiming they won Nu 50,000?',
    options: [
      'Send their bank account PIN and OTP immediately.',
      'Never share OTP or passwords, verify news on official .gov.bt or bank channels, and report phishing scams.',
      'Forward the fake SMS to all class friends.',
      'Delete the bank app and throw away the mobile phone.'
    ],
    correctAnswer: 1,
    explanation: 'Responsible digital citizenship means protecting personal credentials (PINs/OTPs) and recognizing fraudulent SMS messages to keep funds safe.',
    gnhPillar: 'Good Governance'
  },
  {
    id: 'agri_apple',
    sector: 'Agriculture & Farming',
    sectorIcon: '🌾',
    locationName: 'Apple Orchards & Cardamom Farms',
    title: 'Smart Farming & Weather Warning Alerts',
    question: 'How does mobile technology help apple farmers in Paro and cardamom farmers in Samtse earn better livelihoods?',
    options: [
      'Farmers use phone apps to check real-time market prices, receive frost alerts, and arrange fair sales directly with buyers.',
      'Phones make apples grow 10 times larger instantly.',
      'Farmers use computers to replace water irrigation with electricity.',
      'Technology prevents farmers from selling crops.'
    ],
    correctAnswer: 0,
    explanation: 'ICT empowers farmers with accurate market pricing and weather warnings, preventing crop loss and preventing middleman exploitation.',
    gnhPillar: 'Socio-Economic Development'
  },
  {
    id: 'env_manas',
    sector: 'Environment & Nature',
    sectorIcon: '🌲',
    locationName: 'Royal Manas National Park',
    title: 'Wildlife Camera Traps & Carbon Tracking',
    question: 'Bhutan is famous for being a carbon-negative country with over 70% forest cover. How does technology protect Royal Bengal Tigers in Manas National Park?',
    options: [
      'By placing solar-powered motion-sensor camera traps that record tiger movement and alert forest rangers to poachers.',
      'By building high-rise concrete skyscrapers inside the jungle.',
      'By playing loud techno music in the forest 24 hours a day.',
      'By cutting down trees to install wire cables.'
    ],
    correctAnswer: 0,
    explanation: 'Motion camera traps and satellite forest monitoring allow rangers to protect endangered wildlife without disturbing natural Himalayan habitats!',
    gnhPillar: 'Environmental Conservation'
  },
  {
    id: 'culture_tshechu',
    sector: 'Culture & Traditional Arts',
    sectorIcon: '🎭',
    locationName: 'Paro & Thimphu Tshechu',
    title: 'Preserving Sacred Mask Dances & Copyright',
    question: 'A photographer takes a beautiful photo of a Sacred Tshechu Cham dance and licenses it under CC BY-NC (Creative Commons Non-Commercial). What does this mean?',
    options: [
      'Anyone can sell the photo for a million dollars.',
      'Others can share and use the photo for non-commercial school projects with proper author credit, but companies cannot use it in paid ads.',
      'The photo can never be viewed on any computer.',
      'The photographer loses all ownership rights forever.'
    ],
    correctAnswer: 1,
    explanation: 'CC BY-NC allows cultural photos and educational materials to be shared freely for learning while preventing commercial companies from profiting without permission.',
    gnhPillar: 'Cultural Preservation'
  },
  {
    id: 'tourism_taktsang',
    sector: 'Tourism & Visitors',
    sectorIcon: '🏔️',
    locationName: 'Paro Taktsang (Tiger\'s Nest)',
    title: 'Sustainable Tourism & Digital Trail Passes',
    question: 'How does Bhutan’s digital tourism portal support Sustainable Development Fee (SDF) collection for cultural preservation?',
    options: [
      'By letting tourists visit delicate heritage sites in unlimited uncounted crowds.',
      'By processing SDF payments digitally online, which directly funds free healthcare, education, and trail maintenance across Bhutan.',
      'By banning tourists from taking photos with their eyes.',
      'By deleting all tourist passports at Paro Airport.'
    ],
    correctAnswer: 1,
    explanation: 'Digital tourism portals manage visitor numbers sustainably, generating national revenue that pays for free education and public healthcare under GNH values!',
    gnhPillar: 'Cultural Preservation'
  }
];

export const GnhEdTechGame: React.FC<GnhEdTechGameProps> = ({
  userStats,
  onAwardXp,
  onUnlockBadge
}) => {
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [completedSectors, setCompletedSectors] = useState<string[]>([]);
  const [filterPillar, setFilterPillar] = useState<string>('ALL');
  const [speechActive, setSpeechActive] = useState<boolean>(false);

  const currentQ = SECTOR_QUESTIONS[activeQuestionIdx];

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedOption === currentQ.correctAnswer;

    if (isCorrect) {
      soundFx.playSuccess();
      setScore((prev) => prev + 1);
      onAwardXp(25, `Correct Answer: ${currentQ.sector}`);

      if (!completedSectors.includes(currentQ.id)) {
        const updated = [...completedSectors, currentQ.id];
        setCompletedSectors(updated);

        // Check Badge Unlocks
        if (updated.length >= 3 && !userStats.unlockedBadges.includes('badge-gnh-guardian')) {
          onUnlockBadge('badge-gnh-guardian');
        }
        if (updated.length >= 6 && !userStats.unlockedBadges.includes('badge-edtech-pioneer')) {
          onUnlockBadge('badge-edtech-pioneer');
        }
        if (updated.length === SECTOR_QUESTIONS.length && !userStats.unlockedBadges.includes('badge-local-tech-champion')) {
          onUnlockBadge('badge-local-tech-champion');
        }
      }
    } else {
      soundFx.playRetry();
    }
  };

  const handleNextQuestion = () => {
    stopSpeech();
    setSpeechActive(false);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    if (activeQuestionIdx < SECTOR_QUESTIONS.length - 1) {
      setActiveQuestionIdx((prev) => prev + 1);
    } else {
      setActiveQuestionIdx(0); // loop or finish
    }
  };

  const handleReadAloud = (text: string) => {
    if (speechActive) {
      stopSpeech();
      setSpeechActive(false);
    } else {
      setSpeechActive(true);
      speakText(text, 1.0, () => setSpeechActive(false));
    }
  };

  const filteredQuestions = SECTOR_QUESTIONS.filter((q) => {
    if (filterPillar === 'ALL') return true;
    return q.gnhPillar === filterPillar;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      {/* MODULE HEADER */}
      <div className="bg-gradient-to-r from-[#6D071A] via-amber-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border-4 border-[#FFCC33] shadow-[8px_8px_0px_0px_#1A1A1A] relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#FFCC33] text-[#1A1A1A] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 border border-[#1A1A1A]">
              <Landmark className="w-4 h-4 text-[#6D071A]" />
              GNH Integration & EdTech Framework
            </span>
            <span className="bg-emerald-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase">
              Bhutan Class 10 ICT
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-serif text-yellow-300">
            ☸️ Local Technology & GNH Value Quest
          </h1>

          <p className="text-sm sm:text-base text-amber-100/90 max-w-3xl leading-relaxed font-medium">
            Discover how technology serves Gross National Happiness across Bhutan! Answer interactive questions on local places, monasteries, bakeries, transport, hospitals, schools, banks, farming, environment, traditional culture, and tourism.
          </p>

          {/* BADGES PROGRESS BAR & GNH IMPACT METER */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4 text-xs font-bold text-amber-200">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-amber-400/40">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>Completed Sectors: {completedSectors.length} / {SECTOR_QUESTIONS.length}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-amber-400/40">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Correct Score: {score}</span>
              </div>
            </div>
            
            {/* GNH Impact Meter */}
            <div className="flex items-center gap-2 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/40 flex-1 sm:max-w-xs">
              <Heart className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-emerald-100 font-bold text-[10px] uppercase tracking-wider">GNH Impact Meter</span>
                  <span className="text-emerald-300 font-black">{Math.round((score / SECTOR_QUESTIONS.length) * 100)}%</span>
                </div>
                <div className="w-full bg-emerald-900/50 rounded-full h-1.5 overflow-hidden border border-emerald-800">
                  <motion.div 
                    className="bg-gradient-to-r from-emerald-500 to-green-300 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round((score / SECTOR_QUESTIONS.length) * 100)}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PILLAR FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {['ALL', 'Good Governance', 'Socio-Economic Development', 'Cultural Preservation', 'Environmental Conservation'].map((pillar) => (
          <button
            key={pillar}
            onClick={() => {
              setFilterPillar(pillar);
              const foundIdx = SECTOR_QUESTIONS.findIndex(q => pillar === 'ALL' || q.gnhPillar === pillar);
              if (foundIdx !== -1) setActiveQuestionIdx(foundIdx);
              setSelectedOption(null);
              setIsAnswerSubmitted(false);
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap cursor-pointer transition-all ${
              filterPillar === pillar
                ? 'bg-[#FFCC33] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A]'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-gray-200 dark:border-slate-700 hover:bg-amber-100'
            }`}
          >
            {pillar === 'ALL' ? '🌍 All 12 Sectors' : pillar}
          </button>
        ))}
      </div>

      {/* SECTOR SELECTOR GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {SECTOR_QUESTIONS.map((q, idx) => {
          const isDone = completedSectors.includes(q.id);
          const isActive = idx === activeQuestionIdx;

          return (
            <button
              key={q.id}
              onClick={() => {
                setActiveQuestionIdx(idx);
                setSelectedOption(null);
                setIsAnswerSubmitted(false);
              }}
              className={`p-3 rounded-2xl border-2 text-left cursor-pointer transition-all flex flex-col justify-between h-24 ${
                isActive
                  ? 'bg-[#FFCC33] text-[#1A1A1A] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#6D071A] scale-102'
                  : isDone
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 border-emerald-500'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-gray-300 dark:border-slate-700 hover:border-amber-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{q.sectorIcon}</span>
                {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-100" />}
              </div>
              <div>
                <div className="text-[10px] uppercase font-black opacity-75 truncate">{q.sector}</div>
                <div className="text-xs font-bold truncate">{q.locationName}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* QUESTION DISPLAY CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-4 border-[#1A1A1A] dark:border-slate-700 p-6 sm:p-8 shadow-[8px_8px_0px_0px_#1A1A1A] space-y-6">
        
        {/* CARD TOP META */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentQ.sectorIcon}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-400">
                  {currentQ.sector}
                </span>
                <span className="bg-sky-100 dark:bg-sky-950 text-sky-900 dark:text-sky-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-sky-400">
                  {currentQ.gnhPillar}
                </span>
              </div>
              <h3 className="font-serif font-black text-lg sm:text-xl text-slate-900 dark:text-white mt-1">
                {currentQ.title} ({currentQ.locationName})
              </h3>
            </div>
          </div>

          <button
            onClick={() => handleReadAloud(`${currentQ.title}. ${currentQ.question}`)}
            className={`p-2.5 rounded-2xl border-2 border-[#1A1A1A] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
              speechActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-amber-200'
            }`}
            title="Read Question Aloud"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">{speechActive ? 'Stop Reading' : 'Listen'}</span>
          </button>
        </div>

        {/* QUESTION TEXT */}
        <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
          <CodeFormattedText text={currentQ.question} />
        </div>

        {/* OPTIONS GRID */}
        <div className="grid grid-cols-1 gap-3">
          {currentQ.options.map((opt, oIdx) => {
            const isSelected = selectedOption === oIdx;
            const isCorrect = oIdx === currentQ.correctAnswer;

            let btnStyle = 'bg-slate-50 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-slate-800';

            if (isAnswerSubmitted) {
              const userGotItRight = selectedOption === currentQ.correctAnswer;
              if (isCorrect && userGotItRight) {
                btnStyle = 'bg-emerald-100 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-100 border-emerald-500 font-bold';
              } else if (isSelected && !userGotItRight) {
                btnStyle = 'bg-rose-100 dark:bg-rose-950 text-rose-950 dark:text-rose-100 border-rose-500 font-bold';
              }
            } else if (isSelected) {
              btnStyle = 'bg-[#FFCC33] text-[#1A1A1A] border-[#1A1A1A] font-black shadow-[3px_3px_0px_0px_#1A1A1A]';
            }

            return (
              <button
                key={oIdx}
                disabled={isAnswerSubmitted}
                onClick={() => handleSelectOption(oIdx)}
                className={`p-4 rounded-2xl border-2 text-left text-xs sm:text-sm font-medium transition-all flex items-start justify-between gap-3 cursor-pointer ${btnStyle}`}
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <span className="leading-snug pt-0.5">{opt}</span>
                </div>

                {isAnswerSubmitted && isCorrect && selectedOption === currentQ.correctAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                )}
                {isAnswerSubmitted && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* SUBMIT / NEXT ACTION BAR */}
        <div className="pt-2 flex flex-wrap items-center justify-end gap-4 border-t border-gray-200 dark:border-slate-800">

          {!isAnswerSubmitted ? (
            <button
              disabled={selectedOption === null}
              onClick={handleSubmitAnswer}
              className={`px-6 py-3 rounded-2xl font-black text-xs sm:text-sm border-2 border-[#1A1A1A] transition-all flex items-center gap-2 ${
                selectedOption !== null
                  ? 'bg-[#FFCC33] text-[#1A1A1A] hover:bg-yellow-400 cursor-pointer shadow-[3px_3px_0px_0px_#1A1A1A] active:scale-95'
                  : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
              }`}
            >
              <span>Check Answer (+25 XP)</span>
              <Check className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 bg-[#6D071A] hover:bg-amber-900 text-yellow-300 rounded-2xl font-black text-xs sm:text-sm border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] cursor-pointer transition-all flex items-center gap-2 active:scale-95"
            >
              <span>Next Sector Quest</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* EXPLANATION FEEDBACK BOX */}
        {isAnswerSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl border-2 text-xs sm:text-sm leading-relaxed space-y-2 ${
              selectedOption === currentQ.correctAnswer
                ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-400 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/80 border-amber-400 text-amber-900 dark:text-amber-200'
            }`}
          >
            <div className="font-extrabold flex items-center gap-1.5 text-sm">
              <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>GNH Insight & Explanation:</span>
            </div>
            <p>{currentQ.explanation}</p>
          </motion.div>
        )}

      </div>

    </div>
  );
};
