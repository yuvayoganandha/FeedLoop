import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MockAuthModal from './components/MockAuthModal';
import ProfileSetup from './pages/ProfileSetup';
import SplashScreen from './components/SplashScreen';

function App() {
  const [user, setUser] = useState(null);
  // Only show splash if the intro video actually exists (avoids ORB media fetch error in production)
  const [isSplashing, setIsSplashing] = useState(false);

  useEffect(() => {
    // Check if the intro video resource exists before attempting to show splash
    fetch('/intro.mp4', { method: 'HEAD' })
      .then(r => { if (r.ok) setIsSplashing(true); })
      .catch(() => {}); // silently skip splash if video missing

    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
        setUser(JSON.parse(storedUser));
    }
    
    return () => {};
  }, []);

  const handleSplashComplete = () => {
    setIsSplashing(false);
  };

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
      return <SplashScreen onComplete={handleSplashComplete} />;
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
