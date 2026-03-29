import React from 'react';

const SplashScreen = ({ onComplete }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center overflow-hidden">
      <video 
        autoPlay 
        muted 
        playsInline 
        onEnded={onComplete}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>
      
      <button 
        onClick={onComplete}
        className="absolute bottom-12 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-3 px-8 rounded-full border border-white/50 transition-all active:scale-95"
      >
        Skip Intro
      </button>
    </div>
  );
};

export default SplashScreen;
