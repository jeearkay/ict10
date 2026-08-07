import { Logo } from './Logo';

export const TopBanner = () => {
  return (
    <div className="w-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-amber-500/20 px-6 py-3.5 flex items-center justify-center gap-4 shadow-md">
      {/* Logo */}
      <div className="w-11 h-11 bg-white border-2 border-amber-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-md relative overflow-hidden p-0.5">
        <Logo />
      </div>
      
      {/* Text */}
      <div className="flex flex-col">
        <p className="text-white font-black text-sm sm:text-base tracking-tight font-sans bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent">
          Guna: ICT Online Learning
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <p className="text-amber-200/80 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Class 10 Bhutan</p>
        </div>
      </div>
      
      {/* Badge */}
      <div className="ml-auto">
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 px-4 py-1.5 rounded-full font-black text-xs tracking-wider border border-amber-300 shadow-md transform hover:scale-105 transition-all duration-200 cursor-default">
          CLASS 10
        </div>
      </div>
    </div>
  );
};
