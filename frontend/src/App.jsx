import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MockAuthModal from './components/MockAuthModal';
import ProfileSetup from './pages/ProfileSetup';

function App() {
  const [user, setUser] = useState(null);
  const [isSplashing, setIsSplashing] = useState(true);

  // Global Cinematic Intro Check
  useEffect(() => {
    const splashTimer = setTimeout(() => {
        setIsSplashing(false);
    }, 4000); // 4 seconds of global intro
    
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
        setUser(JSON.parse(storedUser));
    }
    
    return () => clearTimeout(splashTimer);
  }, []);

  const handleLogin = (userData, token) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
  };

  const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
  };

  const handleProfileComplete = (updatedUser) => {
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
  };

  if (isSplashing) {
      return (
          <div className="h-screen w-screen bg-bg-dark flex items-center justify-center overflow-hidden">
             <video 
                autoPlay 
                muted 
                loop 
                playsInline
                className="absolute inset-x-0 top-0 w-full h-full object-cover animate-fade-in"
              >
                <source src="/intro.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/10 via-bg-dark/30 to-bg-dark" />
              <div className="relative z-10 text-center animate-scale-in">
                 <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary via-cyan-300 to-emerald-400 tracking-tighter mb-2 py-4">FeedLoop</h1>
                 <p className="text-slate-400 font-bold tracking-[0.5em] uppercase text-[10px] animate-pulse">Initializing Protocol</p>
              </div>
          </div>
      );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg-dark flex flex-col selection:bg-primary/20">
        {!user ? (
           <MockAuthModal onLogin={handleLogin} />
        ) : (
           user.name === 'Anonymous' ? (
              <ProfileSetup user={user} onComplete={handleProfileComplete} />
           ) : (
              <Dashboard 
                user={user} 
                onLogout={handleLogout} 
                onProfileUpdate={handleProfileComplete} 
              />
           )
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
