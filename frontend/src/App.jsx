import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MockAuthModal from './components/MockAuthModal';
import ProfileSetup from './pages/ProfileSetup';

function App() {
  const [user, setUser] = useState(null);
  const [isSplashing, setIsSplashing] = useState(true);

  // Clean Material Intro Check
  useEffect(() => {
    const splashTimer = setTimeout(() => {
        setIsSplashing(false);
    }, 2500); // Shorter, cleaner intro
    
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
          <div className="h-screen w-screen bg-[#f8f9fa] flex flex-col items-center justify-center overflow-hidden font-sans">
              <div className="relative z-10 text-center animate-scale-in">
                 <h1 className="text-[64px] font-medium text-[#202124] tracking-tight mb-2">FeedLoop</h1>
                 <p className="text-[#5f6368] font-bold tracking-[0.6em] uppercase text-[10px] animate-pulse">Establishing Connection</p>
              </div>
              
              {/* Subtle Material Accent */}
              <div className="absolute bottom-20 flex space-x-2">
                 <div className="h-2 w-2 rounded-full bg-[#4285f4] animate-bounce" style={{ animationDelay: '0s' }} />
                 <div className="h-2 w-2 rounded-full bg-[#ea4335] animate-bounce" style={{ animationDelay: '0.2s' }} />
                 <div className="h-2 w-2 rounded-full bg-[#fbbc05] animate-bounce" style={{ animationDelay: '0.4s' }} />
                 <div className="h-2 w-2 rounded-full bg-[#34a853] animate-bounce" style={{ animationDelay: '0.6s' }} />
              </div>
          </div>
      );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col selection:bg-blue-100">
        {!user ? (
           <MockAuthModal onLogin={handleLogin} />
        ) : (
           user.name === 'Anonymous' ? (
              <ProfileSetup user={user} onComplete={handleProfileComplete} />
           ) : (
              <Dashboard 
                user = {user}
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
